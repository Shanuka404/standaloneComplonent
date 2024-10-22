$(document).ready(function() {
    let currentIndex = 0;
    let autoPlayInterval;
    let previousIndex = 0;
    let mediaItems = [];
    
    $('.media-item').each(function() {
        let $this = $(this);
        let type = $this.data('type');
        let src = $this.data('src');
        let duration = $this.data('duration') || 0;

        mediaItems.push({ type: type, src: src, duration: duration });
    });

    function showFeatureItem(index) {
        $('.feature-item.active').removeClass('active');
        $('.progress-bar').hide();

        let $item = $('.feature-item').eq(index);

        $item.addClass('active');
        $item.find('.progress-bar').show();

        let mediaItem = mediaItems[index];

        $('.media-box').empty();

        if (mediaItem.type === 'image') {
            $('.media-box').append('<img src="' + mediaItem.src + '" alt="Image">');
            startProgressBar($item.find('.progress-fill'), mediaItem.duration);
        } else if (mediaItem.type === 'video') {
            let videoElement = $('<video muted>Your browser does not support the video tag.</video>');
            let playPauseButton = $('<div class="play-pause-button"><i class="fas fa-pause"></i></div>');

            videoElement.append('<source src="' + mediaItem.src + '" type="video/mp4">');
            videoElement.append('<source src="' + mediaItem.src.replace('.mp4', '.webm') + '" type="video/webm">');

            $('.media-box').append(videoElement);
            $('.media-box').append(playPauseButton);

            videoElement[0].play();
            playPauseButton.html('<i class="fas fa-pause"></i>');

            videoElement.on('loadedmetadata', function() {
                startProgressBar($item.find('.progress-fill'), videoElement[0].duration * 1000);
            });

            videoElement.on('ended', function() {
                nextFeatureItem();
            });

            playPauseButton.on('click', function() {
                if (videoElement[0].paused) {
                    videoElement[0].play();
                    playPauseButton.html('<i class="fas fa-pause"></i>');

                    let currentTime = videoElement[0].currentTime;
                    let remainingTime = (videoElement[0].duration - currentTime) * 1000;

                    let $progressFill = $item.find('.progress-fill');
                    let currentWidth = $progressFill.width();
                    $progressFill.css({
                        width: currentWidth + 'px',
                        transition: 'none'
                    });

                    setTimeout(function() {
                        $progressFill.css({
                            width: '100%',
                            transition: 'width ' + remainingTime + 'ms linear'
                        });
                    }, 50);

                } else {
                    videoElement[0].pause();
                    playPauseButton.html('<i class="fas fa-play"></i>');

                    stopProgressBar($item.find('.progress-fill'));
                }
            });
        }
        
        $('.feature-content').hide();
        $item.find('.feature-content').show();

        clearTimeout(autoPlayInterval);
        if (mediaItem.type === 'image') {
            autoPlayInterval = setTimeout(nextFeatureItem, mediaItem.duration);
        }

        $('.feature-item').css('animation', '');
        if (index === 0 || index < previousIndex) {
            $item.css('animation', 'expandTopDown 2.8s ease forwards');
        } else {
            $item.css('animation', 'expandBottomUp 0.8s ease forwards');
        }

        previousIndex = index;
    }

    function startProgressBar($progressFill, duration) {
        $progressFill.css({
            width: '0',
            transition: 'none'
        });

        setTimeout(function() {
            $progressFill.css({
                width: '100%',
                transition: 'width ' + duration + 'ms linear'
            });
        }, 50);
    }

    function stopProgressBar($progressFill) {
        $progressFill.css({
            transition: 'none',
            width: $progressFill.width()
        });
    }

    function nextFeatureItem() {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        showFeatureItem(currentIndex);
    }

    function showMediaUnderFeatureItems() {
        $('.media-box-before').remove();
    
        $('.feature-item').each(function(index) {
            let mediaItem = mediaItems[index];
            let $item = $(this);
    
            let mediaBox = $('<div class="media-box-before"></div>');
    
            if (mediaItem.type === 'image') {
                mediaBox.append('<img src="' + mediaItem.src + '" alt="Image" class="full-width">');
            } else if (mediaItem.type === 'video') {
                let videoElement = $('<video muted loop>Your browser does not support the video tag.</video>');
                videoElement.append('<source src="' + mediaItem.src + '" type="video/mp4">');
                videoElement.append('<source src="' + mediaItem.src.replace('.mp4', '.webm') + '" type="video/webm">');
                mediaBox.append(videoElement);
    
                let playPauseButton = $('<div class="play-pause-button"><i class="fas fa-play"></i></div>');
                mediaBox.append(playPauseButton);
    
                let progressBar = $('<div class="progress-bar"><div class="progress-fill"></div></div>');
                mediaBox.append(progressBar);
    
                playPauseButton.on('click', function() {
                    if (videoElement[0].paused) {
                        videoElement[0].play();
                        playPauseButton.html('<i class="fas fa-pause"></i>');
                        startProgressBar(progressBar.find('.progress-fill'), videoElement[0].duration * 1000);
                        clearTimeout(autoPlayInterval);
                        autoPlayInterval = setTimeout(nextFeatureItem, videoElement[0].duration * 1000);
                    } else {
                        videoElement[0].pause();
                        playPauseButton.html('<i class="fas fa-play"></i>');
                        stopProgressBar(progressBar.find('.progress-fill'));
                        clearTimeout(autoPlayInterval);
                    }
                });
    
                videoElement[0].addEventListener('ended', function() {
                    playPauseButton.html('<i class="fas fa-play"></i>');
                    stopProgressBar(progressBar.find('.progress-fill'));
                    clearTimeout(autoPlayInterval);
                    nextFeatureItem();
                });
    
                videoElement[0].addEventListener('play', function() {
                    playPauseButton.html('<i class="fas fa-pause"></i>');
                });
    
                videoElement[0].addEventListener('pause', function() {
                    playPauseButton.html('<i class="fas fa-play"></i>');
                });
    
                videoElement[0].play();
                startProgressBar(progressBar.find('.progress-fill'), videoElement[0].duration * 1000);
            }
    
            $item.before(mediaBox);
        });
    }
    
    function addSeparatorLines() {
        $('.feature-item').each(function() {
            $(this).find('.feature-content').after('<div class="separator-line-after"></div>');
        });
    }

    addSeparatorLines();
    
    $(window).resize(function() {
        if ($(window).width() <= 1111) {
            $('.feature-item').removeClass('active');
            $('.progress-bar').hide();
            clearTimeout(autoPlayInterval);
            $('.media-box').empty();
            showMediaUnderFeatureItems();
            $('.feature-content').show();
            $('.separator-line-after').remove();
            addSeparatorLines();
        } else {
            $('.media-box-before').remove();
            $('.separator-line-after').remove();
            startAutoPlay();
        }
    });

    function startAutoPlay() {
        if ($(window).width() > 1111) {
            showFeatureItem(currentIndex);
        } else {
            showMediaUnderFeatureItems();
        }
    }

    startAutoPlay();

    $('.feature-item').click(function() {
        currentIndex = $(this).index();
        showFeatureItem(currentIndex);
    });
});
