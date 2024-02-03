var key_gg = 'AIzaSyB3W5D8BP4I2KLTbTlHaFndHve9RV7A-4k';
function mapIt(myLatitude, myLongitude) {
       /* var canvas = document.getElementById('map');
        var context = canvas.getContext('2d');
        var imgObj = new Image();
        imgObj.onload = function() {
            context.drawImage(imgObj, 0, 0);
        };*/
        var urlGoogle = 'https://maps.googleapis.com/maps/api/staticmap?maptype=hybrid&size=400x400&zoom=17&key='+key_gg+'&center='+myLatitude+','+myLongitude;
    var img_geo = document.getElementById('img_geo');
    img_geo.src = urlGoogle;
}
function initMap(myLatitude = -34.397, myLongitude = 150.644) {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: myLatitude, lng: myLongitude },
        zoom: 17,
    });
}

window.initMap = initMap;
