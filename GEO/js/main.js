if (!navigator.geolocation) {

} else {
    navigator.geolocation.getCurrentPosition(function (position) {
        config.map.lat = position.coords.latitude;
        config.map.long = position.coords.longitude;
    });
}

var map = undefined;
setTimeout(function () {

    //map = L.map('map').setView([config.map.lat, config.map.long], config.map.zoom);
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: config.map.maxZoom,
        minZoom: config.map.minZoom,
    });
    map = L.map('map', {
        center: [config.map.lat, config.map.long],
        zoom: config.map.zoom,
        maxZoom: config.map.maxZoom,
        minZoom: config.map.minZoom,
        zoomControl: false,
        preferCanvas: true,
        keyboard: false,
        touchZoom: true,
        layers: [osm],
    });

    // osm.addTo(map);


    // google street
    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: config.map.maxZoom + 5,
        minZoom: config.map.minZoom,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // googleStreets.addTo(map);

    //google satellite
    googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: config.map.maxZoom + 5,
        minZoom: config.map.minZoom,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // googleSat.addTo(map)


    var redMarker = L.AwesomeMarkers.icon(config.map.maker_icon.motorcycle);

    var marker = L.marker([config.map.lat, config.map.long], {icon: redMarker}).addTo(map);


    L.DomUtil.addClass(marker._icon, "blinking");


    /*==============================================
                    LAYER CONTROL
    ================================================*/

    L.control
        .locate({
            strings: {
                title: "Show me where I am, yo!"
            }
        })
        .addTo(map);

    L.Control.geocoder({
        defaultMarkGeocode: false
    }).addTo(map);

    /*
    L.Control.MyControl = L.Control.extend({
        onAdd: function(map) {
        var el = L.DomUtil.create('div', 'leaflet-bar my-control');

        el.innerHTML = ' ';//my control
//<a href="javascript:void(0);" onclick="update_auto_zoom_map();" style="outline: none;"> <img id="icon_zoom" src="zoom-out.png" width="100"> </a>

        return el;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
    });

    L.control.myControl = function(opts) {
    return new L.Control.MyControl(opts);
    }
    L.control.myControl({
    position: 'topright'
    }).addTo(map);

    */

    /*
        var baseMaps = {
            "OSM": osm,
            'Google Map': googleStreets,
            "Satellite": googleSat,
        };

        // map.removeLayer(singleMarker)


        var overlayMaps = {}
        L.control.layers(baseMaps, overlayMaps, {collapsed: true}).addTo(map);
    */


    map.on('click', function (e) {

        /*  if (marker) {
              map.removeLayer(marker)
          }*/


        if (config.map.auto_routing == true) {
            var marker_waypoint = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
            L.DomUtil.addClass(marker_waypoint._icon, 'icon-waypoint');

            L.Routing.control({
                waypoints: [
                    L.latLng(config.map.lat, config.map.long),
                    L.latLng(e.latlng.lat, e.latlng.lng)
                ]
            }).on('routesfound', function (e) {
                var routes = e.routes;
                //console.log(routes);

                e.routes[0].coordinates.forEach(function (coord, index) {
                    setTimeout(function () {
                        marker.setLatLng([coord.lat, coord.lng]);
                    }, 100 * index)
                })

            }).addTo(map);
        }


    });


    //clearTimeout();


    map.on('mousemove', function (e) {

        if (is_showweather) {
            updateWeather_2(e.latlng.lat, e.latlng.lng);
            getLocalName(e.latlng.lat, e.latlng.lng);
        }


        // document.getElementsByClassName('coordinate')[0].innerHTML = e.latlng.lat + ',' + e.latlng.lng;
    })
    // map.on('mouseover', function () {
    //       console.log('your mouse is over the map')
    // })


    function formatJSON(rawjson) {	//callback that remap fields name
        var json = {},
            key, loc, disp = [];

        for (var i in rawjson) {
            disp = rawjson[i].display_name.split(',');

            key = disp[0] + ', ' + disp[1];

            loc = L.latLng(rawjson[i].lat, rawjson[i].lon);

            json[key] = loc;	//key,value format
        }

        return json;
    }

    var mobileOpts = {
        url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
        jsonpParam: 'json_callback',
        formatData: formatJSON,
        textPlaceholder: 'Color...',
        autoType: false,
        tipAutoSubmit: true,
        autoCollapse: false,
        autoCollapseTime: 20000,
        delayType: 800,	//with mobile device typing is more slow
        marker: {
            icon: true
        }
    };

    //map.addControl(new L.Control.Search(mobileOpts));
    //view source of search.php for more details

    map.addControl(new L.Control.Zoom());

    sleep(4500);
    hiddenLoading();
}, 1000);


