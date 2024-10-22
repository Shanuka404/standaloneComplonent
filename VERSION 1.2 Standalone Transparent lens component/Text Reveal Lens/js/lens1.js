const containers = document.querySelectorAll('.container');
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function applyLensAndMask(container, lens, textFront, textBack) {
    const rect = container.getBoundingClientRect();
    
    lens.style.left = `${currentX - rect.left - lens.offsetWidth / 2}px`;
    lens.style.top = `${currentY - rect.top - lens.offsetHeight / 2}px`;
    
    const maskRadius = 90;
    const maskCSS = `radial-gradient(circle ${maskRadius}px at ${currentX - rect.left}px ${currentY - rect.top}px, transparent ${maskRadius}px, black ${maskRadius}px)`;
    
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        textFront.style.webkitMaskImage = maskCSS;
    } else {
        textFront.style.maskImage = maskCSS;
    }
    
    textBack.style.setProperty('--clip-x', `${currentX - rect.left}px`);
    textBack.style.setProperty('--clip-y', `${currentY - rect.top}px`);
    textBack.style.clipPath = `circle(90px at var(--clip-x) var(--clip-y))`;
}

containers.forEach(container => {
    const lens = container.querySelector('.lens');
    const textFront = container.querySelector('.text-front');
    const textBack = container.querySelector('.text-back');

    function animate() {
        const dx = (targetX - currentX) * 0.05;
        const dy = (targetY - currentY) * 0.05;
        currentX += dx;
        currentY += dy;

        applyLensAndMask(container, lens, textFront, textBack);

        requestAnimationFrame(animate);
    }

    animate();
});
