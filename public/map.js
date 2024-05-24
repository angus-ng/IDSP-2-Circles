let map;
let storedMap;
let markers = [];
let scriptImported = false;

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
        console.log(album);
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
    try {
      const response = await fetch("/googleMapKey")
      const responseJson = await response.json()
      const googleMapKey = responseJson.data
      pageName.textContent = "Maps"
      leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="mapBackButton"/>`;
      rightHeaderButton.innerHTML = "";
      
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


// async function clearMarkers() {
//   reload = false
//   for (let i = 0; i < markers.length; i++) {
//     markers[i].setMap(null);
//   }
//   // markers.forEach(marker => {
//   //   console.log(marker)
//   //   console.log(marker.map)
//   //   reload = true
//   //   // this is suppose to get rid of marker....
//   //   marker.map = null;
//   // });
//   if (reload) {
//     // get rid of this location.reload 
//     // right now theres a problem where if i call the map after calling it once
//     // the markers wont be placed again because they've been made before and remembered on the page
//     // refreshing works but its just not ideal.
//     location.reload(true);
//     await displayMap()
//   }
//   markers = [];
// }