//watch

let id;
let target;
let options;

var marker, circle;

function getPosition() {


    if (marker) {
        map.removeLayer(marker)
    }

    if (circle) {
        map.removeLayer(circle)
    }

    var redMarker = L.AwesomeMarkers.icon(config.map.maker_icon.motorcycle);

    marker = L.marker([config.map.lat, config.map.long], {icon: redMarker}).addTo(map);


    L.DomUtil.addClass(marker._icon, "blinking");

    // marker = L.marker([config.map.lat, config.map.long])
    ///circle = L.circle([config.map.lat, config.map.long])

    var featureGroup = L.featureGroup([marker]).addTo(map);//[marker, circle]

    map.fitBounds(featureGroup.getBounds())

}

var uu = 0;

function updateMAP() {
    console.log('count __' + uu++);

    function success(pos) {
        const crd = pos.coords;

        if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
            navigator.geolocation.clearWatch(id);
        } else {

            updateGEO(pos);

            if (config.map.auto_zoom) {
                getPosition();
                map.setZoom(config.map.zoom);
            }
        }

    }

    function error(err) {

        mylog(`ERROR(${err.code}): ${err.message}`)
        //console.error();
    }

    target = {
        latitude: 0,
        longitude: 0
    };

    options = {
        zoom: config.map.zoom,
        desiredAccuracy: 1,
        frequency: config.map.timereset,
        enableHighAccuracy: false,
        timeout: config.map.timeout,
        maximumAge: 0
    };

    id = navigator.geolocation.watchPosition(success, error, options);
}

function updateGEO(position) {
    config.map.lat = position.coords.latitude
    config.map.long = position.coords.longitude
    config.map.accuracy = position.coords.accuracy
    config.map.speed = position.coords.speed;

    updateMeter();
}

function updateMeter() {
    if (config.map.speed > 0) {
        meterBar.set(
            config.map.speed,
            true
        );
    } else {
        meterBar.set(
            0,
            false
        );
    }
}


function mylog(data = '') {
    var log = document.getElementById('log');
    if (typeof log != 'undefined') {
        log.innerHTML = data;
    }
}

var is_google_statellite = false;

function updateTitlePlanet() {
    if (map.hasLayer(googleSat)) {
        map.addLayer(googleStreets);
        map.removeLayer(googleSat);
        document.getElementById('icon-planet').classList.add('planet-off');
        document.getElementById('icon-planet').classList.remove('planet-on');
        is_google_statellite = false;
    } else {
        map.addLayer(googleSat);
        map.removeLayer(googleStreets);
        document.getElementById('icon-planet').classList.add('planet-on');
        document.getElementById('icon-planet').classList.remove('planet-off');
        is_google_statellite = true;
    }

    document.getElementById('icon-mapdefalut').classList.add('mapdefalut-off');
    document.getElementById('icon-mapdefalut').classList.remove('mapdefalut-on');
}


function updateTitleDefault() {
    if (is_google_statellite == true) {
        document.getElementById('icon-mapdefalut').classList.add('mapdefalut-off');
        document.getElementById('icon-mapdefalut').classList.remove('mapdefalut-on');
        return false;
    }

    if (map.hasLayer(osm)) {
        map.addLayer(googleStreets);
        map.removeLayer(osm);
        document.getElementById('icon-mapdefalut').classList.add('mapdefalut-off');
        document.getElementById('icon-mapdefalut').classList.remove('mapdefalut-on');

    } else {

        document.getElementById('icon-mapdefalut').classList.add('mapdefalut-on');
        document.getElementById('icon-mapdefalut').classList.remove('mapdefalut-off');
        map.addLayer(osm);
        map.removeLayer(googleStreets);
    }
}


function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setInterval(drawSpeedo, config.map.timereset);
    setInterval(updateMAP, 5000);
    setInterval(updateWeather, 60000);
    setInterval(function () {
        weather = undefined;
        document.getElementById('log').innerHTML = '';
    }, 50000)
}, false);


