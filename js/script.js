/* ============================================================
   Jamie Kim — Portfolio v2 · interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initNavScroll();
    initMobileMenu();
    initScrollSpy();
    initExperienceTabs();
    initReveal();
    initCursorGlow();
});

/* ---- nav background on scroll ---- */
function initNavScroll() {
    const nav = document.getElementById("nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---- mobile menu ---- */
function initMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("mobileMenu");
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menu.hidden = !open;
    };

    toggle.addEventListener("click", () => setOpen(menu.hidden));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
}

/* ---- highlight the section currently in view ----
   Scroll-position based (deterministic): the active section is the last one
   whose top has passed a line ~35% down the viewport. Always exactly one
   active, with no gaps or wrong-section flicker between sections. */
function initScrollSpy() {
    const links = Array.from(document.querySelectorAll(".nav__links a"));
    const map = links
        .map((a) => ({ link: a, section: document.querySelector(a.getAttribute("href")) }))
        .filter((x) => x.section);
    if (!map.length) return;

    const setActive = () => {
        const line = window.scrollY + window.innerHeight * 0.35;
        let current = map[0];
        for (const item of map) {
            if (item.section.offsetTop <= line) current = item;
        }
        links.forEach((a) => a.classList.toggle("is-active", a === current.link));
    };

    setActive();
    window.addEventListener("scroll", setActive, { passive: true });
    window.addEventListener("resize", setActive);
}

/* ---- experience tabs ---- */
function initExperienceTabs() {
    const tabs = Array.from(document.querySelectorAll(".xp__tab"));
    if (!tabs.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const panelId = tab.dataset.panel;

            tabs.forEach((t) => {
                const active = t === tab;
                t.classList.toggle("is-active", active);
                t.setAttribute("aria-selected", String(active));
            });

            document.querySelectorAll(".xp__panel").forEach((panel) => {
                panel.hidden = panel.id !== panelId;
                panel.classList.toggle("is-active", panel.id === panelId);
            });
        });
    });
}

/* ---- reveal on scroll ---- */
function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        // trigger as soon as any part enters the viewport, so nothing can get
        // stranded invisible when the user jumps straight to a section
        { threshold: 0.01 }
    );
    items.forEach((el) => observer.observe(el));
}

/* ---- soft pacman-yellow glow that follows the cursor ---- */
function initCursorGlow() {
    const glow = document.getElementById("pacCursor");
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return;

    let raf = null;
    window.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            glow.style.left = `${e.clientX}px`;
            glow.style.top = `${e.clientY}px`;
            glow.style.opacity = "1";
            raf = null;
        });
    });
    window.addEventListener("mouseleave", () => (glow.style.opacity = "0"));
}
