async function displayPhotoUpload(albumData) {
  leftHeaderButton.classList.remove("hidden");
  if (albumData === undefined) {
    pageName.textContent = "New Album";
    leftHeaderButton.innerHTML = closeIcon;
    leftHeaderButton.id = "closeButton";
  }
  
  if (albumData) {
    pageName.textContent = "Add Photos";
    leftHeaderButton.innerHTML = closeIcon;
    leftHeaderButton.id = "backToAlbum";
  }

  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
    <div class="flex flex-col h-full w-full justify-center items-center">
      <div class="font-light text-11 text-center text-dark-grey w-full">
        <p>Select which photos you want to add to</p>
        <p>your album</p>
      </div>
  
      <div id="addPhotos" class="flex-1 flex flex-col justify-start items-center w-full">
        <div class="flex flex-col items-center">
          <form>
            <input id="fileUpload" type="file" class="hidden" multiple="false" />
          </form>
          <div class="flex justify-center mt-64 md:mt-52 mb-6">
            ${uploadIcon}
          </div>
          <div class="flex justify-center">
            <p class="text-base text-grey leading-body">drag and drop to&nbsp;</p>
            <p class="text-base underline text-grey leading-body cursor-pointer">upload</p>
          </div>
          <div class="flex justify-center mt-4 mb-96">
            <p class="text-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
          </div>
        </div>
      </div>
    </div>`;

  const uploadSection = document.querySelector("#addPhotos");

  const fileInput = document.querySelector("#fileUpload");

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute("listener") !== true) {
    fileInput.addEventListener("input", async function (event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = await uploadFile(files[i]);
        console.log(file)

        albumPhotos.push(file);
      }
      if (files.length > 0) {
        await displayPhotoUploadPreview(albumPhotos);
        nav.classList.add("hidden");
        await cleanUpSectionEventListener();
      }
    });
  }

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  uploadSection.classList.remove("imageUploadSection");
}

function displayPhotoUploadPreview(albumPhotos) {
  const albumId = leftHeaderButton.getAttribute("albumId");

  if ((albumId === undefined) || (albumId === null)) {
    pageName.textContent = "New Album";
    leftHeaderButton.innerHTML = closeIcon;
    leftHeaderButton.id = "closeButton";
    rightHeaderButton.textContent = "Next";
    rightHeaderButton.id = "albumNext";
    rightHeaderButton.className = "text-lg";
  }

  if (albumId) {
    pageName.textContent = "Add Photos";
    leftHeaderButton.innerHTML = closeIcon;
    leftHeaderButton.id = "backToAlbum";
    rightHeaderButton.textContent = "Done";
    rightHeaderButton.id = "addPhotosToAlbum";
    rightHeaderButton.className = "text-lg";
  }

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  const mappedPhotos = albumPhotos.map((obj) => {
    return {
      photoSrc: obj.data,
    };
  });

  albumObj.photos = mappedPhotos;

  mappedPhotos.forEach((photo, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "keen-slider__slide";

    const img = document.createElement("img");
    img.className = "rounded-12.75 h-image w-image object-cover";
    console.log(photo)
    img.src = photo.photoSrc.url;
    img.alt = `image ${index}`;

    slideDiv.appendChild(img);
    carouselDiv.appendChild(slideDiv);
  });

  const pageContent = document.querySelector(".pageContent");
  pageContent.innerHTML = `
      <div class="flex flex-col h-full w-full items-center">
        <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
          <p>select which photos you want to add to</p>
          <p class="">your album</p>
        </div>
        <div id="addPhotos" class="flex-1 flex-col items-center bg-light-mode w-430 overflow-hidden p-2">
          <div class="w-full"></div>
          <div class="w-full mt-3">
            <h1 class="text-h2 leading-h2 font-medium">Upload more files<h1>
          </div>
          <div id="dropMore" class="flex-1 mx-auto items-center bg-light-grey w-full h-full border-t border-spacing-2 border-dashed border-grey">
            <form class="hidden">
              <input id="fileUpload" type="file" class="hidden" multiple="false"/>
            </form>
            <div class="flex flex-col justify-center items-center mx-auto">
              <div class="flex justify-center mt-28 md:mt-16 mb-5">
                ${uploadIcon}
              </div>
              <div class="flex justify-center">
                <p class="text-base text-dark-grey leading-body">drag and drop to&nbsp;</p>
                <p class="text-base underline text-dark-grey leading-body cursor-pointer">upload</p>
              </div>
              <div class="flex justify-center mt-4">
                <p class="text-dark-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
              </div>
            </div>
          </div>
          </div>
        </div>`;

  const addPhotos = document.querySelector("#addPhotos div.w-full");
  addPhotos.appendChild(carouselDiv);

  function navigation(slider) {
    let wrapper, dots;

    function createDiv(className) {
      const div = document.createElement("div");
      className.split(" ").forEach((name) => div.classList.add(name));
      return div;
    }

    function setupWrapper() {
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function setupDots() {
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        const dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    slider.on("created", () => {
      setupWrapper();
      setupDots();
    });

    slider.on("slideChanged", () => {
      if (dots && dots.children) {
        const currentIndex = slider.track.details.rel;
        Array.from(dots.children).forEach((dot, idx) => {
          dot.classList.toggle("dot--active", idx === currentIndex);
        });
      }
    });
  }

  const slider = new KeenSlider(
    "#carousel",
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: 2,
        spacing: 15,
      },
      loop: false,
      initial: 0,
      drag: true,
      dragStartThreshold: 10,
    },
    [navigation]
  );

  const uploadSection = document.querySelector("#dropMore");
  const fileInput = document.querySelector("#fileUpload");
  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute("listener") !== true) {
    fileInput.addEventListener("input", async function (event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = await uploadFile(files[i]);
        console.log(file)
        albumPhotos.push(file);
      }
      
      if (files.length > 0) {
        await displayPhotoUploadPreview(albumPhotos);
        await cleanUpSectionEventListener();
      }
    });
  }

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  uploadSection.classList.remove("imageUploadSection");
}

async function displayAlbumConfirmation() {
  nav.classList.remove("hidden");

  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "albumConfirmationBack";

  pageName.textContent = "Post";

  rightHeaderButton.textContent = "Create"
  rightHeaderButton.id = "createAlbum";
  rightHeaderButton.className = "text-lg";

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  albumObj.photos.forEach((photo, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "keen-slider__slide";

    const img = document.createElement("img");
    img.className = "rounded-12.75 h-image w-image object-cover";
    img.src = photo.photoSrc.url;
    img.alt = `image ${index}`;

    slideDiv.appendChild(img);
    carouselDiv.appendChild(slideDiv);
  });

  pageContent.innerHTML = `
    <div id="albumConfirmation" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
      <div id="albumCarousel" class="flex-1 flex flex-col justify-between w-full px-4 m-40">
        <div class="w-full">
        
        </div>
      </div>
      <div id="albumCircle"class="flex flex-row justify-center items-center ml-4 w-full">
        <img id="circleImage" class="w-62 h-62 rounded-full" src="/placeholder_image.svg"/>
        <div class="flex flex-col ml-4">
          <h2 id="circleName" class="text-20 font-medium mr-2.5"></h2>
          <button id="editButton">
            <p class="text-light-mode-accent underline text-secondary">Edit<p>
          </button>
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-between w-full px-4 mt-40">
        <form class="flex flex-col" onkeydown="return event.key != 'Enter';">
          <div class="flex items-center mt-4 mb-28">
              <label for="albumName" class="font-medium text-h2 mr-6">Title</label>
              <input
              type="text"
              placeholder="add a title to your album"
              id="albumName"
              class="w-full bg-transparent text-h2 text-text-grey font-light items-end border-none"
              required
              />
          </div>
        </form>
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="mt-10">
          <p class="font-bold text-26 leading-h2 hidden">Edit</p>
        </div>
      </div>
      </div>
    </div>`;

  const circleImage = document.querySelector("#circleImage");

  circleImage.src = albumObj.circleSrc;
  circleName.textContent = albumObj.circleName;

  const createNewAlbum = document.querySelector("#albumCarousel div.w-full");
  createNewAlbum.appendChild(carouselDiv);

  function navigation(slider) {
    let wrapper, dots;

    function createDiv(className) {
      const div = document.createElement("div");
      className.split(" ").forEach((name) => div.classList.add(name));
      return div;
    }

    function setupWrapper() {
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function setupDots() {
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        const dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    slider.on("created", () => {
      setupWrapper();
      setupDots();
    });

    slider.on("slideChanged", () => {
      if (dots && dots.children) {
        const currentIndex = slider.track.details.rel;
        Array.from(dots.children).forEach((dot, idx) => {
          dot.classList.toggle("dot--active", idx === currentIndex);
        });
      }
    });
  }

  const slider = new KeenSlider(
    "#carousel",
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: 2,
        spacing: 15,
      },
      loop: false,
      initial: 0,
      drag: true,
      dragStartThreshold: 10,
    },
    [navigation]
  );
}

async function displayAlbum(albumData) {
  nav.classList.remove("hidden");
  const origin = leftHeaderButton.getAttribute("origin");
  leftHeaderButton.classList.remove("hidden");
  leftHeaderButton.innerHTML = backIcon;

  if (origin === "fromExploreCircle") {
    leftHeaderButton.id = "backToExploreCircle";
  }

  if (origin === "fromExplore") {
    leftHeaderButton.id = "backToExplore";
  }

  if (origin === "fromExploreCircle") {
    leftHeaderButton.id = "backToExploreCircle";
  }

  if (origin === "fromProfile") {
    leftHeaderButton.id = "backToProfile";
  }

  if (origin === "fromCircleProfile") {
    leftHeaderButton.id = "backToCircle";
    leftHeaderButton.setAttribute("origin", "fromProfile");
  }

  if (origin === 'fromActivities') {
    leftHeaderButton.id = "backToActivities"
  }

  if (origin === "fromSearchProfileCircle") {
    leftHeaderButton.id = "backToSearchCircle";
  }

  if (origin === "fromAlbumCreation") {
    leftHeaderButton.id = "backToCircle"
    leftHeaderButton.setAttribute("username", currentLocalUser)
  }

  if (albumData.circle.id) {
    leftHeaderButton.setAttribute("circleId", `${albumData.circle.id}`);
  }

const currentUserMembership = albumData.circle.UserCircle.find((member) => member.user.username === currentLocalUser)
let ownedPhotosCount = 0
  if (currentUserMembership) {
      ownedPhotosCount = albumData.photos.filter((photo) => { return photo.userId === currentLocalUser}).length
  }
  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2 w-full h-22>
    <div class="flex">
    ${currentLocalUser === albumData.circle.ownerId || (currentUserMembership? currentUserMembership.mod : false) || (ownedPhotosCount > 0 ? true : false) ? 
      `<button id="albumEditButton" ownerId="${albumData.circle.ownerId}" memberStatus="${currentUserMembership.mod}">
        ${circleEditIcon}
      </button>` : ""}
      <button id="shareButton">
        ${shareIcon}
      </button>
    </div>
  </div>`;
  pageName.textContent = albumData.circle.name;

  const memberList = [];
  for (i = 0; i < albumData.circle.UserCircle.length; i++) {
    if (i > 3) {
      const count = albumData.circle.UserCircle.length - 3;
      const andMore = `<div class="w-25 h-25 rounded-full border-2 flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      memberList.push(andMore);
      break;
    }
    memberList.push(
      `<img id="user${i + 1}" src="${
        albumData.circle.UserCircle[i].user.profilePicture
      }" class="grid-item rounded-full object-cover">`
    );
  }

  const photoList = albumData.photos.map((obj) => {
    return `
    <div class="photo w-full h-min relative" photoId="${obj.id}" poster="${obj.userId}">
      <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.src}"/>
      <button class="deletePhoto absolute top-0 right-0 p-2 z-20 hidden">${photoDeleteIcon}</button>
    </div>`;
  });

  let albumName = document.createElement("h2");
  albumName.className = "flex justify-center font-medium text-lg";
  albumName.textContent = albumData.name;
  
  let albumLikeCount = document.createElement("h3");
  albumLikeCount.className = "flex justify-center font-medium text-lg";
  albumLikeCount.textContent = albumData.likeCount;

  const userLiked = albumData.likes.some(like => like.user.username === currentLocalUser);
  const likedClass = userLiked ? "liked" : "";
  const heartColor = userLiked ? "#FF4646" : "none";
  const heartColorStroke = userLiked ? "#FF4646" : "black";
  
  pageContent.innerHTML = `
    <div id="albumPhotos">
      <div id="memberList" class="grid grid-rows-2 grid-cols-3 mt-8 mx-auto items-center justify-center w-265 gap-2 h-84">
        ${memberList.join("")}
      </div>
      <div class="relative my-3 flex justify-center items-center max-w-full h-11" id="albumName">
        ${albumName.outerHTML}
      </div>
      <div class="mt-4 flex flex-row items-center justify-center gap-2 mx-auto">
        <div class="like cursor-pointer ${likedClass}" albumId=${albumData.id}>
          <svg width="20" height="19" viewBox="0 0 20 19" fill="${heartColor}" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.22318 16.2905L9.22174 16.2892C6.62708 13.9364 4.55406 12.0515 3.11801 10.2946C1.69296 8.55118 1 7.05624 1 5.5C1 2.96348 2.97109 1 5.5 1C6.9377 1 8.33413 1.67446 9.24117 2.73128L10 3.61543L10.7588 2.73128C11.6659 1.67446 13.0623 1 14.5 1C17.0289 1 19 2.96348 19 5.5C19 7.05624 18.307 8.55118 16.882 10.2946C15.4459 12.0515 13.3729 13.9364 10.7783 16.2892L10.7768 16.2905L10 16.9977L9.22318 16.2905Z" stroke="${heartColorStroke}" stroke-width="2"/>
          </svg>
        </div>
        ${albumLikeCount.outerHTML}
      </div>
      <div class="grid grid-cols-2 justify-between place-items-center mt-12 mb-2 mr-0">
        <p class="col-span-1 text-base font-medium justify-self-start">${albumData.photos.length} Photos</p>
        <button id="addPhotos" class="col-span-1 justify-self-end w-6 h-6" albumId="${albumData.id}">
          ${addPhotosIcon}
        </button>
      </div>
      <div id="photoList" class="pb-48 w-full">
        <div class="columns-2 gap-4 space-y-4 grid-flow-row">
          ${photoList.join("")}
        </div>
      </div>
  </div>`;

  // album user display layout
  const user1 = document.querySelector("#user1");
  user1.classList.add("h-82", "w-82", "row-span-2", "col-start-2");

  const user2 = document.querySelector("#user2");
  if (user2) {
    user2.classList.add("h-43", "w-43", "col-start-1", "row-start-1", "justify-self-end");
  }

  const user3 = document.querySelector("#user3");
  if (user3) {
    user3.classList.add("h-40", "w-40", "col-start-3", "row-start-2", "justify-self-start");
  }

  const user4 = document.querySelector("#user4");
  if (user4) {
    user4.classList.add("h-5", "w-5", "col-start-1", "row-start-2", "justify-self-end");
  }

  const albumPhotos = document.querySelector("#albumPhotos");
  albumPhotos.addEventListener("click", async(event) => {
    const photo = event.target.closest(".photo img");
    const overlay = event.target.closest("#photoOverlay");
    const addMorePhotos = event.target.closest("#addPhotos");
    const like = event.target.closest(".like");
    const deletePhoto = event.target.closest(".deletePhoto");

    if (photo) {
      await displayPhoto(photo.src);
    }

    if (overlay) {
      const img = event.target.closest("#image");
      if (img) {
        event.stopPropagation();
      } else {
        overlay.remove();
      }
    }

    if (addMorePhotos) {
      nav.classList.add("hidden");
      const albumId = addMorePhotos.getAttribute("albumId");
      const albumData = await getAlbum(albumId);
      await displayPhotoUpload(albumData);
    }

    if (like) {
      const albumId = event.target.closest("div.like").getAttribute("albumId");
      if (like.classList.contains("liked")) {
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#000000");
        await likeAlbum(albumId);
        let { success, data, error } = await getAlbum(albumId);
        if (success && data) {
          await displayAlbum(data);
        }
      } else {
        like.classList.add("liked");
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
        await likeAlbum(albumId);
        let { success, data, error } = await getAlbum(albumId);
        if (success && data) {
          await displayAlbum(data);
        }
      }
      return;
    }

    if (deletePhoto) {
      const photoId = event.target.closest("div.photo").getAttribute("photoId")
      const albumId = document.querySelector("div.like").getAttribute("albumId");
      await displayConfirmationPopup("delete photo", { photoId, albumId });
    }
  });
}

