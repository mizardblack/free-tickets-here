/* sample code
// click event
var popup = L.popup();

function onMapClick(e) {
    console.log(`[${e.latlng.lat}, ${e.latlng.lng}]`);
    popup
        .setLatLng(e.latlng)
        .setContent(`You clicked the map at [${e.latlng.lat}, ${e.latlng.lng}]`)
        .openOn(mymap);

}

mymap.on('click', onMapClick);
*/

var mymap = L.map('mapid');

// set up initial map state
function setupMap() {
    mymap.setView([40.734121, -73.987255], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    //pin
    var marker = L.marker([40.700065, -73.950176]).addTo(mymap)
        .bindTooltip("my tooltip text").openTooltip();;

    //markers group
    var USQ = L.marker([40.734641, -73.990259]).bindPopup(`This is Union Square.`),
        school = L.marker([40.734706, -73.994637]).bindPopup(`This is my school.`),
        DD = L.marker([40.71755, -73.963373]).bindPopup(`This is Daddy's home.`),
        home = L.marker([40.731700, -73.992405]).bindPopup(`This is my home.`);

    L.layerGroup([USQ, school, DD, home]).addTo(mymap);

    //popups
    marker.bindPopup("<b>Flushing Ave</b><br>Theres no security camera here.").openPopup();
}

//edit button
// var edit_button = document.getElementById("edit");

function create(e) {
    let create_button = document.getElementById("create");

    if (create_button.checked) {
        let no_camera = L.icon({
            iconUrl: 'img/nocamera.png',
            iconSize: [21, 27],
            iconAnchor: [11, 27],
            popupAnchor: [-3, -76],
        });
        L.marker([e.latlng.lat, e.latlng.lng], { icon: no_camera }).addTo(mymap);
    }
}

setupMap();
mymap.on('click', create);


