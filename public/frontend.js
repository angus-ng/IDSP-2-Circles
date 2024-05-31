const pageName = document.querySelector(".pageName");
const pageContent = document.querySelector(".pageContent");
const leftButtonSpan = document.querySelector(".leftButtonSpan");
const leftHeaderButton = document.querySelector(".leftButton");
const rightButtonSpan = document.querySelector(".rightButtonSpan");
const rightHeaderButton = document.querySelector(".rightButton");
pageName.setAttribute("page", "");
const origin = pageName.getAttribute("origin");

let currentLocalUser;
let isPrivacyPublic = false;
let newCircleNameInput = "";
let isEditable = false;
let addPictureSrc;
let circleImgSrc;
let albumPhotos = [];
let albumObj = {};
let checkedFriends = [];
let navigationHistory = [];

async function initiatePage() {
  let sandbox = false;
  const url = document.location.href.split("http://")[1].split("/")
  if (url.length === 5 && url[1] === "circle" && url[3] === "view") {
    sandbox = true;
  } 
  const username = await getSessionFromBackend();
  currentLocalUser = username;
  console.log("current User:", username);
  if (sandbox && !currentLocalUser) {
    const sandboxHelper = {
      circleId : url[2],
      accessToken : url[4]
    }
    const { success, data } = await getSandboxData(sandboxHelper)
    if (success && data) {
      await displaySandboxNav();
      await displaySandboxCircle(data);
    }
    return await displayCircle
  } else if (!currentLocalUser) {
    await displayLoginPage();
  } else {
    const { success, data } = await getUser(username);
    if (success && data) {
      socket.emit("joinRoom", currentLocalUser)
      await displayExplore(data);
    }
  }
}

async function main() {
  await initiatePage();
}

main();

