const lens = document.querySelector('.lens');
const textFront = document.querySelector('.text-front');
const textBack = document.querySelector('.text-back');
const container = document.querySelector('.container');

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    targetX = e.clientX - rect.left;
    targetY = e.clientY - rect.top;
});

function applyMask() {
    const maskX = currentX;
    const maskY = currentY;
    const maskRadius = 90;
    const maskCSS = `radial-gradient(circle ${maskRadius}px at ${maskX}px ${maskY}px, transparent ${maskRadius}px, black ${maskRadius}px)`;

    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        // Safari-specific adjustments
        textFront.style.webkitMaskImage = maskCSS;
    } else {
        textFront.style.maskImage = maskCSS;
    }

    textBack.style.setProperty('--clip-x', `${currentX}px`);
    textBack.style.setProperty('--clip-y', `${currentY}px`);
    textBack.style.clipPath = `circle(90px at var(--clip-x) var(--clip-y))`;
}

function animate() {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.1;
    currentY += dy * 0.1;
    lens.style.transform = `translate(${currentX - lens.clientWidth / 2}px, ${currentY - lens.clientHeight / 2}px)`;

    applyMask();

    requestAnimationFrame(animate);
}

animate();