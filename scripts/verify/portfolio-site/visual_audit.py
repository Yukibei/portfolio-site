from __future__ import annotations

import json
import os
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import TypedDict, cast

from playwright.sync_api import (
    Browser,
    BrowserContext,
    Page,
    sync_playwright,
)

from audit_support import (
    assert_card_below_nav,
    attach_diagnostics,
    open_home,
    reveal_and_check_portrait_finale,
    scroll_to,
)


ROOT_DIR = Path(__file__).resolve().parents[3]
OUTPUT_DIR = ROOT_DIR / "logs" / "visual-audit"
BASE_URL = os.environ.get("AUDIT_URL", "http://127.0.0.1:3002")
BROWSER_EXECUTABLE = os.environ.get(
    "AUDIT_BROWSER", "C:/Program Files/Google/Chrome/Application/chrome.exe"
)


class ViewportSize(TypedDict):
    width: int
    height: int


class CanvasStats(TypedDict):
    non_transparent: int
    colored: int
    pixel_hash: int


@dataclass(frozen=True)
class AuditResult:
    name: str
    assertions: tuple[str, ...]
    console_errors: tuple[str, ...]
    request_failures: tuple[str, ...]
    http_errors: tuple[str, ...]


def read_canvas_stats(page: Page) -> CanvasStats:
    raw_stats = page.locator(".experience-lanyard[data-active='true'] canvas").evaluate(
        """canvas => {
          const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
          if (!gl) return { non_transparent: 0, colored: 0, pixel_hash: 0 };
          const pixels = new Uint8Array(canvas.width * canvas.height * 4);
          gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          let nonTransparent = 0;
          let colored = 0;
          let hash = 2166136261;
          for (let i = 0; i < pixels.length; i += 64) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            if (a > 0) nonTransparent += 1;
            if (r + g + b > 24) colored += 1;
            hash ^= r + (g << 8) + (b << 16) + (a << 24);
            hash = Math.imul(hash, 16777619) >>> 0;
          }
          return {
            non_transparent: nonTransparent,
            colored,
            pixel_hash: hash,
          };
        }"""
    )
    return cast(CanvasStats, raw_stats)


def audit_desktop(browser: Browser) -> AuditResult:
    viewport: ViewportSize = {"width": 1440, "height": 900}
    context: BrowserContext = browser.new_context(viewport=viewport, device_scale_factor=1)
    page = context.new_page()
    console_errors, request_failures, http_errors = attach_diagnostics(page)
    assertions: list[str] = []

    open_home(page, BASE_URL)
    page.screenshot(path=OUTPUT_DIR / "desktop-hero.png")

    reveal_and_check_portrait_finale(page)
    page.screenshot(path=OUTPUT_DIR / "desktop-portrait-finale.png")
    assertions.append("人物终局的小恐龙入口位于签名下方且可见")

    scroll_to(page, "#projects", 120)
    assert_card_below_nav(page)
    assert page.locator("#projects article").count() == 5
    assert page.locator("#projects article").first.locator("figure:visible").count() == 1
    assert page.get_by_role("link", name="View case study").count() == 5
    page.screenshot(path=OUTPUT_DIR / "desktop-projects.png")
    assertions.extend(("项目区避开固定导航", "首页展示五个精选项目", "Features Chess 详情入口完整"))

    page.get_by_role("link", name="View case study").first.click()
    page.wait_for_url("**/work/ai-ppt-platform")
    page.get_by_role("heading", name="AI PPT Platform").wait_for(state="visible")
    assert page.get_by_text("What I chose, and why.", exact=True).count() == 1
    priority_media = page.locator("[data-project-media-priority='true'] img")
    assert priority_media.count() == 2
    for index in range(priority_media.count()):
        page.wait_for_function(
            """index => {
              const images = document.querySelectorAll(
                "[data-project-media-priority='true'] img"
              );
              const image = images[index];
              return image instanceof HTMLImageElement
                && image.complete
                && image.naturalWidth > 0;
            }""",
            arg=index,
        )
    page.screenshot(path=OUTPUT_DIR / "desktop-case-study.png")
    assertions.append("项目详情页首屏媒体已加载，并包含指标与工程决策")

    open_home(page, BASE_URL)
    scroll_to(page, "#experience", 180)
    canvas = page.locator(".experience-lanyard[data-active='true'] canvas")
    canvas.wait_for(state="visible", timeout=20_000)
    page.wait_for_timeout(2_000)
    first_stats = read_canvas_stats(page)
    page.wait_for_timeout(700)
    second_stats = read_canvas_stats(page)
    assert first_stats["non_transparent"] > 500
    assert first_stats["colored"] > 500
    assert first_stats["pixel_hash"] != second_stats["pixel_hash"]
    page.screenshot(path=OUTPUT_DIR / "desktop-experience-lanyard.png")
    assertions.append("3D 工作证 Canvas 非空且画面持续运动")

    result = AuditResult(
        name="desktop",
        assertions=tuple(assertions),
        console_errors=tuple(console_errors),
        request_failures=tuple(request_failures),
        http_errors=tuple(http_errors),
    )
    context.close()
    return result