const header = document.querySelector("header");
header.addEventListener("click", async (event) => {
  const target = event.target.closest("button")
  console.log(target.id)
  switch (target.id) {
    case "backToExplore": {
      const { success, data } = await getUser(currentLocalUser);
      await displayExplore(data);
      break;
    }
    case "currentUserProfile": {
      const { success, data } = await getUser(currentLocalUser);
      await displayProfile(data);
      break;
    }
    case "mapButton": {
      await displayMap();
      break;
    }
    case "backToExplore": {
      const { success, data } = await getUser(currentLocalUser);
      await displayExplore(data);
      break;
    }
    case "circleEditButton": {
      const circleId = document.querySelector(".leftButton").getAttribute("circleId");
      const ownerId = document.querySelector("#circleEditButton").getAttribute("ownerId");
      await displayCircleEditMode(circleId, ownerId);
      break;
    }
    case "albumEditButton": {
      leftHeaderButton.id = "backToAlbum";
      const albumId = document.querySelector(".leftButton").getAttribute("albumId");
      const ownerId = document.querySelector("#albumEditButton").getAttribute("ownerId");
      const memberStatus = document.querySelector("#albumEditButton").getAttribute("memberStatus");
      await displayAlbumEditMode(albumId, ownerId, memberStatus);
      break;
    }
    case "backToProfile": {
      const user = leftHeaderButton.getAttribute("username");
      const { success, data } = await getUser(user);
      if (success && data) {
        await displayProfile(data);
      }
      break;
    }
    case "updateCircle": {
      pageName.classList.remove("text-light-mode-accent");
      const privacyCheckbox = document.querySelector("#privacyCheckbox");
      const circleImage = document.querySelector("#circleImage img");
      const circleNameInput = document.querySelector("#circleNameInput");
      const circleId = leftHeaderButton.getAttribute("circleId");
  
      if (!circleNameInput.value) {
        return displayPopup("Missing circle name");
      }
  
      const circleObj = {
        circleId,
        circleImg: circleImage.src,
        circleName: circleNameInput.value,
        isPublic: privacyCheckbox.checked
      }
      const {success, data } = await updateCircle(circleObj);
      let circleIdFromUpdate = data;
      if (success && data) {
        const { success, data } = await getCircle(circleIdFromUpdate);
        if (success && data) {
          await displayCircle(data);
        }
      }
      break;
    }
    case "deleteCircle": {
      const circleId = leftHeaderButton.getAttribute("circleId");
      await displayConfirmationPopup(`delete circle`, { circleId })
      break;
    }
    case "backToCircle": {
      const circleId = leftHeaderButton.getAttribute("circleId");
      const { success, data } = await getCircle(circleId);
      if (success && data) {
        nav.classList.remove("hidden");
        albumPhotos = [];
        await displayCircle(data);
      }
      break;
    }
    case "updateAlbum": {
      const albumId = leftHeaderButton.getAttribute("albumId");
      const albumName = document.querySelector("#albumNameInput").value;
      const helperObj = { albumId, albumName }

      const { success, error} = await updateAlbum(helperObj)
      if (success && !error) {
        const { success, data } = await getAlbum(helperObj.albumId)
        if (success && data) {
          await displayAlbum(data);
        }
      }
      break;
    }
    case "deleteAlbum": {
      const albumId = leftHeaderButton.getAttribute("albumId");
      const circleId = leftHeaderButton.getAttribute("circleId");
      await displayConfirmationPopup(`delete album`, { albumId, circleId });
      break;
    }
    case "backToAlbum": {
      const albumId = leftHeaderButton.getAttribute("albumId");
      const { success, data }= await getAlbum(albumId);
      if (success && data) {
        albumPhotos = [];
        await displayAlbum(data);
      }
      break;
    }
    case "inviteDoneButton": {
      saveCheckedFriends()
      const circleId = leftHeaderButton.getAttribute("circleid");
      leftHeaderButton.removeAttribute("circleId");
      for (let friend of checkedFriends) {
        const { success, data } = await handleSendCircleRequest(friend, circleId);
      }
      checkedFriends = [];
      const {success, data} = await getCircle(circleId);
      if (success && data) {
        nav.classList.remove("hidden");
        await displayCircle(data)
      }
      break;
    }
    case "friendsBackButton": {
      if (navigationHistory.length > 1) {
        navigationHistory.pop();
      }
      const previousUser = navigationHistory[navigationHistory.length - 1];
      const { success, data } = await getUser(previousUser);
      if (success && data) {
        if (navigationHistory.length === 1) {
          leftHeaderButton.removeAttribute("secondaryOrigin");
        }
        return await displayProfile(data);
      }
      break;
    }
    case "backToSearch": {
      await displaySearch();
      break;
    }
    case "backToSearchProfile": {
        leftHeaderButton.setAttribute("origin", "fromSearch");
        const user = leftHeaderButton.getAttribute("username");
        const { success, data } = await getUser(user);
        if (success && data) {
          await displayProfile(data);
        }
      break;
    }
    case "backToSearchCircle": {
      leftHeaderButton.setAttribute("origin", "fromSearchProfile");
      const circleId = leftHeaderButton.getAttribute("circleId");
      const { success, data } = await getCircle(circleId);
      if (success && data) {
        await displayCircle(data);
      }
      break;
    }
    case "backToExploreCircle": {
      const circleId = leftHeaderButton.getAttribute("circleId");
      const { success, data } = await getCircle(circleId);
      if (success && data) {
        leftHeaderButton.id = "backToExplore";
        await displayCircle(data);
      }
      break;
    }
    case "toActivity": {
      await displayActivity();
      break;
    }
    case "closeButton": {
      newCircleNameInput = "";
      nav.classList.remove("hidden");
      albumPhotos = [];
      const { success, data } = await getUser(currentLocalUser);
      if (success && data) {
        await displayExplore(data);
      }
      break;
    }
    case "albumNext": {
      const { success, data } = await getUser(currentLocalUser);
      if (success && data) {
        const circleRender = await displayListOfCircles(data);
        await showCreateOrAddToCircle(circleRender);
      }
      break;
    }
    case "addLocationBack": {
      const { success, data } = await getUser(currentLocalUser);
      if (success && data) {
        nav.classList.remove("hidden");
        const circleRender = await displayListOfCircles(data);
        rightHeaderButton.removeAttribute("fromCreateAlbum");
        showCreateOrAddToCircle(circleRender);
      }
      break;
    }
    case "addLocationNext" : {
      await displayAlbumConfirmation()
      leftHeaderButton.setAttribute("origin", "fromAlbumCreation")
      break;
    }
    case "addLocationSkip": {
      await displayAlbumConfirmation();
      leftHeaderButton.setAttribute("origin", "fromAlbumCreation")
      break;
    }
    case "albumConfirmationBack": {
      await displayAddLocation()
      break;
    }
    case "addCircleBack": {
      await displayPhotoUploadPreview(albumPhotos);
      break;
    }
    case "createAlbum": {
      const albumName = await getAlbumName();
      albumObj.name = albumName;
      const { success, data, error } = await handleCreateAlbum(albumObj);
      if (error) {
        if (error === "Missing album name") {
          await displayPopup("Please add a title to your album");
        }
        return;
      }
      const albumId = data;
      if (success && data) {
        const { success, data, error } = await getAlbum(albumId);
        if (success && data) {
          await displayPopup("album created");
          leftHeaderButton.setAttribute("albumId", albumId);
          await displayAlbum(data);
          albumPhotos = [];
          nav.classList.remove("hidden");
        }
      }
      break;
    }
    case "addPhotosToAlbum": {
      const albumId = leftHeaderButton.getAttribute("albumId");
  
      if (albumId) {
        const { success, data, error } = await addPhotosToAlbum(albumId, albumObj);
        if (success && data) {
          const albumResponse = await getAlbum(albumId);
          if (albumResponse.success && albumResponse.data) {
            albumPhotos = [];
            await displayPopup("images successfully added");
            await displayAlbum(albumResponse.data);
          } else {
            console.log(albumResponse.error);
          }
        } else {
          console.log(error);
        }
      }
      await cleanUpSectionEventListener();
      break;
    }
    case "nextInviteFriends": {
      const circleName = document.querySelector("#circleName");
      newCircleNameInput = circleName.value;
      circleImgSrc = document.querySelector("#circleImage").src;
      isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
      await displayInviteFriends();
      break;
    }
    case "circleBackButton": {
      await displayCreateCircle();
      const circleName = document.querySelector("#circleName");
      document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
      document.querySelector("#circleImage").src = circleImgSrc;
      const addPictureButton = document.querySelector("#addPicture");
      addPictureButton.textContent = "Change Picture";
      addPictureButton.className = "w-380 h-45 bg-white border-2 border-dark-grey text-dark-grey rounded-input-box fixed bottom-8";
      circleName.value = newCircleNameInput;
      await updateCheckbox();
      break;
    }
    case "circleNext": {
      saveCheckedFriends();
      await displayCreateCirclePreview();
      circleName.value = newCircleNameInput;
      document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
      document.querySelector("#circleImage").src = circleImgSrc;
      await updateCheckbox();
      break;
    }
    case "circlePreviewBack": {
      const circleName = document.querySelector("#circleName");
      circleImgSrc = document.querySelector("#circleImage").src;
      isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
      newCircleNameInput = circleName.value;
      await displayInviteFriends();
      break;
    }
    case "createCircle": {
      isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
      const { success, data, error } = await handleCreateCircle();
      if (error) {
        if (error === "Missing circle name") {
          await displayPopup("Please add a title to your circle");
        }
        return;
      }
      const circleId = data;
      if (success && data) {
        for (let friend of checkedFriends) {
          const { success, data } = await handleSendCircleRequest(friend, circleId);
        }
        checkedFriends = [];
        const { success, data, error } = await getCircle(circleId);
        if (success && data) {
          await displayPopup("circle created");
          await displayCircle(data);
        }
        nav.classList.remove("hidden");
      }
      break;
    }
    case "createCircleToAlbum": {
      isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
      const { success, data, error } = await handleCreateCircle();
      if (error) {
        if (error === "Missing circle name") {
          await displayPopup("Please add a title to your circle");
        }
        console.log(error);
        return;
      }
      const circleId = data;
      if (success && data) {
        for (let friend of checkedFriends) {
          const { success, data } = await handleSendCircleRequest(friend, circleId);
        }
        checkedFriends = [];
        albumObj.isCircle = true;
        albumObj.id = circleId;

        let { success, data, error } = await getCircle(circleId);
        if (success && data) {
          albumObj.circleSrc = data.circle.picture;
          albumObj.circleName = data.circle.name;
        }
        leftHeaderButton.removeAttribute("origin");
        await displayPopup("circle created");
        await displayAddLocation();
        nav.classList.remove("hidden");
      }
      break;
    }
    case "inviteDone": {
      saveCheckedFriends()
      const circleId = leftHeaderButton.getAttribute("circleId");
      leftHeaderButton.removeAttribute("circleId");
      for (let friend of checkedFriends) {
        const { success, data } = await handleSendCircleRequest(friend, circleId);
      }
      checkedFriends = [];
      const {success, data} = await getCircle(circleId)
      if (success && data) {
        nav.classList.remove("hidden");
        await displayCircle(data)
      }
      break;
    }
    case "circleShareButton": {
      const circleId = leftHeaderButton.getAttribute("circleId");
      const { success, data } = await createShareLink(circleId);
      if (success) {
        try {
          await navigator.clipboard.writeText(`http://localhost:5000${data}`);
          await displayPopup("share link copied to clipboard");
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      } else {
        console.error('Failed to create share link');
      }
      break;
    }
    case "backToAlbumSandbox": {
      leftHeaderButton.innerHTML = "";
      const url = document.location.href.split("http://")[1].split("/")
      const sandboxHelper = {
        circleId : url[2],
        accessToken : url[4]
      }
      const { success, data } = await getSandboxData(sandboxHelper)
      if (success && data) {
        await displaySandboxNav();
        await displaySandboxCircle(data);
      }
      break;
    }
    default:
      break;
  }

});

// create Cirlcle/Album modal
function openModal() {
  modal.classList.remove("hidden");
  modal.classList.add("shown");
}

function closeModal() {
  modal.classList.remove("shown");
  modal.classList.add("hidden");
}

const modal = document.querySelector("#modal");
modal.addEventListener("click", async function (event) {
  event.preventDefault();

  const modalBox = document.querySelector("#modalBox");
  if (event.target === modal && !modalBox.contains(event.target)) {
    closeModal();
  }

  const closeModalButton = event.target.closest("#closeModalButton");
  const createAlbumModalButton = event.target.closest(
    "#createAlbumModalButton"
  );
  const createCircleModalButton = event.target.closest("#createCircleModalButton");
  if (closeModalButton) {
    if (modal.classList.contains("shown")) {
      closeModal();
    }
  }

  if (createAlbumModalButton) {
    clearNewAlbum();
    closeModal();
    nav.classList.add("hidden");
    await displayPhotoUpload();
  }

  if (createCircleModalButton) {
    leftHeaderButton.removeAttribute("circleId");
    clearNewAlbum();
    closeModal();
    await displayCreateCircle();
    await cleanUpSectionEventListener();
  }
});

const closeModalSwipe = document.querySelector("#closeModal");
closeModalSwipe.addEventListener("swiped-down", (event) => {
  closeModal();
});

async function handleLocalAuth() {
  let { success, data, error } = await localAuth();
  if (success && data) {
    currentLocalUser = data;
    console.log("local auth user is", data);
    const { success: getUserSuccess, data: userData } = await getUser(
      currentLocalUser
    );
    if (getUserSuccess && userData) {
      await displayExplore(userData);
    }
  }
}

pageContent.addEventListener("click", async (event) => {
  const localAuthButton = event.target.closest("#localAuth");
  const logOut = event.target.closest("#logOut");

  if (localAuthButton) {
    handleLocalAuth();
  }

  if (logOut) {
    window.location.href = "/auth/logout";
  }
});

async function updateCheckbox() {
  if (document.querySelector("#privacyCheckbox").checked) {
    const privacyIcon = document.querySelector("#privacyIcon")
    privacyIcon.src = "/lightmode/globe_icon.svg";
    privacyLabel.innerHTML = "Public";
    return;
  }
}

async function getAlbumName() {
  const albumNameInput = document.querySelector("#albumName");
  if (albumNameInput) {
    const albumName = albumNameInput.value;
    return albumName;
  } else {
    return null;
  }
}

async function cleanUpSectionEventListener() {
  const section = document.querySelector("section");
  section.removeEventListener("mousedown", sectionUploadClick, true);
  section.removeEventListener("dragover", sectionDrag, true);
  section.removeEventListener("drop", sectionDrop, true);
  console.log("CLEANED");
}

async function sectionUploadClick(event) {
  const fileInput = document.querySelector("#fileUpload");
  event.preventDefault();
  event.stopImmediatePropagation();
  await fileInput.click();
}

sectionDrag = async (event) => {
  event.preventDefault();
};

sectionDrop = async (event) => {
  event.preventDefault();
  await dropHandler(event);
};

async function dropHandler(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = await uploadFile(files[i]);
    albumPhotos.push(file);
  }
  if (files.length > 0) {
    await displayPhotoUploadPreview(albumPhotos);
    await cleanUpSectionEventListener();
  }
}