async function displayPhoto(photoSrc) {
  const albumPhotos = document.querySelector("#albumPhotos");
  const photoDiv = document.createElement("div");
  photoDiv.className =
    "absolute top-0 left-0 bg-overlay-bg h-screen w-screen flex justify-center items-center mx-auto z-20";
  photoDiv.id = "photoOverlay";
  const personalView = document.createElement("img");
  personalView.src = `${photoSrc}`;
  personalView.id = "image";
  personalView.className = "w-430 object-cover rounded-xl";

  photoDiv.appendChild(personalView);
  albumPhotos.appendChild(photoDiv);
}

async function displayListOfAlbums(data, user, profile = false) {
  console.log("PROFILE", data)
  const albumList = data.Album.map((obj) => {
    let albumName = document.createElement("p");
    albumName.className = "text-white text-shadow shadow-black";
    albumName.textContent = obj.name;
    let userSpan = document.createElement("span");
    userSpan.className = "user";
    userSpan.setAttribute("username", `${user}`);
    const circleImage = `
    <div class="absolute top-0 right-0 m-2 flex items-start justify-end gap-1 p2">
      <img src="${obj.circle.picture}" class="w-8 h-8 rounded-full object-cover"/>
    </div>`;

    const userLiked = obj.likes.some(like => like.user.username === currentLocalUser);
    const likedClass = userLiked ? "liked" : "";
    const heartColor = userLiked ? "#FF4646" : "none";
    const heartColorStroke = userLiked ? "#FF4646" : "white";
    // CHANGE ME : placeholder image 
    return `
      <div class="w-full h-min relative overflow-hidden album" id="${obj.id}" circleId="${obj.circleId}">
        ${userSpan.outerHTML}
        <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0]? obj.photos[0].src : "/placeholder_image.svg"}"/>
        ${profile ? circleImage : null}
        <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
          ${albumName.outerHTML}
        </div>
        <div class="absolute inset-0 flex items-end justify-end gap-1 p-2">
          <div class="like cursor-pointer ${likedClass}">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="${heartColor}" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.22318 16.2905L9.22174 16.2892C6.62708 13.9364 4.55406 12.0515 3.11801 10.2946C1.69296 8.55118 1 7.05624 1 5.5C1 2.96348 2.97109 1 5.5 1C6.9377 1 8.33413 1.67446 9.24117 2.73128L10 3.61543L10.7588 2.73128C11.6659 1.67446 13.0623 1 14.5 1C17.0289 1 19 2.96348 19 5.5C19 7.05624 18.307 8.55118 16.882 10.2946C15.4459 12.0515 13.3729 13.9364 10.7783 16.2892L10.7768 16.2905L10 16.9977L9.22318 16.2905Z" stroke="${heartColorStroke}" stroke-width="2"/>
            </svg>
          </div>
          <div class="comment cursor-pointer" albumid="${obj.id}">
            ${commentIcon}
          </div>
        </div>
      </div>`;
  });
  return albumList;
}