def audit_mobile(browser: Browser) -> AuditResult:
    viewport: ViewportSize = {"width": 390, "height": 844}
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        is_mobile=True,
        has_touch=True,
    )
    page = context.new_page()
    console_errors, request_failures, http_errors = attach_diagnostics(page)
    video_requests: list[str] = []
    page.on(
        "request",
        lambda request: video_requests.append(request.url)
        if "hero-video.mp4" in request.url
        else None,
    )
    assertions: list[str] = []

    open_home(page, BASE_URL)
    page.wait_for_timeout(1_500)
    assert not video_requests, f"移动端仍请求首屏视频：{video_requests}"
    page.screenshot(path=OUTPUT_DIR / "mobile-hero.png")
    assertions.append("移动端首屏仅加载 poster，不请求 MP4")

    reveal_and_check_portrait_finale(page)
    page.screenshot(path=OUTPUT_DIR / "mobile-portrait-finale.png")
    assertions.append("移动端人物终局的小恐龙入口位于签名下方且可见")

    scroll_to(page, "#projects", 100)
    assert_card_below_nav(page)
    assert page.locator("#projects article").count() == 5
    assert page.locator("#projects article").first.locator("figure:visible").count() == 1
    no_horizontal_overflow = page.evaluate(
        "document.documentElement.scrollWidth <= window.innerWidth + 1"
    )
    assert no_horizontal_overflow
    page.screenshot(path=OUTPUT_DIR / "mobile-projects.png")
    assertions.extend(("移动端项目区避开固定导航", "移动端展示五个精选项目", "页面无横向溢出"))

    scroll_to(page, "#experience", 120)
    page.wait_for_timeout(1_200)
    assert page.locator("canvas.lanyard-canvas").count() == 0
    page.screenshot(path=OUTPUT_DIR / "mobile-experience.png")
    assertions.append("移动端不创建桌面专属 3D Canvas")

    result = AuditResult(
        name="mobile",
        assertions=tuple(assertions),
        console_errors=tuple(console_errors),
        request_failures=tuple(request_failures),
        http_errors=tuple(http_errors),
    )
    context.close()
    return result


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser_path = Path(BROWSER_EXECUTABLE)
        if browser_path.exists():
            browser = playwright.chromium.launch(
                headless=True,
                executable_path=str(browser_path),
            )
        else:
            browser = playwright.chromium.launch(headless=True)
        results = (audit_desktop(browser), audit_mobile(browser))
        browser.close()

    report_path = OUTPUT_DIR / "report.json"
    report_path.write_text(
        json.dumps([asdict(result) for result in results], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    for result in results:
        assert not result.console_errors, result.console_errors
        assert not result.request_failures, result.request_failures
        assert not result.http_errors, result.http_errors
        print(f"[{result.name}] {len(result.assertions)} assertions passed")
    print(f"Report: {report_path}")


if __name__ == "__main__":
    main()
