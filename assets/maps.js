
// Prevent maps api from loading fonts
var head = document.querySelector('head');
var insertBefore = head.insertBefore;
head.insertBefore = function (newElement, referenceElement) {
  if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') > -1) {
    return;
  }
  insertBefore.call(head, newElement, referenceElement);
};

// Maps initialization
var map,
  markers = [],
  marker,
  infoWindows = [],
  textMap = document.getElementById('textmap');
  function initMaps() {
  
  var zoomAmt = 3
  if (window.innerWidth < 1920) { zoomAmt = 2 }
  if (window.innerWidth < 1280) { zoomAmt = 1 }
  if (window.innerWidth < 600) { zoomAmt = 0 }
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "./assets/infobox.js";
  document.querySelector('HEAD').appendChild(s)
  var mapOptions = {
    zoom: zoomAmt,
    scrollwheel: false,
    draggable: true,
    disableDoubleClickZoom: true,
    disableDefaultUI: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    center: new google.maps.LatLng(26.539116, -47.208453),
    styles: [{ featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }], },
    { featureType: "administrative", elementType: "geometry.fill", stylers: [{ visibility: "off" }], },
    { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ visibility: "off" }], },
    { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ visibility: "off" }], },
    { featureType: "landscape", elementType: "geometry", stylers: [{ visibility: "on" }, { color: "#061B34" }], },
    { featureType: "landscape.natural", elementType: "labels", stylers: [{ visibility: "off" }], },
    { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }], },
    { featureType: "road", elementType: "all", stylers: [{ color: "#cccccc" }], },
    { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }], },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }], },
    { featureType: "transit.line", elementType: "geometry", stylers: [{ visibility: "off" }], },
    { featureType: "transit.line", elementType: "labels.text", stylers: [{ visibility: "off" }], },
    { featureType: "transit.station.airport", elementType: "geometry", stylers: [{ visibility: "off" }], },
    { featureType: "transit.station.airport", elementType: "labels", stylers: [{ visibility: "off" }], },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#FFF7F3" }], },
    { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }], },
    ],
  };
  var mapEl = document.getElementById("map");
  map = new google.maps.Map(mapEl, mapOptions);

  // On map load
  google.maps.event.addListenerOnce(map, 'idle', function () {
    // intersection options
    let op = {
      rootMargin: '0px',
      threshold: 0.5
    }
    let io = new IntersectionObserver(ioH, op);
    io.observe(mapEl)
    // handle Intersection
    function ioH(entries, o) {
      entries.forEach(function (e) {
        if (e.intersectionRatio > 0) {
          loadMarkers()
          o.unobserve(e.target)
        }
      })
    }
    // add iframe title
    mapEl.querySelector('IFRAME').title = 'map with pinned locations of projects'
  })
}

function loadMarkers() {
  var i = 1;
  mapLocations.forEach(function (mark) {
    addMarkerWithTimeout(mark, i * 40);
    i++;
  })
  var myoverlay = new google.maps.OverlayView();
  myoverlay.draw = function () {
    this.getPanes().markerLayer.id = "markerLayer";
  };
  myoverlay.setMap(map);
}

