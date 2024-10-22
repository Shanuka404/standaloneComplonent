var content = document.getElementById("content");
var textElements = content.querySelectorAll('.topic');
var returnDelay = 300;
var timeout;

window.addEventListener("scroll", function() {
    clearTimeout(timeout);

    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    var contentHeight = content.offsetHeight;
    var contentTop = content.offsetTop;


    var contentMiddle = contentTop + contentHeight / 2;
    var viewportMiddle = scrollY + windowHeight / 2;
    var distanceToMiddle = Math.abs(contentMiddle - viewportMiddle);

    var maxZoom = 1.1;
    var maxTextShrink = 0.9;
    var scaleFactor = 1 + Math.max(0, (windowHeight / 2 - distanceToMiddle) / (windowHeight / 2) * (maxZoom - 1));
    var textScaleFactor = 1 - Math.max(0, (windowHeight / 2 - distanceToMiddle) / (windowHeight / 2) * (1 - maxTextShrink));
    
    content.style.transition = "transform 1s ease-out";
    content.style.transform = "scale(" + scaleFactor + ")";

    textElements.forEach(function(text) {
        text.style.transition = "transform 1s ease-out";
        text.style.transform = "scale(" + textScaleFactor + ")";
    });

    // Smoothly return to normal when scrolling stops
    timeout = setTimeout(function() {
        content.style.transition = "transform 1s ease";
        content.style.transform = "scale(1)";

        textElements.forEach(function(text) {
            text.style.transition = "transform 1s ease";
            text.style.transform = "scale(1)";
        });

    }, returnDelay);
});
