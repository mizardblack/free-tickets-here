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

var mymap = L.map('mapid', { scrollWheelZoom: false });
var cameraPins = L.layerGroup().addTo(mymap);
var copsPins = L.layerGroup().addTo(mymap);
var copsLocations = [];
var cameraLocations = [];

// function popupMessageText() {
//     if (navigator.language = "zh-CN") {
//         return `这个地铁站没有监控摄像头。`;
//     }
//     return `This station doesn't have security cameras.`;
// }

//translation
const textPhrases = {
    "zh": {
        "delete-prompt": "确定清除所有标记吗？",
        "popup-text-camera": "这个地铁站没有监控摄像头。",
        "popup-text-cops": "这个地铁站有执勤警察。",
        "main_title": "NYC 不买票",
        "instruction_title": "使用指南",
        "i_1": "查看地图获取地铁站安保情况。",
        "i_2": "点击 <i class='fas fa-map-pin'></i>  添加‘无摄像头’标记。 ( <i class= 'fas fa-map-pin' style='color:red' ></i> = 标记; <i class='fas fa-map-pin' style='color:grey'></i> = 不标记.)",
        "i_3": "点击 <i class='fas fa-user-secret'></i>  添加‘警察执勤’标记。 ( <i class= 'fas fa-user-secret' style='color:red' ></i> = 标记; <i class='fas fa-user-secret' style='color:grey'></i> = 不标记.)",
        "i_4": "点击 <i class='fas fa-trash-alt'></i> 清除所有标记。",
        "pins_title": "标记",
        "p_1": " 无监控摄像头",
        "p_2": " 警察执勤"
    },
    "en": {
        "delete-prompt": "foo",
        "popup-text-camera": "This station doesn't have security cameras.",
        "popup-text-cops": "There are cops on duty in this station.",
        "main_title": "PAY NO FARE NYC",
        "instruction_title": "INSTRUCTION",
        "i_1": "check out the map to see train stations security situations.",
        "i_2": "click on <i class='fas fa-map-pin'></i> to add NOCAMERA pins. ( <i class= 'fas fa-map-pin' style='color:red' ></i> = on; <i class='fas fa-map-pin' style='color:grey'></i> = off.) ",
        "i_3": "click on <i class='fas fa-user-secret'></i> to add COPSONDUTY pins. ( <i class= 'fas fa-user-secret' style='color:red' ></i> = on; <i class='fas fa-user-secret' style='color:grey'></i> = off.) ",
        "i_4": "click on <i class='fas fa-trash-alt'></i> to clear all pins.",
        "pins_title": "PINS",
        "p_1": " no security camers",
        "p_2": " cops on duty"
    }
}

function lookupText(key) {
    let lang = navigator.language.split("-")[0]; // get language code without region
    return textPhrases[lang][key];
}

function fillHTMLText() {
    document.getElementById("main_title").innerHTML = lookupText("main_title");
    document.getElementById("instruction_title").innerHTML = lookupText("instruction_title");
    document.getElementById("i_1").innerHTML = lookupText("i_1");
    document.getElementById("i_2").innerHTML = lookupText("i_2");
    document.getElementById("i_3").innerHTML = lookupText("i_3");
    document.getElementById("i_4").innerHTML = lookupText("i_4");
    document.getElementById("pins_title").innerHTML = lookupText("pins_title");
    document.getElementById("p_1").innerHTML = lookupText("p_1");
    document.getElementById("p_2").innerHTML = lookupText("p_2");
}

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

    mymap.on('click', mapClicked);
}


//creat addNOCameraPin button
var camera_toggle = L.easyButton({
    states: [{
        stateName: 'off',
        icon: 'fas fa-map-pin fa-lg',
        title: 'add No-camera pins',
        id: 'createNoCameraPinToggle',
        onClick: function () {
            this.state('on');
            this.button.style.color = "red";
        }
    }, {
        stateName: 'on',
        icon: 'fas fa-map-pin fa-lg',
        title: 'inactive adding pins',
        onClick: function () {
            this.button.style.color = "grey";
            this.state('off');
        }
    }]
});
camera_toggle.addTo(mymap);

