from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path

from playwright.sync_api import Browser, Page, sync_playwright

from audit_support import open_home, reveal_and_check_portrait_finale


ROOT_DIR = Path(__file__).resolve().parents[3]
OUTPUT_DIR = ROOT_DIR / "logs" / "visual-audit"
BASE_URL = os.environ.get("AUDIT_URL", "http://127.0.0.1:3002")
BROWSER_EXECUTABLE = os.environ.get(
    "AUDIT_BROWSER", "C:/Program Files/Google/Chrome/Application/chrome.exe"
)


@dataclass(frozen=True)
class GameAuditResult:
    viewport: str
    score: int
    high_score: int
    assertions: tuple[str, ...]
    console_errors: tuple[str, ...]


def read_int_attribute(page: Page, name: str) -> int:
    value = page.locator("[data-dino-game]").get_attribute(name)
    assert value is not None
    return int(value)


def wait_for_status(page: Page, status: str, timeout: int = 10_000) -> None:
    page.wait_for_function(
        "status => document.querySelector('[data-dino-game]')?.dataset.gameStatus === status",
        arg=status,
        timeout=timeout,
    )


def audit_game(browser: Browser, mobile: bool) -> GameAuditResult:
    viewport = {"width": 390, "height": 844} if mobile else {"width": 1440, "height": 900}
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        is_mobile=mobile,
        has_touch=mobile,
    )
    page = context.new_page()
    console_errors: list[str] = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.on("pageerror", lambda error: console_errors.append(str(error)))

    open_home(page, BASE_URL)
    reveal_and_check_portrait_finale(page)
    page.locator("[data-dino-entry]").click()
    page.locator("#dino-runner").wait_for(state="visible")
    assert page.url.endswith("#dino-runner")
    canvas = page.locator("canvas[aria-label='可操作的小恐龙跑酷游戏']")
    canvas.wait_for(state="visible")
    page.wait_for_function(
        "document.querySelector('canvas[data-game-ready=true]') !== null",
        timeout=15_000,
    )
    wait_for_status(page, "ready")

    page.get_by_role("button", name="Start run").click()
    wait_for_status(page, "running")
    page.wait_for_function(
        "Number(document.querySelector('[data-dino-game]')?.dataset.gameScore) >= 1"
    )
    page.wait_for_function(
        "document.querySelector('[data-dino-game]')?.dataset.dinoAirborne === 'false'",
        timeout=5_000,
    )

    if mobile:
        canvas.tap()
    else:
        page.keyboard.press("Space")
    page.wait_for_function(
        "document.querySelector('[data-dino-game]')?.dataset.dinoAirborne === 'true'"
    )
    page.screenshot(
        path=OUTPUT_DIR / f"game-{'mobile' if mobile else 'desktop'}-running.png"
    )

    wait_for_status(page, "game-over", timeout=15_000)
    score = read_int_attribute(page, "data-game-score")
    high_score = read_int_attribute(page, "data-game-high-score")
    assert score > 0 and high_score >= score
    page.screenshot(
        path=OUTPUT_DIR / f"game-{'mobile' if mobile else 'desktop'}-over.png"
    )

    page.get_by_role("button", name="Run again").click()
    wait_for_status(page, "running")
    duck_button = page.get_by_role("button", name="下蹲")
    duck_button.dispatch_event("pointerdown")
    page.wait_for_function(
        "document.querySelector('[data-dino-game]')?.dataset.dinoDucking === 'true'"
    )
    duck_button.dispatch_event("pointerup")
    page.wait_for_function(
        "document.querySelector('[data-dino-game]')?.dataset.dinoDucking === 'false'"
    )
    page.get_by_role("button", name="暂停").click()
    wait_for_status(page, "paused")
    paused_score = read_int_attribute(page, "data-game-score")
    page.wait_for_timeout(500)
    assert read_int_attribute(page, "data-game-score") == paused_score
    page.get_by_role("button", name="继续").click()
    wait_for_status(page, "running")

    overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1")
    assert not overflow
    legacy_page = context.new_page()
    legacy_page.goto(
        f"{BASE_URL}/lab/dino-runner",
        wait_until="domcontentloaded",
        timeout=60_000,
    )
    legacy_page.wait_for_url("**/#dino-runner")
    loading_gate = legacy_page.locator("[data-loading-gate]")
    if loading_gate.count() > 0:
        loading_gate.wait_for(state="detached", timeout=6_000)
    legacy_page.locator("#dino-runner").wait_for(state="visible", timeout=5_000)
    result = GameAuditResult(
        viewport="mobile" if mobile else "desktop",
        score=score,
        high_score=high_score,
        assertions=(
            "首页签名下入口能够展开游戏",
            "素材加载完成",
            "开始、计分、跳跃与下蹲有效",
            "碰撞进入游戏结束",
            "重开与暂停有效",
            "页面无横向溢出",
            "旧独立地址重定向首页游戏",
        ),
        console_errors=tuple(console_errors),
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
        results = (audit_game(browser, False), audit_game(browser, True))
        browser.close()

    for result in results:
        assert not result.console_errors, (result.viewport, result.console_errors)
    report_path = OUTPUT_DIR / "game-report.json"
    report_path.write_text(
        json.dumps([asdict(result) for result in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"[game] {sum(len(result.assertions) for result in results)} checks passed")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
