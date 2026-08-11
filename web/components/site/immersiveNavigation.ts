export const SITE_NAV_IMMERSIVE_EVENT = "site-nav-immersive-change";

export function isSiteNavImmersive() {
  return document.documentElement.hasAttribute("data-site-nav-immersive");
}

export function setSiteNavImmersive(active: boolean) {
  document.documentElement.toggleAttribute("data-site-nav-immersive", active);
  window.dispatchEvent(
    new CustomEvent<boolean>(SITE_NAV_IMMERSIVE_EVENT, { detail: active }),
  );
}