async function displayComments(albumId, currentUserProfilePicture, circleId) {
  let circleMembers = []
  const fetchPfp = await getCurrentUserProfilePicture();
  if (fetchPfp.data && fetchPfp.success) {
    currentUserProfilePicture = fetchPfp.data;
  }
  const { success, data } = await getComments(albumId);
  //return early do something on error
  if (!(success && data)) {
    console.log("could not fetch comment data");
    return;
  }
  const circleResponse = await getCircle(circleId)
  if (circleResponse.data && circleResponse.success) {
    circleMembers = circleResponse.data.members
  }
  const currentUserMembership = circleMembers.find((member) => member.user.username === currentLocalUser)
  const circleOwner = circleMembers.find((member) => member.user["owner"] !== undefined)
  console.log(data)
  console.log("OWNER", circleOwner)
  const showCommentsRecursively = (comments, level = 0) => {
    const arr = comments.map((comment) => {
      const likeDiv = document.createElement("div");
      likeDiv.className = "like h-full cursor-pointer";
      likeDiv.innerHTML = `
      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.22318 16.6155L9.22174 16.6142C6.62708 14.2613 4.55406 12.3765 3.11801 10.6196C1.69296 8.87613 1 7.38119 1 5.82495C1 3.28843 2.97109 1.32495 5.5 1.32495C6.9377 1.32495 8.33413 1.99941 9.24117 3.05623L10 3.94038L10.7588 3.05623C11.6659 1.99941 13.0623 1.32495 14.5 1.32495C17.0289 1.32495 19 3.28843 19 5.82495C19 7.38119 18.307 8.87613 16.882 10.6196C15.4459 12.3765 13.3729 14.2613 10.7783 16.6142L10.7768 16.6155L10 17.3226L9.22318 16.6155Z" stroke="#0E0E0E" stroke-width="2"/>
      </svg>`;

      const posterH1 = document.createElement("h1");
      posterH1.className = "font-bold text-secondary cursor-pointer";
      const poster = comment.user.displayName ? comment.user.displayName : comment.user.username;
      posterH1.textContent = poster;
      posterH1.textContent ? posterH1.textContent : (posterH1.textContent = "Deleted");
      if (posterH1.textContent === "Deleted") {
        posterH1.className = posterH1.className.replace("cursor-pointer", "").trim();
        likeDiv.className = likeDiv.className.replace("cursor-pointer", "").trim();
      }
      const postMsgContainer = document.createElement("div");
      postMsgContainer.className = "comment-text-container flex-grow";
      const postMsg = document.createElement("p");
      postMsg.className = "text-wrap break-words";
      postMsg.textContent = comment.message
        ? comment.message
        : "message removed";
      postMsgContainer.appendChild(postMsg);


      if (comment.likedBy !== null && comment.likedBy.includes(currentLocalUser) && poster !== null) {
        likeDiv.querySelector("svg path").setAttribute("fill", "#FF4646");
        likeDiv.querySelector("svg path").setAttribute("stroke", "#FF4646");
        likeDiv.classList.add("liked");
      }


      if (comment.likedBy !== null && comment.likedBy.includes(currentLocalUser) && poster !== null) {
        likeDiv.querySelector("svg path").setAttribute("fill", "#FF4646");
        likeDiv.querySelector("svg path").setAttribute("stroke", "#FF4646");
        likeDiv.classList.add("liked");
      }

      const marginClass = level >= 5 ? "ml-0 pl-0 border-0" : "ml-3 pl-2 border-l border-gray-300";

      return `
      <div class="comment relative flex flex-row items-start h-full my-4" 
        id="${comment.id}" 
        user="${comment.user.displayName ? comment.user.displayName : comment.user.username}">
      <div class="flex-none w-58 items-center h-full mr-1 mt-1">
        <img src="${comment.user.profilePicture ? comment.user.profilePicture : "/placeholder_image.svg"}" class="w-47 h-47 rounded-full cursor-pointer">
      </div>
      <div class=" flex flex-col w-294">
        <div class="flex flex-row gap-2">
          ${posterH1.outerHTML}
          <p class="text-time text-11">${comment.createdAt}</p>
        </div>
          ${postMsgContainer.outerHTML}
        <div class="flex items-center space-x-2">
          <a class="text-time text-11 underline replyButton w-8 cursor-pointer">Reply</a>
          ${comment.user.username === currentLocalUser || currentLocalUser === circleOwner.user.username || (currentUserMembership ? currentUserMembership.mod : false) && comment.user.username !== circleOwner.user.username  ? `<img src="/lightmode/more_options.svg" alt="more options"/ class="moreOptions w-5 h-5 cursor-pointer">` : ""}
        </div>
      </div>
      <div class="absolute right-0 top-2 flex flex-1 flex-col items-center">
        ${likeDiv.outerHTML}
        <div class="likeCount">
          <p class="h-3">${comment.likeCount}</p>
        </div>
      </div>
    </div>
    ${comment.replies 
      ? `<div class="parentComment">
          <div class="childComment ${marginClass}">
            ${showCommentsRecursively(comment.replies, level + 1)}
          </div>
        </div>` : ""}`;
    });
    return arr.join("");
  };

  openModal();
  const modalContent = document.querySelector("#modalContent");
  modalContent.innerHTML = `
  <div class="flex flex-col max-w-430 max-h-527 justify-center mx-auto text-black">
    <div class="border-b-circle border-comment-divider mb-5">
      <h1 class="font-semibold text-23 text-center mb-2">Comments</p>
    </div>
    <div class="albumComments my-2 max-h-400 overflow-y-scroll">
    ${showCommentsRecursively(data)}
    </div>
    <div class="flex w-full items-end mt-2">
      <div class="relative flex flex-row mr-3">
        <img class="rounded-full h-47 w-47" src="${currentUserProfilePicture}" alt="${currentLocalUser}'s profile picture"/>
      </div>
      <div id="comment" class="relative flex-1 h-full rounded-input-box">
        <div id="replyContent"></div>
        <div class="flex items-center mt-4">
          <button id="submitComment" class="absolute right-0 mr-3 bg-light-mode-accent rounded-input-box p-2">
            <img src="/lightmode/up_arrow_icon.svg" class="h-5 w-5"/>
          </button>
          <input id="commentInput" class="w-full h-47 p-3 rounded-input-box border-2" placeholder="enter a comment">
        </div>
      </div>
    </div>
  </div>`;

  const albumCommentSection = document.querySelector(".albumComments");
  let commentId = null;
  albumCommentSection.addEventListener("click", async function (event) {
    event.preventDefault();
    commentUser = event.target.closest("div.comment").getAttribute("user");
    switch (event.target.tagName) {
      case "A":
        if (event.target.className.includes("replyButton") && commentUser !== "null") {
          const comment = document.querySelector("#comment");
          comment.classList.remove("bg-transparent");
          comment.classList.add("border-2", "bg-light-mode-accent");
          commentId = event.target.closest("div.comment").id;
          const commentInput = document.querySelector("#commentInput");
          if (commentInput) {
            commentInput.id = "replyInput";
            commentInput.placeholder = "enter a reply";
          }

          const replyContent = document.querySelector("#replyContent");
          replyContent.innerHTML = `
          <div class="flex justify-between items-center p-3">
            <p class="text-white ml-1">Replying to @${commentUser}</p>
            <button id="closeReply" class="h-4 w-4 mr-2">
              ${closeReplyIcon}
            </button>
          </div>`;

          comment.querySelector("#closeReply").addEventListener("click", () => {
            comment.classList.add("bg-transparent");
            comment.classList.remove("border-2", "bg-light-mode-accent");

            const replyInput = document.querySelector("#replyInput");
            replyInput.id = "commentInput";
            replyInput.placeholder = "enter a comment";
            replyContent.innerHTML = "";
          });
        }
        break;
      case "IMG":
        if (event.target.className.includes("moreOptions")) {
          commentId = event.target.closest("div.comment").id;
          const helperObj = { currentUserProfilePicture, albumId, commentId, circleId }
          await displayConfirmationPopup("delete comment", helperObj);
        }
      default:
        break;
    }

    const like = event.target.closest(".like");
    if (like) {
      if (like.classList.contains("liked")) {
        commentId = event.target.closest("div.comment").id;
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#000000");
        await likeComment(commentId);
        await displayComments(albumId, currentUserProfilePicture, circleId);
      } else if (commentUser !== "null") {
        like.classList.add("liked");
        commentId = event.target.closest("div.comment").id;
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
        await likeComment(commentId);
        return await displayComments(albumId, currentUserProfilePicture, circleId);
      }
      return;
    }
  });

  const newCommentInput = document.querySelector("#commentInput");
  newCommentInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      newCommentInput.id === "replyInput"
        ? await newComment(newCommentInput.value, albumId, commentId)
        : await newComment(newCommentInput.value, albumId);
      await displayComments(albumId, currentUserProfilePicture, circleId);
    }
  });
  const submitComment = document.querySelector("#submitComment");
  submitComment.addEventListener("click", async function (event) {
    event.preventDefault();
    const enterKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    newCommentInput.dispatchEvent(enterKeyEvent);
  });
}
async function displayAlbumEditMode(albumId, ownerId, memberStatus) {
  console.log(memberStatus)
  if (currentLocalUser === ownerId || memberStatus === "true"){
    document.querySelectorAll(".deletePhoto").forEach((photo) => photo.classList.remove("hidden"))
    rightHeaderButton.innerHTML = `
    <div class="flex flex-row flex-nowrap gap-2 items-center">
    ${currentLocalUser === ownerId ? `
    <button id="deleteAlbum" albumId="${albumId}" class="w-6 h-6">
      ${deleteIcon}
    </button>` : ""}
      <button id="updateAlbum" albumId="${albumId}" class="text-lg">Save</button>
    </div>`;

    const albumName = document.querySelector("#albumName h2");
    const albumNameInput = document.createElement("input");
    albumNameInput.id = "albumNameInput";
    albumNameInput.type = "text";
    albumNameInput.placeholder = "Add a album name";
    albumNameInput.value = albumName.textContent;
    albumNameInput.className = "max-w-full text-center bg-transparent text-20 text-black font-light border-dark-grey";
    albumName.remove();
    document.querySelector("#albumName").append(albumNameInput);
  } else {
    document.querySelectorAll(`div.photo[poster="${currentLocalUser}"] > button.deletePhoto`).forEach((photo) => {
      photo.classList.add("bg-overlay-bg", "rounded-[10px]");
      if (photo.classList.contains("hidden")) {
        photo.classList.remove("hidden");
      } else {
        photo.classList.add("hidden")
      }
    });
  }
  pageName.textContent = "Edit";
  const page = pageName.getAttribute("page");
  if (page === "albumEdit") {
    pageName.classList.add("text-light-mode-accent");
  }
}

