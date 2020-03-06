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
var cameraPins = L.layerGroup().addTo(mymap);

var storage = [
    // test data
    { lat: 40.734641, lng: -73.990259 },
    { lat: 40.734706, lng: -73.994637 },
    { lat: 40.731700, lng: -73.992405 }
];

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

    let places = L.layerGroup([USQ, school, DD, home]);
    places.addTo(mymap);

    //popups
    marker.bindPopup("<b>Flushing Ave</b><br>Theres no security camera here.").openPopup();
}


function mapClicked(e) {
    let create_button = document.getElementById("create");
    let edit_button = document.getElementById("edit");

    if (create_button.checked) {
        drawNoCameraPin(e.latlng.lat, e.latlng.lng);
        storage.push({ lat: e.latlng.lat, lng: e.latlng.lng }); //add pin location into storage
    }
}

function saveClicked() {
    console.log("save button clicked");
}

function loadClicked() {
    console.log("load button clicked");
    cameraPins.clearLayers();
    // for (let i = 0; i <= storage.length; i++) {
    //     const loc = storage[i];
    // }
    for (const loc of storage) {
        drawNoCameraPin(loc.lat, loc.lng);
    }
}

/** Draw pin on map. */
function drawNoCameraPin(lat, lng) {
    let no_camera = L.icon({
        iconUrl: 'img/nocamera.png',
        iconSize: [21, 27],
        iconAnchor: [11, 27],
        popupAnchor: [-3, -76],
    });
    // L.marker([lat, lng], { icon: no_camera }).addTo(mymap);
    let marker = L.marker([lat, lng], { icon: no_camera });
    marker.addTo(cameraPins);
}


setupMap();
mymap.on('click', mapClicked);
document.getElementById("saveButton").addEventListener("click", saveClicked);
document.getElementById("loadButton").addEventListener("click", loadClicked); 