function addMarkerWithTimeout(data, timeout) {
  var latLng = new google.maps.LatLng(data.lat, data.lng);
  var viewProject = ""
  if (data.display) { viewProject = '<br><span onClick="mapPrj(' + data.id + ')">View Project</span>' }
  var contentString = '<div class="infowindow" aria-label="info window"><div class="closewindow" onClick="closeAllInfoWindows(); return false;">X</div><h2>' + data.name + "</h2><p>" + data.address + viewProject + '</p></div>';
  var ibOptions = {
    disableAutoPan: false,
    maxWidth: 0,
    pixelOffset: new google.maps.Size(-250, 10),
    zIndex: null,
    boxStyle: {
      padding: "0px 0px 0px 0px",
      width: "270px",
      height: "140px",
    },
    closeBoxURL: "",
    infoBoxClearance: new google.maps.Size(1, 1),
    isHidden: false,
    pane: "floatPane",
    enableEventPropagation: false,
  };
  const svgMarker = {
    path: "M480.345-497Q504-497 520.5-513.845t16.5-40.5Q537-578 520.155-594.5t-40.5-16.5Q456-611 439.5-594.155t-16.5 40.5Q423-530 439.845-513.5t40.5 16.5ZM480-131Q345-252 276-357t-69-190q0-120 78.5-200.5T480-828q116 0 194.5 80.5T753-547q0 85-69 190T480-131Z",
    fillColor: "#B0F1FF",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#FFF7F3",
    rotation: 0,
    scale: .04,
    anchor: new google.maps.Point(450, -150 )
  };
  // var icon = {
  //   url: "/images/icon-pin.png",
  //   scaledSize: new google.maps.Size(15, 33),
  //   origin: new google.maps.Point(0, 0),
  //   anchor: new google.maps.Point(7, 33),
  // };
  window.setTimeout(function () {

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      // icon: icon,
      icon: svgMarker,
      optimized: false,
      title: data.name,
      count: markers.length.toString(),
      animation: google.maps.Animation.DROP,
    });
    ibOptions.content = contentString;
    var ib = new InfoBox(ibOptions);
    // // Turn off for now
    // marker.addListener("click", function () {
    //   closeAllInfoWindows();
    //   ib.open(map, marker);
    //   map.panTo(ib.getPosition());
    // });
    markers.push(marker);
    infoWindows.push(ib);
  }, timeout);

  // Create text alternative
  let txtM = document.createElement('LI')
  let txtLabel = data.name + ' ' + data.address
  if (data.display == 'video') { txtLabel += ' - Watch Video' }
  if (data.display == 'photo') { txtLabel += ' - View Photo' }
  if (data.display) {
    txtM.innerHTML = '<button class="txtmarker" onclick="txtMapPrj(' + data.id + ')">' + txtLabel + '</button>'
  } else {
    txtM.innerHTML = '<div class="txtmarker" tabindex="0">' + txtLabel + '</div>'
  }
  txtM.addEventListener('focusin', function () {
    map.panTo(latLng); map.setZoom(4);
    // vertically center focused marker
    setTimeout(function () { textMap.scrollTop = txtM.offsetTop - (textMap.clientHeight / 2) + 50 }, 100)
  })
  textMap.appendChild(txtM)
}

function closeAllInfoWindows() {
  for (var i = 0; i < infoWindows.length; i++) {
    infoWindows[i].close();
  }
}
var bw = window.innerWidth,
  bh = window.innerHeight,
  dpr = window.devicePixelRatio;

function mapPrj(id) {
  const project = mapLocations[id]
  let display = ''
  if (project.display == 'video') {
    display = '<iframe width=560 height=315 src="https://www.youtube.com/embed/' + project.ytCode + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>'
  }
  if (project.display == 'photo') {
    display = '<img src="' + project.photo + '">'
  }
  const projectView = '<header><h1 tabindex="0">' + project.name + ' <br><b>' + project.address + '</b></h1><div></div></header>' + '<div class="s-wr"><div class="r">' + display + '</div></div>'
  const ove = document.getElementById('overlay')
  ove.querySelector('.p-wr').innerHTML = projectView
  ove.classList.add('reel')
}

function txtMapPrj(id) {
  mapPrj(id)
  const ov = document.getElementById('overlay')
  lastTxtM = event.target
  ov.querySelector('H1').focus()
  // overlay keyboard close button handler
  document.getElementById('okc').addEventListener('keydown', function okc(event) {
    if (!event.shiftKey) {
      if (lastTxtM) {
        lastTxtM.focus()
        ov.classList.remove('reel')
        ov.querySelector('.p-wr').innerHTML = ''
      }
      document.getElementById('okc').removeEventListener('keydown', okc)
    }
  })
}
window.initMaps = initMaps
window.mapPrj = mapPrj
window.txtMapPrj = txtMapPrj
window.closeAllInfoWindows = closeAllInfoWindows
// load maps API
let mapi = document.getElementById('mapi')
mapi.setAttribute('src', mapi.dataset.src)
