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
    cursorEffect.style.top = `${scrollY}px`;
    
});

document.addEventListener('mousemove', (e) => {
    const cursorEffect = document.getElementById('cursor-effect');
    cursorEffect.style.left = `${e.clientX + window.scrollX}px`;
    cursorEffect.style.top = `${e.clientY + window.scrollY}px`;
});