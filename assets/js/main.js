$(document).ready(function () {

    setTimeout(function () {
        if($('#lyric').length) $("#lyric").mCustomScrollbar({theme: "rounded-dots-dark",   enable: false, autoHideScrollbar: 1});
        if($('#lyric0').length) $("#lyric0").mCustomScrollbar({theme: "minimal",   enable: false, autoHideScrollbar: 1});
        if($('#lyric2').length) $("#lyric2").mCustomScrollbar({theme: "minimal",   enable: false, autoHideScrollbar: 1});
        if($('#lyric3').length) $("#lyric3").mCustomScrollbar({theme: "minimal",   enable: false, autoHideScrollbar: 1});
        //f($('#lyric4').length) $("#lyric4").mCustomScrollbar({theme: "minimal",   enable: false, autoHideScrollbar: 1});

        ytplayer = videojs('video', {
            preload: true,
            controls: true,
            techOrder: ["youtube"],
            sources: [{
                "type": "video/youtube",
                "src": "https://www.youtube-nocookie.com/embed/-DBCvCTFdeI?&list=PLA3DLa5juD7Z9Z-a3i8cqRU6ZHrkgf5Zp"
            }],
            plugins: {
                videoJsResolutionSwitcher: {
                    default: 'high',
                    dynamicLabel: true
                }
            }
        }, function () {
            this.on('resolutionchange', function () {

            })
        });
    }, 6000);
})