async function showCreateOrAddToCircle(circleRender) {
  pageName.textContent = "Add to a Circle";
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "addCircleBack";
  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
  <div id="addAlbumToCircle" class="container pb-16 mb-4 w-full">
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full mb-3">
      <p>choose which circle you want your album</p>
      <p>to be added to</p>
    </div>
    <div id="createNewCircle" class="grid place-items-center mb-2">
      ${createNewCircleIcon}
      <p class="text-center text-secondary mt-4">create new circle</p>
    </div>
    <div id="circleList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-12 place-items-center">
      ${circleRender.join("")}
    </div>
    <div class="h-100"></div>
  </div>`;

  await cleanUpSectionEventListener();
  document.querySelector("#circleList").addEventListener("click", async function (event) {
    const circleDiv = event.target.closest("div.circle");
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")) {
        albumObj.isCircle = true;
        albumObj.id = circleDiv.id;

        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
          albumObj.circleSrc = data.circle.picture;
          albumObj.circleName = data.circle.name;
        }
        await displayAddLocation();
      }
    }
  });
  document.querySelector("#createNewCircle").addEventListener("click", async function (event) {
    leftHeaderButton.setAttribute("origin", "fromCreateAlbum");
    await displayCreateCircle();
  });
}

const clearNewAlbum = () => {
  leftHeaderButton.removeAttribute("albumId");
  albumObj = {};
  albumPhotos = [];
};

const displayCircleEditMode = (circleId, ownerId) => {
  pageName.textContent = "Edit";
  const page = pageName.getAttribute("page");
  if (page === "circleEdit") {
    pageName.classList.add("text-light-mode-accent");
  }
  
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "backToCircle";
  leftHeaderButton.setAttribute("circleId", circleId);

  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2 items-center">
    ${currentLocalUser === ownerId ? `
    <button id="deleteCircle" class="w-6 h-6">${deleteIcon}</button>` : ""}
    <button id="updateCircle" circleid="${circleId}" class="text-lg">Save</button>
  </div>`;

  const privacyCheckboxDiv = document.querySelector(".privacyCheckboxDiv");
  privacyCheckboxDiv.classList.remove("hidden");

  const privacyCheckbox = document.querySelector("#privacyCheckbox");
  privacyCheckbox.addEventListener("change", async function () {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    privacyIcon.src = "/lightmode/lock_icon.svg";
    privacyIcon.className = "mr-4 h-5 w-5";
    privacyLabel.innerHTML = "Private";
    await updateCheckbox();
  });

  const circleImage = document.querySelector("#circleImage img");
  const hiddenImageInput = document.createElement("input");
  hiddenImageInput.id = "fileUpload";
  hiddenImageInput.type = "file";
  hiddenImageInput.multiple = "false";
  hiddenImageInput.className = "hidden";
  const editOverlay = document.createElement("div");
  editOverlay.className =
    "absolute bg-image-overlay rounded-full z-30 w-180 h-180";
  circleImage.parentNode.append(editOverlay);

  const overlayEditIcon = document.createElement("div");
  overlayEditIcon.innerHTML = `
    <svg width="36" height="36" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 5.76359C22.0008 5.61883 21.9731 5.47533 21.9183 5.34132C21.8636 5.20731 21.7829 5.08542 21.681 4.98265L17.017 0.318995C16.9142 0.217053 16.7923 0.136401 16.6583 0.0816639C16.5243 0.026927 16.3808 -0.000818536 16.236 1.83843e-05C16.0912 -0.000818536 15.9477 0.026927 15.8137 0.0816639C15.6797 0.136401 15.5578 0.217053 15.455 0.318995L12.342 3.43176L0.319018 15.4539C0.217068 15.5566 0.136411 15.6785 0.0816699 15.8125C0.0269289 15.9466 -0.000818595 16.09 1.83857e-05 16.2348V20.8985C1.83857e-05 21.1902 0.115911 21.4699 0.3222 21.6762C0.52849 21.8825 0.808279 21.9984 1.10002 21.9984H5.76401C5.91793 22.0067 6.07189 21.9827 6.21591 21.9277C6.35993 21.8728 6.49079 21.7882 6.60001 21.6794L18.557 9.6573L21.681 6.59953C21.7814 6.49292 21.8632 6.37023 21.923 6.23655C21.9336 6.14888 21.9336 6.06025 21.923 5.97257C21.9281 5.92137 21.9281 5.86978 21.923 5.81858L22 5.76359ZM5.31301 19.7985H2.20001V16.6858L13.123 5.76359L16.236 8.87636L5.31301 19.7985ZM17.787 7.32547L14.674 4.2127L16.236 2.66182L19.338 5.76359L17.787 7.32547Z" fill="white"/>
    </svg>`;
  overlayEditIcon.className = "absolute top-[70px] left-[70px] z-40";
  editOverlay.append(overlayEditIcon);

  circleImage.parentNode.append(hiddenImageInput);
  editOverlay.addEventListener("click", async function (event) {
    event.preventDefault();
    await hiddenImageInput.click();
  });
  hiddenImageInput.addEventListener("input", async function (event) {
    event.preventDefault();
    const res = await handleSelectFile();
    if (res) {
      circleImage.src = await res.data.url;
    }
  });

  const circleName = document.querySelector("#circleName p");
  const circleNameInput = document.createElement("input");
  circleNameInput.id = "circleNameInput";
  circleNameInput.type = "text";
  circleNameInput.placeholder = "Add a circle name";
  circleNameInput.value = circleName.textContent;
  circleNameInput.className = "max-w-full text-center bg-transparent text-20 text-black font-light border-dark-grey";
  circleName.remove();
  document.querySelector("#circleName").append(circleNameInput);
}