var config = {
    map: {
        gps:['camping.geojson', 'all_explore.geojson'],
        kml: ['DAY_1.kml', 'DAY_2.kml', 'DAY_3.kml'],
        kmz: ['lich-trinh-00.kmz', 'hue-to-thanhhoa.kmz', 'Ha-Giang.kmz' , 'endline.kmz'],
        gpx: ['dong_bac_project.gpx', 'ha_giang_touring.gpx'],
        maker_icon: {
            exp:{
                icon:'eye',
                markerColor:'orange',
                prefix:'fa',
                iconColor:'white',
                spin:true,
            },
            camping:{
                icon:'campground',
                markerColor: 'red',
                prefix: 'fa',
                iconColor: 'white'
            },
            beach: {
                icon: 'umbrella-beach',
                markerColor: 'blue',
                prefix: 'fa',
                iconColor: 'white'
            },
            motorcycle: {
                icon: 'motorcycle',
                prefix: 'fa',
                markerColor: 'cadetblue',
                iconColor: 'solid',
                spin: false
            }
        },
        is_google_statellite: false,
        is_showing_meter: true,
        auto_routing: false,
        auto_zoom: false,
        maker: "images/maker.png",
        maker_vemon: "images/vemon.png",
        maker_shadow: "images/marker-shadow.png",
        type: "hybrid",
        key: "AIzaSyB3W5D8BP4I2KLTbTlHaFndHve9RV7A-4k",
        width: 500,
        height: 500,
        speed: 0,
        zoom: 17,
        maxZoom: 18,
        minZoom: 8,
        lat: 0,
        long: 0,
        accuracy: 0,
        timeout: 5000,
        timereset: 100,
    },
    meter: {
        width: 500,
        height: 500,
        maxseed: 140,
        rpm: .1,
        gear: "N",
    }
}
var database = [
    {
        username: "ad",
        password: "min"
    },
    {
        username: "ad",
        password: "min"
    }
];
var old_config = config;

function reset_config() {
    config = old_config;
}

function toggleFullScreen() {
    let elem = document.querySelector("body");

    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
        // document.addEventListener("mousedown", toggleFullScreen);

    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        //  document.removeEventListener("mousedown", toggleFullScreen);
    }
}

