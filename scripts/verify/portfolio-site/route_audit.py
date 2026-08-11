from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path

from playwright.sync_api import (
    Browser,
    Page,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)


ROOT_DIR = Path(__file__).resolve().parents[3]
OUTPUT_DIR = ROOT_DIR / "logs" / "visual-audit"
BASE_URL = os.environ.get("AUDIT_URL", "http://127.0.0.1:3002")
BROWSER_EXECUTABLE = os.environ.get(
    "AUDIT_BROWSER", "C:/Program Files/Google/Chrome/Application/chrome.exe"
)


@dataclass(frozen=True)
class RouteCase:
    path: str
    heading: str
    active_label: str | None


@dataclass(frozen=True)
class RouteResult:
    path: str
    title: str
    horizontal_overflow: bool
    console_errors: tuple[str, ...]


ROUTES = (
    RouteCase("/work", "Selected work.", "Work"),
    RouteCase("/notes", "Notes, decisions, failures.", "Notes"),
    RouteCase("/services", "Services, routes, status.", "Services"),
    RouteCase("/lab", "Small experiments, real code.", "Lab"),
    RouteCase("/about", "Human, debuggable.", "About"),
    RouteCase("/missing-route-audit", "Lost signal. Keep running.", None),
)


def audit_route(browser: Browser, route: RouteCase, mobile: bool) -> RouteResult:
    viewport = {"width": 390, "height": 844} if mobile else {"width": 1440, "height": 900}
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        is_mobile=mobile,
        has_touch=mobile,
    )
    page: Page = context.new_page()
    console_errors: list[str] = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: console_errors.append(str(error)))

    response = page.goto(
        f"{BASE_URL}{route.path}", wait_until="domcontentloaded", timeout=60_000
    )
    try:
        page.wait_for_load_state("networkidle", timeout=8_000)
    except PlaywrightTimeoutError:
        pass
    assert response is not None
    expected_status = 404 if route.active_label is None else 200
    assert response.status == expected_status, f"{route.path}: {response.status}"
    page.get_by_role("heading", name=route.heading).wait_for(state="visible")

    if route.active_label:
        active_link = page.locator(f"header a[aria-current='page']", has_text=route.active_label)
        assert active_link.count() == 1
    else:
        game_canvas = page.locator("[data-dino-game] canvas[data-game-ready='true']")
        game_canvas.wait_for(state="visible", timeout=15_000)
        assert page.locator("[data-dino-game]").get_attribute("data-game-status") == "ready"

    overflow = bool(
        page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
    )
    assert not overflow, f"{route.path} has horizontal overflow"

    suffix = "mobile" if mobile else "desktop"
    safe_name = route.path.strip("/").replace("/", "-") or "home"
    page.screenshot(path=OUTPUT_DIR / f"route-{safe_name}-{suffix}.png", full_page=True)
    result = RouteResult(
        path=route.path,
        title=page.title(),
        horizontal_overflow=overflow,
        console_errors=tuple(
            error
            for error in console_errors
            if not (
                expected_status == 404
                and "Failed to load resource" in error
                and "404" in error
            )
        ),
    )
    context.close()
    return result


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser_path = Path(BROWSER_EXECUTABLE)
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=str(browser_path) if browser_path.exists() else None,
        )
        results = tuple(
            audit_route(browser, route, mobile)
            for mobile in (False, True)
            for route in ROUTES
        )
        browser.close()

    for result in results:
        assert not result.console_errors, (result.path, result.console_errors)

    report_path = OUTPUT_DIR / "routes-report.json"
    report_path.write_text(
        json.dumps([asdict(result) for result in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[routes] {len(results)} desktop/mobile checks passed")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