function update_auto_routing_map() {
    if (config.map.auto_routing === false) {

        document.getElementById('icon-routing').classList.add('routing-on');
        document.getElementById('icon-routing').classList.remove('routing-off');
        config.map.auto_routing = true;
    } else {
        document.getElementById('icon-routing').classList.add('routing-off');
        document.getElementById('icon-routing').classList.remove('routing-on');

        config.map.auto_routing = false;

        removeElementsByClass('leaflet-routing-container');
        removeElementsByClass('leaflet-overlay-pane');


        document.querySelectorAll('.leaflet-marker-pane img').forEach((img) => img.remove());
        document.querySelectorAll('.leaflet-shadow-pane img').forEach((img) => img.remove());


    }
}

function update_show_meter() {
    if (config.map.is_showing_meter === false) {
        document.getElementById('canvas').classList.remove('hidden');
        document.getElementById('icon-meter').classList.add('meter-on');
        document.getElementById('icon-meter').classList.remove('meter-off');
        config.map.is_showing_meter = true;
    } else {
        document.getElementById('canvas').classList.add('hidden');
        document.getElementById('icon-meter').classList.add('meter-off');
        document.getElementById('icon-meter').classList.remove('meter-on');

        config.map.is_showing_meter = false
    }
}

function update_auto_zoom_map() {
    if (config.map.auto_zoom === false) {

        document.getElementById('icon-zoom').classList.add('zoom-in');
        document.getElementById('icon-zoom').classList.remove('zoom-off');
        config.map.auto_zoom = true;
        getPosition();
    } else {
        document.getElementById('icon-zoom').classList.add('zoom-off');
        document.getElementById('icon-zoom').classList.remove('zoom-in');
        config.map.auto_zoom = false
    }
}

var is_showHaGiang = false;
var gpx_layout = '';
var url_gpx = '';

function showing_hagiang() {
    if (is_showHaGiang === false) {
        url_gpx = 'assets/gpx/' + config.map.gpx[1];

        gpx_layout = new L.GPX(url_gpx, {
            async: true,
            marker_options: {
                startIconUrl: config.map.maker,
                endIconUrl: config.map.maker,
                shadowUrl: config.map.maker_shadow,
            }
        }).on('loaded', function (e) {
            map.fitBounds(e.target.getBounds());
        }).addTo(map);
        is_showHaGiang = true;

        document.getElementById('icon-hagiang').classList.add('red');
    } else {
        if (map.hasLayer(gpx_layout)) {
            map.removeLayer(gpx_layout);
        }
        is_showHaGiang = false
        document.getElementById('icon-hagiang').classList.remove('red');
    }
}

var is_showDongBac = false;

function showing_dongbac() {
    if (is_showDongBac === false) {
        url_gpx = 'assets/gpx/' + config.map.gpx[0];
        gpx_layout = new L.GPX(url_gpx, {
            async: true,
            marker_options: {
                startIconUrl: config.map.maker,
                endIconUrl: config.map.maker,
                shadowUrl: config.map.maker_shadow,
            }
        }).on('loaded', function (e) {
            map.fitBounds(e.target.getBounds());
        }).addTo(map);

        document.getElementById('icon-dongbac').classList.add('red');
        is_showDongBac = true;
    } else {
        if (map.hasLayer(gpx_layout)) {


            map.removeLayer(gpx_layout);
        }

        document.getElementById('icon-dongbac').classList.remove('red');
        is_showDongBac = false;
    }

}

var is_lich_trinh = false;
var kmz;

function showing_lichtrinh() {
    if (is_lich_trinh == false) {
        is_lich_trinh = true;
        document.getElementById('icon-lich-trinh').classList.add('red');

        if (!!kmz) {
            var maker = document.querySelector(".leaflet-marker-pane");
            const isActive = maker.classList.contains("awesome-marker-icon-red");
            if (isActive == false) {


                function makerGEO(item, stt) {

                    var icon = config.map.maker_icon.camping;
                    if (stt == 1) {
                        icon = config.map.maker_icon.exp;
                    } else {

                    }
                    //maker_icon
                    addGeoJson('assets/gps/' + item, icon);
                }

                config.map.gps.forEach(makerGEO);
            }
            return false;
        }

        kmz = L.kmzLayer().addTo(map);

        kmz.on('load', function (e) {
            control.addOverlay(e.layer, e.name);
            // e.layer.addTo(map);
        });
        config.map.kmz.forEach(item => {
            kmz.load('assets/kmz/' + item);
        });

        var control = L.control.layers(null, null, {collapsed: true}).addTo(map);
    } else {
        is_lich_trinh = false;

        if (map.hasLayer(kmz)) {
            map.removeLayer(kmz)
        }

        removeElementsByClass('awesome-marker-icon-red');
        removeElementsByClass('awesome-marker-icon-orange');
        removeElementsByClass('awesome-marker-shadow');

        document.getElementById('icon-lich-trinh').classList.remove('red');
    }

}