async function displaySandboxAlbum(albumData, circleData) {
  pageName.textContent = circleData.name;
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "backToAlbumSandbox";

  const photoList = albumData.photos.map((obj) => {
    return `
    <div class="photo w-full h-min relative">
      <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.src}"/>
    </div>`;
  });

  let albumName = document.createElement("h2");
  albumName.className = "flex justify-center font-medium text-lg";
  albumName.textContent = albumData.name;

  pageContent.innerHTML = `
    <div id="albumPhotos">
      <div id="circleImage" class="relative flex justify-center mt-6 mb-1.5">
        <img src="${circleData.picture}" class="rounded-full w-180 h-180 object-cover"/>
      </div>
      <div class="relative my-3 flex justify-center items-center max-w-full h-11" id="albumName">
        ${albumName.outerHTML}
      </div>
      <div class="w-full">
        ${albumData.photos.length} Photos
      </div>
      <div id="photoList" class="pb-48 w-full">
        <div class="columns-2 gap-4 space-y-4 grid-flow-row">
          ${photoList.join("")}
        </div>
      </div>
  </div>`;

  const albumPhotos = document.querySelector("#albumPhotos");
  albumPhotos.addEventListener("click", async(event) => {
    const photo = event.target.closest(".photo img");
    const overlay = event.target.closest("#photoOverlay");
    
    if (photo) {
      await displayPhoto(photo.src);
    }

    if (overlay) {
      const img = event.target.closest("#image");
      if (img) {
        event.stopPropagation();
      } else {
        overlay.remove();
      }
    }
  });
}