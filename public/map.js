let map;
let storedMap;
let markers = [];
let scriptImported = false;
let autocomplete


async function initMap() {
  const { Map } =  await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  try { 
    const response = await getMapInfo();
    let lat = 49
    let long = -123
    if (response.data){
      const newestAlbum = response.data.Album[0]
      if (newestAlbum) {
        lat = parseFloat(newestAlbum.lat)
        long = parseFloat(newestAlbum.long)
      }
    }
    if (!map){
    map = new Map(document.getElementById("map"), {
      center: { lat: lat, lng: long },
      zoom: 8,
      mapId: "circles-421907",
    });
  }
    map.deleteMarkers = function deleteMarkers() {
      clearMarkers();
      markers = [];
    }
    
    function clearMarkers() {
      setMapOnAll(null);
    }
    
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }
    map.createAlbumMarkers = (albumData) => {
      for (let album of albumData.data.Album) {
        if(album.photo[0]) {
          const contentNode = document.createElement("div");
          contentNode.classList.add("mapAlbum");
          contentNode.innerHTML = `<div class="relative">
              <img src="${album.photos[0].src}" class="rounded-full border-4 border-blue-500 w-12 h-12 object-cover aspect-w-1 aspect-h-1" alt="Google Maps Pin">
              <div class="absolute w-4 h-4 bg-blue-500 rounded-full bottom-0 left-1/2 transform -translate-x-1/2"></div>
          </div>`;
          const marker = new AdvancedMarkerElement({
              map,
              position: {lat: parseFloat(album.lat), lng: parseFloat(album.long)},
              content: contentNode,
              title: album.name,
          });
          markers.push(marker)
        }
      }
    }
    if (response.data){
      map.createAlbumMarkers(response)
    }
    storedMap = document.querySelector("#map")
  } catch (error) {
    console.log(error)
  }
}

async function getMapInfo() {
  try {
    const response = await fetch(`/user/mapInfo`)
    const jsonResponse = await response.json()
    return jsonResponse
  } catch (err) {
    console.log(err)
  }
}

async function displayMap() {
const pageName = document.querySelector(".pageName");
    pageName.textContent = "Maps"
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "backToExplore"
    rightHeaderButton.innerHTML = "";
    try {
      const response = await fetch("/googleMapKey");
      const responseJson = await response.json();
      const googleMapKey = responseJson.data;
      
      if (storedMap) {
        map.deleteMarkers()
        const data = await getMapInfo();
        map.createAlbumMarkers(data)
        pageContent.innerHTML = ""
        console.log("MAP", storedMap)
        console.log(markers)
        pageContent.appendChild(storedMap)
      } else {
        const mapDiv = document.createElement("div")
        mapDiv.id = "map"
        mapDiv.classList.add("h-full")
        pageContent.innerHTML = ""
        console.log(pageContent.innerHTML)
        pageContent.appendChild(mapDiv) 
      }
      if (!scriptImported){
        const mapScript = document.createElement("script")
        mapScript.async = true
        mapScript.src = `https://maps.googleapis.com/maps/api/js?v=beta&key=${googleMapKey}&loading=async&callback=initMap`
        mapScript.defer = true
        pageContent.append(mapScript)
        scriptImported = true
      }
    } catch (error) {
      console.log(error)
    }
}

async function displayAddLocation() {
  pageName.textContent = "Add Location";
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "addLocationBack";
  rightHeaderButton.textContent = "Skip";
  rightHeaderButton.className = "text-lg";
  rightHeaderButton.id = "addLocationSkip";

  pageContent.innerHTML = `
  <div id="addLocation" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
    <div class="w-full h-full ml-2 bg-light-mode">
      <div class="fixed mb-6">
        <div class="relative w-full h-12 bg-light-mode">
          <input type="text" id="locationSearchBox" class="w-380 px-10 py-2 mt-2 border-grey border-2 rounded-input-box text-secondary leading-secondary" placeholder="search location">
          <img src="/lightmode/search_icon_grey.svg" alt="search icon" class="absolute left-3 top-3.5 w-25 h-25"/>
        </div>
      </div>
      <div class="flex flex-col shrink-0 justify-center w-380">
        <div id="suggestedLocations" class="flex flex-col mt-20 pb-48"></div>
      </div>
    </div>
  </div>`;

  try {
    const googleMapKeyresponse = await fetch("/googleMapKey");
    const googleMapKeyresponseJson = await googleMapKeyresponse.json();
    const googleMapKey = googleMapKeyresponseJson.data;

    const script1 = document.createElement("script");
    script1.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&libraries=places&callback=initAutocomplete`;
    script1.defer = true;
    script1.async = true;

    const script2 = document.createElement("script");
    script2.innerHTML = `
      function initAutocomplete() {
        const input = document.querySelector("#locationSearchBox");
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function() {
          const place = autocomplete.getPlace();
          console.log(place)
          if (!place.geometry) {
            console.error("Place details not available for input: '" + place.name + "'");
            return;
          }
          rightHeaderButton.textContent = "Next";
          rightHeaderButton.className = "text-lg";
          rightHeaderButton.id = "addLocationNext";
          let popupMessage = 'Selected '+ place.name
          displayPopup(popupMessage)
          albumObj.location = {lat: place.geometry.location.lat(), long: place.geometry.location.lng()}
          console.log("Place Name: " + place.name);
          console.log("Place Address: " + place.formatted_address);
          console.log("Place Location (Lat, Lng): " + place.geometry.location.lat() + ", " + place.geometry.location.lng());
        });
      }
    `;

    const head = document.querySelector("head");
    head.appendChild(script1);
    head.appendChild(script2);
  } catch (error) {
    console.error(error);
  }
}