from __future__ import annotations

from playwright.sync_api import (
    ConsoleMessage,
    Page,
    Request,
    TimeoutError as PlaywrightTimeoutError,
)


def attach_diagnostics(
    page: Page,
) -> tuple[list[str], list[str], list[str]]:
    console_errors: list[str] = []
    request_failures: list[str] = []
    http_errors: list[str] = []

    def on_console(message: ConsoleMessage) -> None:
        if message.type == "error":
            console_errors.append(message.text)

    def on_failed(request: Request) -> None:
        failure = request.failure or "unknown failure"
        if request.resource_type == "media" and failure == "net::ERR_ABORTED":
            return
        if "_rsc=" in request.url and failure == "net::ERR_ABORTED":
            return
        request_failures.append(f"{request.url}: {failure}")

    page.on("console", on_console)
    page.on("pageerror", lambda error: console_errors.append(str(error)))
    page.on("requestfailed", on_failed)
    page.on(
        "response",
        lambda response: http_errors.append(f"{response.status} {response.url}")
        if response.status >= 400
        else None,
    )
    return console_errors, request_failures, http_errors


def scroll_to(page: Page, selector: str, offset: int = 0) -> None:
    page.locator(selector).first.evaluate(
        """(element, offset) => {
          const top = element.getBoundingClientRect().top + window.scrollY + offset;
          window.scrollTo({ top, behavior: "instant" });
        }""",
        offset,
    )
    page.wait_for_timeout(900)


def open_home(page: Page, base_url: str) -> None:
    page.goto(base_url, wait_until="domcontentloaded", timeout=60_000)
    page.locator("header").first.wait_for(state="visible")
    try:
        page.wait_for_load_state("networkidle", timeout=10_000)
    except PlaywrightTimeoutError:
        pass
    loading_gate = page.locator("[data-loading-gate]")
    if loading_gate.count() > 0:
        loading_gate.wait_for(state="detached", timeout=6_000)


def reveal_and_check_portrait_finale(page: Page) -> None:
    portrait = page.locator("section[aria-label='人物揭示']")
    portrait.wait_for(state="visible")
    portrait.evaluate(
        """element => {
          const top = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: top + element.offsetHeight - window.innerHeight - 4,
            behavior: "instant",
          });
        }"""
    )
    page.wait_for_timeout(1_600)

    entry = page.locator("[data-dino-entry]")
    finale_opacity = entry.evaluate(
        """element => {
          const finale = element.closest("[data-portrait-finale]");
          return finale ? Number(getComputedStyle(finale).opacity) : 0;
        }"""
    )
    assert finale_opacity >= 0.9, f"人物终局未充分显现，当前 opacity={finale_opacity:.2f}"

    entry_box = entry.bounding_box()
    skills_box = page.locator("[data-portrait-skills]").bounding_box()
    marquee_box = page.locator(".marquee-track-right").first.bounding_box()
    viewport_height = page.evaluate("window.innerHeight")
    assert entry_box is not None and skills_box is not None and marquee_box is not None
    entry_bottom = entry_box["y"] + entry_box["height"]
    skills_bottom = skills_box["y"] + skills_box["height"]
    marquee_bottom = marquee_box["y"] + marquee_box["height"]
    assert entry_box["y"] >= skills_bottom + 12, (
        f"恐龙入口顶部 {entry_box['y']:.1f}px 没有落在签名技能条下方"
    )
    assert entry_box["y"] >= marquee_bottom + 12, (
        f"恐龙入口顶部 {entry_box['y']:.1f}px 与跑马灯底部 {marquee_bottom:.1f}px 重叠"
    )
    assert entry_bottom <= viewport_height - 4, (
        f"恐龙入口底部 {entry_bottom:.1f}px 超出视口 {viewport_height}px"
    )


def assert_card_below_nav(page: Page) -> None:
    nav_box = page.locator("header").first.bounding_box()
    card_box = page.locator("#projects article").first.bounding_box()
    assert nav_box is not None and card_box is not None
    nav_bottom = nav_box["y"] + nav_box["height"]
    assert card_box["y"] >= nav_bottom - 2, (
        f"项目卡顶部 {card_box['y']:.1f}px 被导航底部 {nav_bottom:.1f}px 遮挡"
    )
