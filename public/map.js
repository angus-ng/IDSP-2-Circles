let map;
let markers = [];

async function initMap() {
  await clearMarkers();
  const { Map } =  await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  try { 
    const data = await getMapInfo();
    const newestAlbum = data.data.Album[0]
    let lat = 0
    let long = 0
    if (newestAlbum) {
      lat = parseFloat(newestAlbum.lat)
      long = parseFloat(newestAlbum.long)
    }
    map = new Map(document.getElementById("map"), {
      center: { lat: lat, lng: long },
      zoom: 8,
      mapId: "circles-421907",
    });
    for (let album of data.data.Album) {
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
      // for (let marker of markers) {
      //   marker.addListener("gmp-click", (event) => { 
      //     console.log("HI", marker)
      //     marker.map = null;
      //   })
      // }
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
  
      const mapDiv = document.createElement("div")
      mapDiv.id = "map"
      mapDiv.classList.add("h-full")
      pageContent.innerHTML = ""
      pageContent.appendChild(mapDiv) 
  
      const mapScript = document.createElement("script")
      mapScript.async = true
      mapScript.src = `https://maps.googleapis.com/maps/api/js?v=beta&key=${googleMapKey}&loading=async&callback=initMap`
      pageContent.appendChild(mapScript)
    } catch (error) {
      console.log(error)
    }
}


async function clearMarkers() {
  reload = false
  markers.forEach(marker => {
    reload = true
    marker.map = null;  
  });
  if (reload) {
    // get rid of this location.reload 
    // right now theres a problem where if i call the map after calling it once
    // the markers wont be placed again because they've been made before and remembered on the page
    // refreshing works but its just not ideal.
    await location.reload(true);
    await displayMap()
  }
  markers = [];
}