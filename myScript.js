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

//markers group
var USQ = L.marker([40.734641, -73.990259]).bindPopup(`This is Union Square.`),
    school = L.marker([40.734706, -73.994637]).bindPopup(`This is my school.`),
    DD = L.marker([40.71755, -73.963373]).bindPopup(`This is Daddy's home.`),
    home = L.marker([40.731700, -73.992405]).bindPopup(`This is my home.`);

let places = L.layerGroup([USQ, school, DD, home]);
places.addTo(mymap);

//tip
var marker = L.marker([40.700065, -73.950176]).addTo(mymap)
    .bindTooltip("my tooltip text").openTooltip();

//popups
marker.bindPopup("<b>Flushing Ave</b><br>Theres no security camera here.").openPopup();
*/

var mymap = L.map('mapid');
var cameraPins = L.layerGroup().addTo(mymap);
var cameraLocations = [];

// set up initial map state
function setupMap() {
    mymap.setView([40.734121, -73.987255], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);
}


//create clearAll button
L.easyButton('fas fa-trash-alt', function () {
    clearAll();
}).addTo(mymap);

//creat addPin button
var toggle = L.easyButton({
    states: [{
        stateName: 'off',
        icon: 'fas fa-map-pin fa-lg',
        title: 'inactive adding pins',
        id: 'createPinToggle',
        onClick: function () {
            this.state('on');
            this.button.style.color = "red";
        }
    }, {
        stateName: 'on',
        icon: 'fas fa-map-pin fa-lg',
        title: 'active adding pins',
        onClick: function () {
            mapClicked();
            this.button.style.color = "grey";
            this.state('off');
        }
    }]
});
toggle.addTo(mymap);


function mapClicked(e) {
    mymap.on('click', function (e) {
        if (toggle.state() == 'on') {
            console.log(e.latlng, toggle.state());
            drawNoCameraPin(e.latlng.lat, e.latlng.lng);
            cameraLocations.push({ lat: e.latlng.lat, lng: e.latlng.lng });
            save();
        }
    });
}


function save() {
    localStorage.setItem("freetickets.cameraLocations", JSON.stringify(cameraLocations));
}

function load() {

    // load from storage
    let rawStorage = localStorage.getItem("freetickets.cameraLocations");
    if (rawStorage != null) {
        cameraLocations = JSON.parse(rawStorage);
    }

    drawEachPin();
}

//clear all pins
function clearAll() {
    if (confirm(`Are you sure that you wanna clear all the pins?`)) {
        cameraLocations = [];
        drawEachPin();
        save();
    }
}

/** Draw pin on map. */
function drawNoCameraPin(lat, lng) {
    let no_camera = L.icon({
        iconUrl: 'img/nocamera.png',
        iconSize: [27, 36],
        iconAnchor: [13.5, 36],
        popupAnchor: [2, -36],
    });
    // L.marker([lat, lng], { icon: no_camera }).addTo(mymap);
    let marker = L.marker([lat, lng], { icon: no_camera }).bindPopup(`This station doesn't have secuirty cameras.`);
    marker.addTo(cameraPins);
}

// draw all camera pins on map (update interface)
function drawEachPin() {
    // clear existing camera pins displayed on map
    cameraPins.clearLayers();

    // for (let i = 0; i <= cameraLocations.length; i++) {
    //     const loc = cameraLocations[i];
    // }
    for (const loc of cameraLocations) {
        drawNoCameraPin(loc.lat, loc.lng);
    }
}

setupMap();
load();

