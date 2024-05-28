const pageName = document.querySelector("#pageName");
const pageContent = document.querySelector("#pageContent");
const leftHeaderButton = document.querySelector("#leftButton");
const leftButtonSpan = document.querySelector(".leftButtonSpan");
const rightHeaderButton = document.querySelector("#rightButton");
const rightButtonSpan = document.querySelector(".rightButtonSpan");
rightButtonSpan.removeAttribute("fromCreateAlbum");
pageName.setAttribute("page", "");

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
  const nextButtonInviteFriends = event.target.closest("#nextInviteFriends");
  const nextButton = event.target.closest("#nextButton");
  const backButton = event.target.closest("#backButton");
  const circleBackButton = event.target.closest("#circleBackButton");
  const circlePreviewBackButton = event.target.closest("#circlePreviewBackButton");
  const createCircleButton = event.target.closest("#createCircleButton");
  const closeButton = event.target.closest("#closeButton");
  const albumNextButton = event.target.closest("#albumNextButton");
  const backButtonAlbum = event.target.closest("#backButtonAlbum");
  const createAlbumButton = event.target.closest("#createAlbum");
  const albumConfirmationBackButton = event.target.closest("#albumConfirmationBackButton");
  const addCircleBackButton = event.target.closest("#addCircleBackButton");
  const toActivity = event.target.closest("#toActivity");
  const emailBackButton = event.target.closest("#emailBack");
  const friendsBackButton = event.target.closest("#friendsBackButton");
  const circleViewBackButton = event.target.closest("#circleViewBackButton");
  const profileBackButton = event.target.closest("#profileBackButton");
  const settingsBackButton = event.target.closest("#settingsBackButton");
  const albumToProfileButton = event.target.closest("#albumToProfileButton");
  const circleToProfileButton = event.target.closest("#circleToProfileButton");
  const albumToCircleButton = event.target.closest("#albumToCircleButton");
  const newAlbumToCircleButton = event.target.closest("#newAlbumToCircleButton");
  const circleEditButton = event.target.closest("#circleEditButton");
  const circleShareButton = event.target.closest("#circleShareButton");
  const updateCircleButton = event.target.closest("#updateCircle");
  const backToAlbumButton = event.target.closest("#backToAlbumButton");
  const updateAlbumButton = event.target.closest("#updateAlbum");
  const createCircleToAlbum = event.target.closest("#createCircleToAlbum");
  const mapButton = event.target.closest("#mapButton");
  const mapBackButton = event.target.closest("#mapBackButton");
  const inviteDoneButton = event.target.closest("#inviteDoneButton");
  const backToExplore = event.target.closest("#backToExplore");
  const backToProfile = event.target.closest("#backToProfile");
  const backToFriendRequests = event.target.closest("#backToFriendRequests");
  const backToCircle = event.target.closest("#backToCircle");
  const deleteCircle = event.target.closest("#deleteCircle");

  if (backToProfile) {
    const user = leftButtonSpan.getAttribute("username");
    leftButtonSpan.removeAttribute("origin");
    await displayFriends(user);
  }

  if (deleteCircle) {
    console.log("ligma");
  }

  if (backToFriendRequests) {
    leftButtonSpan.removeAttribute("origin");
    await displayFriendRequests(currentLocalUser);
  }

  if (backToCircle) {
    const circleId = leftButtonSpan.getAttribute("circleId");
    leftButtonSpan.removeAttribute("id");
    const imgElement = document.querySelector(".backSpan img");
    if (imgElement) {
      imgElement.id = "backToExplore";
    }
    const { success, data } = await getCircle(circleId);
    if (success && data) {
      leftButtonSpan.removeAttribute("circleId");
      await displayCircle(data);
    }
  }

  if (mapButton) {
    await displayMap();
  }

  if (mapBackButton) {
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      await displayExplore(data);
    }
  }

  if (backToExplore) {
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      if (leftButtonSpan) {
        leftButtonSpan.removeAttribute("origin");
      }
      await displayExplore(data);
    }
  }

  if (emailBackButton) {
    await displayLoginPage();
  }

  if (nextButtonInviteFriends) {
    console.log("hello")
    const circleName = document.querySelector("#circleName");
    newCircleNameInput = circleName.value;
    circleImgSrc = document.querySelector("#circleImage").src;
    isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
    await displayInviteFriends();
    return;
  }

  if (nextButton) {
    saveCheckedFriends();
    await displayCreateCirclePreview();
    circleName.value = newCircleNameInput;
    document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
    document.querySelector("#circleImage").src = circleImgSrc;
    await updateCheckbox();
    return;
  }

  if (createCircleButton) {
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
        const { success, data } = await handleSendCircleRequest(
          friend,
          circleId
        );
      }
      checkedFriends = [];
      const { success, data, error } = await getCircle(circleId);
      if (success && data) {
        await displayPopup("circle created");
        await displayCircle(data);
      }
      nav.classList.remove("hidden");
    }
    return;
  }

  if (createCircleToAlbum) {
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
        const { success, data } = await handleSendCircleRequest(
          friend,
          circleId
        );
      }
      checkedFriends = [];
      albumObj.isCircle = true;
      albumObj.id = circleId;

      let { success, data, error } = await getCircle(circleId);
      if (success && data) {
        albumObj.circleSrc = data.circle.picture;
        albumObj.circleName = data.circle.name;
      }
      rightButtonSpan.removeAttribute("fromCreateAlbum");
      await displayPopup("circle created");
      await displayAlbumConfirmation();
      nav.classList.remove("hidden");
    }
    return;
  }

  if (backButton) {
    nav.classList.remove("hidden");
    newCircleNameInput = "";
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      await displayExplore(data);
    }
    return;
  }

  if (circleBackButton) {
    await displayCreateCircle();
    const circleName = document.querySelector("#circleName");
    document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
    document.querySelector("#circleImage").src = circleImgSrc;
    const addPictureButton = document.querySelector("#addPicture");
    addPictureButton.textContent = "Change Picture";
    addPictureButton.className = "w-380 h-45 bg-white border-2 border-dark-grey text-dark-grey rounded-input-box fixed bottom-8";
    circleName.value = newCircleNameInput;
    await updateCheckbox();
    return;
  }

  if (closeButton) {
    newCircleNameInput = "";
    nav.classList.remove("hidden");
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      await displayExplore(data);
    }
    return;
  }

  if (backToAlbumButton) {
    const albumId = leftButtonSpan.getAttribute("albumId");
    const { success, data, error } = await getAlbum(albumId);
    if (success && data) {
      await displayAlbum(data);
      nav.classList.remove("hidden");
    }
    await cleanUpSectionEventListener();
  }

  if (updateAlbumButton) {
    const albumId = leftButtonSpan.getAttribute("albumId");
  
    if (albumId) {
      const { success, data, error } = await updateAlbum(albumId, albumObj);
      if (success && data) {
        const albumResponse = await getAlbum(albumId);
        if (albumResponse.success && albumResponse.data) {
          albumPhotos = [];
          await displayPopup("images successfully added");
          rightButtonSpan.removeAttribute("id");
          await displayAlbum(albumResponse.data);
        } else {
          console.log(albumResponse.error);
        }
      } else {
        console.log(error);
      }
    }
    await cleanUpSectionEventListener();
  }  

  if (albumNextButton) {
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      const circleRender = await displayListOfCircles(data);
      await showCreateOrAddToCircle(circleRender);
      return;
    }
  }

  if (addCircleBackButton) {
    await displayPhotoUploadPreview(albumPhotos);
  }

  if (backButtonAlbum) {
    const span = event.target.closest("span");
    if (span) {
      if (span.hasAttribute("id")) {
        let { success, data, error } = await getCircle(span.id);
        if (success && data) {
          await displayCircle(data);
        }
      }
    }
  }

  if (circlePreviewBackButton) {
    const circleName = document.querySelector("#circleName");
    circleImgSrc = document.querySelector("#circleImage").src;
    isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
    newCircleNameInput = circleName.value;
    await displayInviteFriends();
    return;
  }

  if (albumConfirmationBackButton) {
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      nav.classList.remove("hidden");
      const circleRender = await displayListOfCircles(data);
      rightButtonSpan.removeAttribute("fromCreateAlbum");
      showCreateOrAddToCircle(circleRender);
      return;
    }
  }

  if (createAlbumButton) {
    const albumName = await getAlbumName();
    albumObj.name = albumName;
    const { success, data, error } = await handleCreateAlbum(albumObj);
    if (error) {
      if (error === "Missing album name") {
        await displayPopup("Please add a title to your album");
      }
      console.log(error);
      return;
    }
    const albumId = data;
    if (success && data) {
      rightButtonSpan.removeAttribute("createAlbum");
      const { success, data, error } = await getAlbum(albumId);
      if (success && data) {
        await displayPopup("album created");
        await displayAlbum(data);
        nav.classList.remove("hidden");
      }
    }
    return;
  }

  if (toActivity) {
    await displayActivity();
  }

  if (friendsBackButton) {
    const username = friendsBackButton.name;
    const { success, data } = await getUser(username);
    if (success && data) {
      return await displayProfile(data);
    }
  }

  if (circleViewBackButton) {
    const user = event.target.closest("span").getAttribute("username");
    const { success, data } = await getUser(user);
    if (success && data) {
      return await displayProfile(data);
    }
  }

  if (profileBackButton) {
    await displaySearch();
  }

  if (circleToProfileButton) {
    const backSpan = document.querySelector(".backSpan");
    const username = backSpan.getAttribute("username");
    rightHeaderButton.innerHTML = "";
    const { success, data } = await getUser(username);
    if (success && data) {
      backSpan.removeAttribute("circleId");
      await displayProfile(data);
    }
  }

  if (albumToProfileButton) {
    const user = event.target.closest("span").getAttribute("username");
    const { success, data } = await getUser(user);
    if (success && data) {
      return await displayProfile(data);
    }
  }

  if (albumToCircleButton) {
    const circleId = event.target.closest("span").getAttribute("circleId");
    const { success, data } = await getCircle(circleId);
    const backSpan = document.querySelector(".backSpan");
    backSpan.removeAttribute("circleId");
    if (success && data) {
      nav.classList.remove("hidden");
      return await displayCircle(data);
    }
  }

  if (newAlbumToCircleButton) {
    const circleId = event.target.closest("img").getAttribute("circleId");
    const { success, data } = await getCircle(circleId);
    if (success && data) {
      return await displayCircle(data);
    }
  }

  if (settingsBackButton) {
    const { success, data } = await getUser(currentLocalUser);
    if (success && data) {
      return await displayProfile(data);
    }
  }

  if (circleEditButton) {
    const circleId = document.querySelector("#circleEditButton span").getAttribute("circleid");
    pageName.setAttribute("page", "circleEdit");
    await displayCircleEditMode(circleId)
  }

  if (circleShareButton) {
    console.log("SHARE CIRCLE")
  }

  if (updateCircleButton) {
    pageName.classList.remove("text-light-mode-accent");
    const backSpan = document.querySelector("span.backSpan")
    const privacyCheckbox = document.querySelector("#privacyCheckbox");
    const circleImage = document.querySelector("#circleImage img");
    const circleNameInput = document.querySelector("#circleNameInput");
    const circleId = document.querySelector("#rightButton img").getAttribute("circleid");

    if (!circleNameInput.value) {
      return displayPopup("Missing circle name")
    }

    const circleObj = {
      circleId,
      circleImg: circleImage.src,
      circleName: circleNameInput.value,
      isPublic: privacyCheckbox.checked
    }
    const {success, data, error } = await updateCircle(circleObj);
    let circleIdFromUpdate = data;
    console.log(data)
    if (success && data) {
      backSpan.removeAttribute("circleId");
      const { success, data, error } = await getCircle(circleIdFromUpdate);
      if (success && data) {
        await displayCircle(data);
      }
    }
  }

  if (inviteDoneButton) {
    saveCheckedFriends()
    const backSpan = document.querySelector("span.backSpan");
    if (backSpan) {
      const circleId = backSpan.getAttribute("circleid")
      backSpan.removeAttribute("circleId");
      for (let friend of checkedFriends) {
        const { success, data } = await handleSendCircleRequest(
          friend,
          circleId
        );
      }
      checkedFriends = [];
      const {success, data} = await getCircle(circleId)
      if (success && data) {
        nav.classList.remove("hidden");
        await displayCircle(data)
      }
    }
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

const displayCircleEditMode = (circleId) => {
  pageName.textContent = "Edit";
  const page = pageName.getAttribute("page");
  if (page === "circleEdit") {
    pageName.classList.add("text-light-mode-accent");
  }
  
  const backSpan = document.querySelector("span.backSpan");
  if (backSpan) {
    if (backSpan.getAttribute("username")) {
      backSpan.removeAttribute("username");
    }
    backSpan.setAttribute("circleId", circleId)
    backSpan.childNodes[0].id = "albumToCircleButton";
  } else {
    leftHeaderButton.innerHTML = `<span class="backSpan" circleid="${circleId}"><img src="/lightmode/back_button.svg" alt="Back Button" id="albumToCircleButton" class=""></span>`;
  }

  const trashCanIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 3.55357V4.57143H1.0625C0.780707 4.57143 0.510456 4.67867 0.311199 4.86955C0.111942 5.06044 0 5.31933 0 5.58929C0 5.85924 0.111942 6.11813 0.311199 6.30902C0.510456 6.4999 0.780707 6.60714 1.0625 6.60714H1.4875L2.64208 17.6679C2.69475 18.1699 2.94015 18.6353 3.33069 18.9738C3.72122 19.3123 4.22907 19.4998 4.75575 19.5H12.2442C12.7709 19.4998 13.2788 19.3123 13.6693 18.9738C14.0599 18.6353 14.3052 18.1699 14.3579 17.6679L15.5125 6.60714H15.9375C16.2193 6.60714 16.4895 6.4999 16.6888 6.30902C16.8881 6.11813 17 5.85924 17 5.58929C17 5.31933 16.8881 5.06044 16.6888 4.86955C16.4895 4.67867 16.2193 4.57143 15.9375 4.57143H12.75V3.55357C12.75 2.74371 12.4142 1.96703 11.8164 1.39437C11.2186 0.821715 10.4079 0.5 9.5625 0.5H7.4375C6.59212 0.5 5.78137 0.821715 5.1836 1.39437C4.58582 1.96703 4.25 2.74371 4.25 3.55357ZM7.4375 2.53571C7.15571 2.53571 6.88546 2.64295 6.6862 2.83384C6.48694 3.02472 6.375 3.28362 6.375 3.55357V4.57143H10.625V3.55357C10.625 3.28362 10.5131 3.02472 10.3138 2.83384C10.1145 2.64295 9.84429 2.53571 9.5625 2.53571H7.4375ZM5.7375 7.28571C5.87707 7.27895 6.01666 7.29864 6.14827 7.34364C6.27989 7.38864 6.40095 7.45807 6.50451 7.54795C6.60808 7.63783 6.69212 7.74641 6.75182 7.86745C6.81151 7.9885 6.8457 8.11964 6.85242 8.25336L7.242 15.7176C7.25239 15.9851 7.15236 16.2458 6.96357 16.4432C6.77479 16.6405 6.51244 16.7587 6.23336 16.7721C5.95428 16.7855 5.68093 16.693 5.47251 16.5147C5.2641 16.3364 5.13739 16.0866 5.11983 15.8194L4.73025 8.35514C4.723 8.22154 4.7433 8.08789 4.79001 7.96181C4.83672 7.83574 4.90891 7.71973 5.00246 7.6204C5.09601 7.52108 5.20908 7.44039 5.3352 7.38297C5.46133 7.32554 5.59803 7.29249 5.7375 7.28571ZM11.2625 7.28571C11.402 7.29232 11.5387 7.3252 11.6649 7.38246C11.7911 7.43973 11.9043 7.52026 11.9979 7.61946C12.0916 7.71866 12.164 7.83457 12.2108 7.96057C12.2577 8.08657 12.2782 8.22019 12.2712 8.35379L11.8816 15.8181C11.864 16.0852 11.7373 16.335 11.5289 16.5133C11.3205 16.6916 11.0471 16.7841 10.7681 16.7707C10.489 16.7573 10.2266 16.6392 10.0378 16.4418C9.84906 16.2444 9.74903 15.9838 9.75942 15.7163L10.149 8.252C10.1633 7.98266 10.2886 7.72976 10.4974 7.54885C10.7061 7.36793 10.9813 7.27242 11.2625 7.28571Z" fill="#0E0E0E"/>
  </svg>`;

  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2">
    <button id="deleteCircle" class="w-6 h-6 items-center justify-center">
        ${trashCanIcon}
    </button>
    <img src="/lightmode/save_button.svg" alt="Save Button" id="updateCircle" circleid="clw302sg20005flw93a45fqsa">
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