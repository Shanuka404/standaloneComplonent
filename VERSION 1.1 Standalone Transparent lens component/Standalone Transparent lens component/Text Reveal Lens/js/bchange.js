document.addEventListener('mousemove', function(event) {
    const x = event.clientX;
    const y = event.clientY;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const red = Math.round((x / width) * 255);
    const green = Math.round((y / height) * 255);
    const blue = Math.round(((x / width) + (y / height)) / 2 * 255);

    document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
});