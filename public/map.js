let map;

async function initMap() {
  const { Map } =  await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  try { 
    let markers = [];
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
            map: map,
            position: {lat: parseFloat(album.lat), lng: parseFloat(album.long)},
            content: contentNode,
            title: album.name,
        });
        markers.push(marker)
      }
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
      console.log(googleMapKey)
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
      mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&loading=async&callback=initMap`
      pageContent.appendChild(mapScript)
    } catch (error) {
      console.log(error)
    }
}