function onEachFeature(feature, layer) {

    //return layer.bindPopup('<div>'+feature.properties.name+'</div>');
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

async function addGeoJson(url, icon) {
    const response = await fetch(url);
    const data = await response.json();
    var redMarker = L.AwesomeMarkers.icon(icon);
    L.geoJson(data, {

            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: redMarker});
            },
            onEachFeature: onEachFeature,
        },
    ).addTo(map);
}


var loader = document.getElementById('preloader');
var hud_text = document.getElementById('hud_text');

function showLoading() {
    loader.style.display = "block";
}

function showHud_Text() {
    hud_text.style.display = "block";
}

function hiddenHud_Text() {
    hud_text.style.display = "none";
}

function hiddenLoading() {
    loader.style.display = "none";
}

var meterBar = new ldBar(".ldMeter", {
    "stroke": '#ffa200',
    "value": 150
});
var temperatureBar = new ldBar(".temperatureBar", {
    "stroke": '#f00',
    "value": 1
});
var windspeedBar = new ldBar(".windspeedBar", {
    "stroke": '#f00',
    "value": 0
});
var ldBarEnable = new ldBar('.ldBarEnable', {
    "stroke": '#ccc',
    'value': 100
})
var weather = undefined;


async function updateWeather_2(lat, long) {
    if (weather == true) {
        return false;
    }

    ldBarEnable.set(
        0,     /* target value. */
        false   /* enable animation. default is true */
    );
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + long + '&current_weather=true&&temperature_unit=celsius&windspeed_unit=kmh&timezone=Asia/Ho_Chi_Minh';
    const response = await fetch(url);
    const data = await response.json();

    await sleep(1500);
    weather = true;

    const cw = data.current_weather;
    const temperature = cw.temperature;
    const windspeed = cw.windspeed;
    // const winddirection = cw.winddirection;
    const code = cw.weathercode;

    var str = '';
    switch (code) {
        case 1:
        case 2:
        case 3:
            str = 'Mây và nắng';
            break;
        case 45:
        case 48:
            str = 'Sương mù và đọng lại sương mù';
            break;
        case 51:
        case 53:
        case 55:
            str = 'Mưa phùn: Cường độ nhẹ, trung bình và dày đặc';
            break;
        case 56:
        case 57:
            str = 'Mưa phùn băng giá: Cường độ nhẹ và dày đặc';
            break;
        case 61:
        case 63:
        case 65:
            str = 'Mưa: Cường độ nhẹ, trung bình và nặng hạt';
            break;
        case 66:
        case 67:
            str = 'Mưa to: Cường độ nhẹ và gió mạnh';
            break;
        case 71:
        case 73:
        case 75:
            str = 'Tuyết rơi: Cường độ nhẹ, trung bình và nặng';
            break;
        case 77:
            str = 'hạt tuyết';
            break;
        case 80:
        case 81:
        case 82:
            str = 'Mưa rào: Nhẹ, vừa phải và dữ dội';
            break;
        case 85:
        case 86:
            str = 'Mưa tuyết nhẹ và nặng hạt';
            break;
        case 95:
            str = 'Giông bão: Nhẹ hoặc trung bình';
            break;
        case 96:
        case 99:
            str = 'Giông bão với mưa đá nhỏ và nặng';
            break;
        default:
            str = 'Nắng tốt';
    }

    document.getElementById('log-weather').innerText = str;
    temperatureBar.set(
        temperature,     /* target value. */
        true   /* enable animation. default is true */
    );
    windspeedBar.set(
        windspeed,     /* target value. */
        true   /* enable animation. default is true */
    );
    ldBarEnable.set(
        100,     /* target value. */
        true   /* enable animation. default is true */
    );
}