//creat addCopsOnDutyPin button
var cops_toggle = L.easyButton({
    states: [{
        stateName: 'off',
        icon: 'fas fa-user-secret fa-lg',
        title: 'add Cops-on-duty pins',
        id: 'createCopsOnDutyToggle',
        onClick: function () {
            this.state('on');
            this.button.style.color = "red";
        }
    }, {
        stateName: 'on',
        icon: 'fas fa-user-secret fa-lg',
        title: 'inactive adding pins',
        onClick: function () {
            this.button.style.color = "grey";
            this.state('off');
        }
    }]
});
cops_toggle.addTo(mymap);

//create clearAll button
L.easyButton('fas fa-trash-alt', function () {
    clearAll();
}).addTo(mymap);


function mapClicked(e) {
    if (camera_toggle.state() == 'on') {
        console.log(e.latlng, camera_toggle.state());
        drawNoCameraPin(e.latlng.lat, e.latlng.lng);
        cameraLocations.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        save();
    }
    if (cops_toggle.state() == 'on') {
        console.log(e.latlng, cops_toggle.state());
        drawCopsPin(e.latlng.lat, e.latlng.lng);
        copsLocations.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        save();
    }
}


function save() {
    localStorage.setItem("PAYNOFARE.cameraLocations", JSON.stringify(cameraLocations));
    localStorage.setItem("PAYNOFARE.copsLocations", JSON.stringify(copsLocations));
}

function load() {

    // load from storage
    let rawStorage_camera = localStorage.getItem("PAYNOFARE.cameraLocations");
    let rawStorage_cops = localStorage.getItem("PAYNOFARE.copsLocations");
    if (rawStorage_camera != null) {
        cameraLocations = JSON.parse(rawStorage_camera);
    }
    if (rawStorage_cops != null) {
        copsLocations = JSON.parse(rawStorage_cops);
    }

    drawEachPin();

    drawCopsPin(40.734641, -73.990259);//USQ
    drawCopsPin(40.71785916529029, -73.95772933959962);//Bedford Ave
    drawCopsPin(40.75533582905459, -73.98746967315675);//42-Time Sq
    drawNoCameraPin(40.75717253693376, -73.97191286087038)//51 St
    drawNoCameraPin(40.74637911942415, -73.98189067840578);//33rd St
    drawNoCameraPin(40.703968742341544, -73.94730091094972);//Lorimor St
    drawNoCameraPin(40.70839317279136, -73.95794391632081);//Marcy Ave
    drawNoCameraPin(40.706864174917996, -73.95335197448732);//Hewes St
    drawNoCameraPin(40.705530339593395, -73.95021915435792);//Broadway
    drawNoCameraPin(40.70035740846065, -73.94116401672365);//Flushing Ave
    drawNoCameraPin(40.75401921961654, -73.94253730773927);//21 St-Queen's Brdg
}

//clear all pins
function clearAll() {
    if (confirm(`Are you sure that you wanna clear all the pins?`)) {
        cameraLocations = [];
        copsLocations = [];
        drawEachPin();
        save();
    }
}

/** Draw camera pin on map. */
function drawNoCameraPin(lat, lng) {
    let no_camera = L.icon({
        iconUrl: 'img/nocamera.png',
        iconSize: [27, 36],
        iconAnchor: [13.5, 36],
        popupAnchor: [2, -36],
    });
    // L.marker([lat, lng], { icon: no_camera }).addTo(mymap);
    let marker = L.marker([lat, lng], { icon: no_camera }).bindPopup(lookupText("popup-text-camera"));
    marker.addTo(cameraPins);
}
/** Draw cops pin on map. */
function drawCopsPin(lat, lng) {
    let copsOnDuty = L.icon({
        iconUrl: 'img/copsOnDuty.svg',
        iconSize: [27, 36],
        iconAnchor: [13.5, 36],
        popupAnchor: [2, -36],
    });
    let marker = L.marker([lat, lng], { icon: copsOnDuty }).bindPopup(lookupText("popup-text-cops"));
    marker.addTo(copsPins);
}


// draw all pins on map (update interface)
function drawEachPin() {
    // clear existing camera pins displayed on map
    cameraPins.clearLayers();
    copsPins.clearLayers();

    // for (let i = 0; i <= cameraLocations.length; i++) {
    //     const loc = cameraLocations[i];
    // }
    for (const loc of cameraLocations) {
        drawNoCameraPin(loc.lat, loc.lng);
    }
    for (const loc of copsLocations) {
        drawCopsPin(loc.lat, loc.lng);
    }
}

setupMap();
load();
fillHTMLText();


