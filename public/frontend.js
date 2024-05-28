const pageName = document.querySelector(".pageName");
const pageContent = document.querySelector(".pageContent");
const leftButtonSpan = document.querySelector(".leftButtonSpan");
const leftHeaderButton = document.querySelector(".leftButton");
const rightButtonSpan = document.querySelector(".rightButtonSpan");
const rightHeaderButton = document.querySelector(".rightButton");

rightButtonSpan.removeAttribute("fromCreateAlbum");
pageName.setAttribute("page", "");
const origin = pageName.getAttribute("origin");
const destination = pageName.getAttribute("destination");

let currentLocalUser;
let isPrivacyPublic = false;
let newCircleNameInput = "";
let isEditable = false;
let addPictureSrc;
let circleImgSrc;
let albumPhotos = [];
let albumObj = {};
let checkedFriends = [];

async function initiatePage() {
  const username = await getSessionFromBackend();
  currentLocalUser = username;
  console.log("current User:", username);
  if (!currentLocalUser) {
    await displayLoginPage();
  } else {
    const { success, data } = await getUser(username);
    if (success && data) {
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
      console.log(circleId);
      const ownerId = document.querySelector("#circleEditButton").getAttribute("ownerId")
      await displayCircleEditMode(circleId, ownerId);
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
        await displayCircle(data);
      }
      break;
    }
    case "inviteDoneButton": {
      saveCheckedFriends()
      const circleId = leftHeaderButton.getAttribute("circleid")
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
      const username = leftHeaderButton.getAttribute("username");
      const { success, data } = await getUser(username);
      if (success && data) {
        return await displayProfile(data);
      }
      break;
    }
    case "backToSearch": {
      await displaySearch();
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
    default:
      break;
  }

});

// create Cirlcle/Album modal
const modal = document.querySelector("#modal");
modal.addEventListener("click", async function (event) {
  event.preventDefault();
  const closeModalButton = event.target.closest("#closeModalButton");
  const createAlbumModalButton = event.target.closest("#createAlbumModalButton");
  const createCircleModalButton = event.target.closest("#createCircleModalButton");
  if (closeModalButton) {
    if (modal.classList.contains("shown")) {
      modal.classList.remove("shown");
      modal.classList.add("hidden");
    }
  }

  if (createAlbumModalButton) {
    clearNewAlbum();
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    nav.classList.add("hidden");
    await displayPhotoUpload();
  }

  if (createCircleModalButton) {
    clearNewAlbum();
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    await displayCreateCircle();
    await cleanUpSectionEventListener();
  }
});

const closeModalSwipe = document.querySelector("#closeModal");
closeModalSwipe.addEventListener("swiped-down", (event) => {
  modal.classList.remove("shown");
  modal.classList.add("hidden");
});

async function handleLocalAuth() {
  let { success, data, error } = await localAuth();
  if (success && data) {
    currentLocalUser = data;
    console.log("local auth user is", data);
    const { success: getUserSuccess, data: userData } = await getUser(currentLocalUser);
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
  pageName.innerHTML = `Add to a Circle`;
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="addCircleBackButton"></img>`;
  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
  <div id="addAlbumToCircle" class="container pb-16 mb-4 w-full">
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full mb-3">
      <p>choose which circle you want your album</p>
      <p>to be added to</p>
    </div>
    <div id="createNewCircle" class="grid place-items-center mb-2">
      <img src="/create_new_circle.svg" class="rounded-full w-100 h-100 object-cover mb-2"/></img>
      <p class="text-center text-secondary">create new circle</p>
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
        //MODIFY THIS TO SELECT CIRCLE TO BE USED FOR POST CONFIRMATION & POST

        albumObj.isCircle = true;
        albumObj.id = circleDiv.id;

        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
          albumObj.circleSrc = data.circle.picture;
          albumObj.circleName = data.circle.name;
        }
        await displayAlbumConfirmation();
      }
    }
  });
  document.querySelector("#createNewCircle").addEventListener("click", async function (event) {
    rightButtonSpan.setAttribute("fromCreateAlbum", true);
    await displayCreateCircle();
  });
}

const clearNewAlbum = () => {
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
  <div class="flex flex-row flex-nowrap gap-2">
  ${currentLocalUser === ownerId ? `
  <button id="deleteCircle" class="w-6 h-6 items-center justify-center">
    ${deleteIcon}
  </button>` : ""}
    <button id="updateCircle" circleid="${circleId}" class="text-lg">Save</button>
  </div>`;


  const privacyCheckboxDiv = document.querySelector(".privacyCheckboxDiv");
  privacyCheckboxDiv.classList.remove("hidden");

  const privacyCheckbox = document.querySelector("#privacyCheckbox");
  privacyCheckbox.addEventListener("change", async function () {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    privacyIcon.src = "/lightmode/lock_icon.svg";
    privacyIcon.className = "mr-4 h-5 w-5"
    privacyLabel.innerHTML = "Private";
    await updateCheckbox();
  });

  const circleImage = document.querySelector("#circleImage img");
  const hiddenImageInput = document.createElement("input");
  hiddenImageInput.id = "fileUpload";
  hiddenImageInput.type ="file";
  hiddenImageInput.multiple = "false";
  hiddenImageInput.className = "hidden";
  const editOverlay = document.createElement("div");
  editOverlay.className = "absolute bg-image-overlay rounded-full z-30 w-180 h-180";
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