async function getLocalName(lat = null, lng = null) {

    if (lat == null) lat = config.map.lat;
    if (lng == null) lng = config.map.long;

    ldBarEnable.set(0, false);
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=' + config.map.key;
    const response = await fetch(url);
    const data = await response.json();
    sleep(500);

    const code = data.plus_code || {};

    var str = code.compound_code || "";

    document.getElementById('log-address').innerText = str;
    ldBarEnable.set(100, true);
}

async function updateWeather() {
    getLocalName();

    ldBarEnable.set(
        0,     /* target value. */
        false   /* enable animation. default is true */
    );
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + config.map.lat + '&longitude=' + config.map.long + '&current_weather=true&&temperature_unit=celsius&windspeed_unit=kmh&timezone=Asia/Ho_Chi_Minh';
    const response = await fetch(url);
    const data = await response.json();

    sleep(1000);

    const cw = data.current_weather;
    const temperature = cw.temperature;
    const windspeed = cw.windspeed;
    // const winddirection = cw.winddirection;
    const code = cw.weathercode;

    console.log(cw);

    var str = '';
    switch (code) {
        case 1:
        case 2:
        case 3:
            str = 'Mây và nắng';
            break;
        case 45:
        case 48:
            str = 'Sương mù và đọng lại sương mù';
            break;
        case 51:
        case 53:
        case 55:
            str = 'Mưa phùn: Cường độ nhẹ, trung bình và dày đặc';
            break;
        case 56:
        case 57:
            str = 'Mưa phùn băng giá: Cường độ nhẹ và dày đặc';
            break;
        case 61:
        case 63:
        case 65:
            str = 'Mưa: Cường độ nhẹ, trung bình và nặng hạt';
            break;
        case 66:
        case 67:
            str = 'Mưa to: Cường độ nhẹ và gió mạnh';
            break;
        case 71:
        case 73:
        case 75:
            str = 'Tuyết rơi: Cường độ nhẹ, trung bình và nặng';
            break;
        case 77:
            str = 'hạt tuyết';
            break;
        case 80:
        case 81:
        case 82:
            str = 'Mưa rào: Nhẹ, vừa phải và dữ dội';
            break;
        case 85:
        case 86:
            str = 'Mưa tuyết nhẹ và nặng hạt';
            break;
        case 95:
            str = 'Giông bão: Nhẹ hoặc trung bình';
            break;
        case 96:
        case 99:
            str = 'Giông bão với mưa đá nhỏ và nặng';
            break;
        default:
            str = 'Nắng tốt';
    }

    document.getElementById('log-weather').innerText = str;
    temperatureBar.set(
        temperature,     /* target value. */
        true   /* enable animation. default is true */
    );
    windspeedBar.set(
        windspeed,     /* target value. */
        true   /* enable animation. default is true */
    );
    ldBarEnable.set(
        100,     /* target value. */
        true   /* enable animation. default is true */
    );

}

var is_showweather = false;

function showing_weather() {
    if (is_showweather == false) {
        is_showweather = true;
        weather = undefined;
        document.getElementById('icon-weather').innerHTML = '<ion-icon name="thunderstorm-outline"></ion-icon>';
    } else {
        updateWeather();
        is_showweather = false;
        document.getElementById('icon-weather').innerHTML = '<ion-icon name="sunny-outline"></ion-icon>';

    }
}

var is_showing_ads = false;

function showing_ads() {
    if (is_showing_ads == false) {
        is_showing_ads = true;
        document.getElementById('text-ads').classList.remove('text-running');
        document.getElementById('text-ads').style.display = 'none';
        document.getElementById('icon-ads').innerHTML = '<ion-icon name="add-circle-outline"></ion-icon>';
    } else {
        document.getElementById('text-ads').classList.add('text-running');
        document.getElementById('text-ads').style.display = 'block';
        is_showing_ads = false;
        document.getElementById('icon-ads').innerHTML = '<ion-icon name="heart-dislike-outline"></ion-icon>';
    }
}

var is_showing_endline = false;

function showing_endline() {
    if (is_showing_endline == false) {
        is_showing_endline = true;
        document.getElementById('icon-end').innerHTML = '<ion-icon name="trending-up-outline"></ion-icon>';
    } else {
        is_showing_endline = false;
        document.getElementById('icon-end').innerHTML = '<ion-icon name="trending-down-outline"></ion-icon>';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
