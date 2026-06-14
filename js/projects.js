/* ============================================================
   Projects — render the pacman maze gallery from data/projects.json
   ============================================================ */

// each trail (row gap) gets its own pair of ghost colors
const GHOST_SETS = [
    ["var(--red)", "var(--pink)"],
    ["var(--cyan)", "var(--orange)"],
    ["var(--violet)", "var(--yellow)"],
];

document.addEventListener("DOMContentLoaded", () => {
    const maze = document.getElementById("maze");
    if (!maze) return;

    fetch("data/projects.json")
        .then((res) => {
            if (!res.ok) throw new Error(`projects.json: ${res.status}`);
            return res.json();
        })
        .then(({ projects }) => renderMaze(maze, projects || []))
        .catch((err) => {
            console.error("Failed to load projects:", err);
            maze.innerHTML =
                '<p style="color:var(--ink-soft);text-align:center">Projects are taking a coffee break. Check back soon.</p>';
        });
});

function renderMaze(maze, projects) {
    maze.innerHTML = "";

    // split into rows of three
    const rows = [];
    for (let i = 0; i < projects.length; i += 3) {
        rows.push(projects.slice(i, i + 3));
    }

    let trailIndex = 0;
    rows.forEach((row, i) => {
        maze.appendChild(buildRow(row));
        if (i < rows.length - 1) maze.appendChild(buildTrail(trailIndex++));
    });

    // alternate each room left/right for the mobile zigzag layout
    maze.querySelectorAll(".proom").forEach((card, i) => {
        card.classList.add(i % 2 === 0 ? "proom--left" : "proom--right");
    });

    // mobile-only: pacman descending the centre trail + a ghost
    maze.appendChild(buildMobileTrail());
}

function buildMobileTrail() {
    const deco = document.createElement("div");
    deco.className = "maze__mtrail";
    deco.setAttribute("aria-hidden", "true");

    const pac = document.createElement("span");
    pac.className = "pac maze__mtrail-pac";
    deco.appendChild(pac);

    const ghost = document.createElement("span");
    ghost.className = "ghost maze__mtrail-ghost";
    ghost.style.setProperty("--gc", "var(--pink)");
    const mouth = document.createElement("span");
    mouth.className = "ghost__mouth";
    ghost.appendChild(mouth);
    deco.appendChild(ghost);

    return deco;
}

function buildRow(projects) {
    const row = document.createElement("div");
    row.className = "maze__row";
    projects.forEach((p) => row.appendChild(buildRoom(p)));
    return row;
}

function buildRoom(p) {
    const card = document.createElement("a");
    card.className = "proom";
    card.href = p.repoUrl || "#";
    card.target = "_blank";
    card.rel = "noopener";
    card.style.setProperty("--accent", p.accent || "var(--violet)");
    card.setAttribute("aria-label", `${p.title} — view on GitHub`);

    // Prefer a (small) looping video; fall back to an image/gif.
    if (p.video) {
        card.classList.add("has-media");
        const video = document.createElement("video");
        video.className = "proom__media";
        Object.assign(video, { autoplay: true, loop: true, muted: true, playsInline: true, preload: "metadata" });
        video.setAttribute("muted", "");
        if (p.poster) video.poster = p.poster;
        const sources = typeof p.video === "string" ? { mp4: p.video } : p.video;
        if (sources.webm) addSource(video, sources.webm, "video/webm");
        if (sources.mp4) addSource(video, sources.mp4, "video/mp4");
        card.appendChild(video);
    } else if (p.media) {
        card.classList.add("has-media");
        const media = document.createElement("div");
        media.className = "proom__media";
        media.style.backgroundImage = `url("${p.media}")`;
        card.appendChild(media);
    }

    const overlay = document.createElement("div");
    overlay.className = "proom__overlay";

    const title = document.createElement("h3");
    title.className = "proom__title";
    title.textContent = p.title;
    overlay.appendChild(title);

    if (p.tag) {
        const tag = document.createElement("span");
        tag.className = "proom__tag";
        tag.textContent = p.tag;
        overlay.appendChild(tag);
    }

    card.appendChild(overlay);
    return card;
}

function addSource(video, src, type) {
    const s = document.createElement("source");
    s.src = src;
    s.type = type;
    video.appendChild(s);
}

function buildTrail(trailIndex = 0) {
    const trail = document.createElement("div");
    trail.className = "maze__trail";
    const colors = GHOST_SETS[trailIndex % GHOST_SETS.length];

    // pellets · ghost · pellets · ghost · pellets · pacman
    const sequence = [
        "pellet", "pellet", "pellet",
        "ghost:0",
        "pellet", "pellet",
        "ghost:1",
        "pellet", "pellet", "pellet",
        "pac",
    ];

    sequence.forEach((item) => {
        if (item.startsWith("ghost")) {
            const idx = Number(item.split(":")[1]) || 0;
            const ghost = document.createElement("span");
            ghost.className = "ghost";
            ghost.style.setProperty("--gc", colors[idx % colors.length]);
            const mouth = document.createElement("span");
            mouth.className = "ghost__mouth";
            ghost.appendChild(mouth);
            trail.appendChild(ghost);
        } else if (item === "pac") {
            const pac = document.createElement("span");
            pac.className = "pac";
            trail.appendChild(pac);
        } else {
            const pellet = document.createElement("span");
            pellet.className = "pellet";
            trail.appendChild(pellet);
        }
    });

    return trail;
}
