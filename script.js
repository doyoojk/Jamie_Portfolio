let lastMouseX = 0;
let lastMouseY = 0;

const updateCursorEffectPosition = () => {
    const cursorEffect = document.getElementById('cursor-effect');
    cursorEffect.style.left = `${lastMouseX + window.scrollX}px`;
    cursorEffect.style.top = `${lastMouseY + window.scrollY}px`;
};

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    const documentHeight = document.body.scrollHeight - window.innerHeight;
    const ratio = scrollY / documentHeight;

    // Calculate intermediate color between #19141F and #4D637C
    const startColor = { r: 25, g: 20, b: 31 };
    const endColor = { r: 77, g: 99, b: 124 };
    const newColor = {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * ratio),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * ratio),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * ratio),
    };
    const newColorHex = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;

    header.style.backgroundColor = newColorHex;

    // Update cursor effect position on scroll
    updateCursorEffectPosition();
});

document.addEventListener('mousemove', (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // Update cursor effect position on mouse move
    updateCursorEffectPosition();
});
