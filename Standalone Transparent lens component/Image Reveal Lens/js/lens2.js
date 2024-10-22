document.addEventListener("DOMContentLoaded", function() {
    const maxLensSize = 180;
    const minLensSize = 50;

    const imageContainers = document.querySelectorAll('.image-container');

    imageContainers.forEach(container => {
        const mainImage = container.querySelector('.main-image');
        const lens = container.querySelector('.lens');
        const zoomImage = container.querySelector('.zoom-image');

        container.addEventListener('mousemove', function(e) {
            moveLens(e, lens, mainImage, zoomImage);
        });

        container.addEventListener('mouseenter', function() {
            lens.style.display = 'block';
        });

        container.addEventListener('mouseleave', function() {
            lens.style.display = 'none';
        });
    });

    let animationTimeout;

function moveLens(e, lens, mainImage, zoomImage) {
    const pos = getCursorPos(e, mainImage);
    const distanceToLeft = pos.x;
    const distanceToRight = mainImage.clientWidth - pos.x;
    const distanceToTop = pos.y;
    const distanceToBottom = mainImage.clientHeight - pos.y;

    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    const scaleFactor = minDistance / (mainImage.clientWidth / 2); 
    const dynamicLensSize = minLensSize + (maxLensSize - minLensSize) * scaleFactor;

    const cursorX = pos.x - (dynamicLensSize / 2);
    const cursorY = pos.y - (dynamicLensSize / 2);

    lens.style.width = dynamicLensSize + 'px';
    lens.style.height = dynamicLensSize + 'px';

    lens.style.transition = 'none'; 
    lens.style.left = cursorX + 'px';
    lens.style.top = cursorY + 'px';

    zoomImage.style.transition = 'none';
    zoomImage.style.left = -cursorX + 'px';
    zoomImage.style.top = -cursorY + 'px';

    if (minDistance <= 1) {
        animateLensSize(lens, minLensSize, 0.2);
    }else {
        animateLensSize(lens, 180, 1.8);
    }

    clearTimeout(animationTimeout);

    if (minDistance >= 1) {
        animationTimeout = setTimeout(() => {
            animateLensSize(lens, 100, 1.8);
        }, 200);
    }
}

function animateLensSize(lens, size, duration) {
    lens.style.transition = `width ${duration}s ease, height ${duration}s ease`; // Add transition effect with easing
    lens.style.width = size + 'px';
    lens.style.height = size + 'px';
}

function getCursorPos(e, mainImage) {
    const rect = mainImage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x: x, y: y };
}
});