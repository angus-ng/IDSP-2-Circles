const pageName = document.querySelector("#pageName");
const pageContent = document.querySelector("#pageContent");
const leftHeaderButton = document.querySelector("#leftButton");
const leftButtonSpan = document.querySelector(".leftButtonSpan");
const rightHeaderButton = document.querySelector("#rightButton");
const rightButtonSpan = document.querySelector(".rightButtonSpan");
rightButtonSpan.removeAttribute("fromCreateAlbum");

let currentLocalUser;
let isPrivacyPublic = false;
let newCircleNameInput = "";
let isEditable = false;
let addPictureSrc;
let circleImgSrc;
let albumPhotos = [];
let albumObj = {};
let checkedFriends = [];
let signUpData = {
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
};

async function initiatePage() {
  const username = await getSessionFromBackend();
  currentLocalUser = username;
  console.log("current User:", username);
  if (!currentLocalUser) {
    await displayLoginPage();
  } else {
    await displayExplore();
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
  const passwordBackButton = event.target.closest("#passwordBack");
  const birthdayBackButton = event.target.closest("#birthdayBack");
  const nameBackButton = event.target.closest("#nameBack");
  const usernameBackButton = event.target.closest("#usernameBack");
  const profilePictureBackButton = event.target.closest("#profilePictureBack");
  const profileConfirmationBackButton = event.target.closest("#profileConfirmationBack");
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

  if (emailBackButton) {
    await displayLoginPage();
  }

  if (passwordBackButton) {
    const primaryButton = document.querySelector("#passwordNext");
    primaryButton.id = "emailNext";
    await displaySignUpEmailPage();
  }

  if (birthdayBackButton) {
    const primaryButton = document.querySelector("#birthdayNext");
    primaryButton.id = "passwordNext";
    await displaySignUpPasswordPage();
  }

  if (nameBackButton) {
    const primaryButton = document.querySelector("#nameNext");
    primaryButton.id = "birthdayNext";
    await displaySignUpBirthdayPage();
  }

  if (usernameBackButton) {
    const primaryButton = document.querySelector("#usernameNext");
    primaryButton.id = "nameNext";
    await displaySignUpNamePage();
  }

  if (profilePictureBackButton) {
    const primaryButton = document.querySelector("#addProfilePicture");
    primaryButton.classList.remove("bottom-24");
    primaryButton.classList.add("bottom-8");
    primaryButton.textContent = "Next";
    primaryButton.id = "nameNext";
    const secondaryButton = document.querySelector("#profilePictureNext");
    secondaryButton.id = "secondaryButton";
    secondaryButton.classList.add("hidden");
    await displaySignUpUsernamePage();
  }

  if (profileConfirmationBackButton) {
    const primaryButton = document.querySelector("#doneButton");
    primaryButton.textContent = "Add Picture";
    primaryButton.id = "addProfilePicture";
    const secondaryButton = document.querySelector("#changeProfilePicture");
    secondaryButton.classList.remove("hidden");
    secondaryButton.textContent = "Skip";
    secondaryButton.id = "profilePictureNext";
    await displaySignUpProfilePicturePage();
  }

  if (nextButtonInviteFriends) {
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
      console.log(circleId);
      for (let friend of checkedFriends) {
        console.log(circleId);
        console.log("FRIEND", friend);
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
      await displayAlbumConfirmation();
      nav.classList.remove("hidden");
    }
    return;
  }

  if (backButton) {
    nav.classList.remove("hidden");
    newCircleNameInput = "";
    await displayExplore();
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
    pageName.innerHTML = "Explore";
    pageContent.innerHTML = "";
    leftHeaderButton.innerHTML = "";
    rightHeaderButton.innerHTML = `<img src="/lightmode/map_icon.svg" alt="Map Icon"</img>`;
    nav.classList.remove("hidden");
    return;
  }

  if (backToAlbumButton) {
    const albumId = leftButtonSpan.getAttribute("albumId");
    console.log(albumId);
    const { success, data, error } = await getAlbum(albumId);
    if (success && data) {
      await displayAlbum(data);
      nav.classList.remove("hidden");
    }
    await cleanUpSectionEventListener();
  }

  if (updateAlbumButton) {
    const albumId = leftButtonSpan.getAttribute("albumId");
    console.log(albumId);
  
    if (albumId) {
      const { success, data, error } = await updateAlbum(albumId, albumObj);
      if (success && data) {
        const albumResponse = await getAlbum(albumId);
        if (albumResponse.success && albumResponse.data) {
          albumPhotos = [];
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
    console.log("hep", span)
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
      console.log(circleRender);
      rightButtonSpan.removeAttribute("fromCreateAlbum");
      showCreateOrAddToCircle(circleRender);
      return;
    }
  }

  if (createAlbumButton) {
    console.log("album created");
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
      const { success, data, error } = await getAlbum(albumId);
      if (success && data) {
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
    const { success, data } = await getUser(currentLocalUser);
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
    console.log(circleId);
    console.log(event.target.closest("#leftButton"));
    const { success, data } = await getCircle(circleId);
    const backSpan = document.querySelector(".backSpan");
    backSpan.removeAttribute("circleId");
    if (success && data) {
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
    const circleId = document.querySelector("#circleEditButton span").getAttribute("circleid")
    await displayCircleEditMode(circleId)
  }

  if (circleShareButton) {
    console.log("SHARE CIRCLE")
  }

  if (updateCircleButton) {
    const privacyCheckbox = document.querySelector("#privacyCheckbox")
    const circleImage = document.querySelector("#circleImage img")
    const circleNameInput = document.querySelector("#circleNameInput")
    const circleId = document.querySelector("#rightButton img").getAttribute("circleid")

    if (!circleNameInput.value) {
      return displayPopup("Missing circle name")
    }

    const circleObj = {
      circleId,
      circleImg: circleImage.src,
      circleName: circleNameInput.value,
      isPublic: privacyCheckbox.checked
    }
    const {success, data, error } = await updateCircle(circleObj)
    let circleIdFromUpdate = data
    if (success && data) {
      const { success, data, error } = await getCircle(circleIdFromUpdate);
      if (success && data) {
        await displayCircle(data);
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
    console.log("local auth user is", data);
    currentLocalUser = data;
    await displayExplore();
  }
}


pageContent.addEventListener("click", async (event) => {
  const localAuthButton = event.target.closest("#localAuth");
  const emailNextButton = event.target.closest("#emailNext");
  const passwordNextButton = event.target.closest("#passwordNext");
  const birthdayNextButton = event.target.closest("#birthdayNext");
  const nameNextButton = event.target.closest("#nameNext");
  const usernameNextButton = event.target.closest("#usernameNext");
  const profilePictureNextButton = event.target.closest("#profilePictureNext");
  const logOut = event.target.closest("#logOut");

  if (localAuthButton) {
    handleLocalAuth();
  }

  if (emailNextButton) {
    const emailInput = document.querySelector("#emailInput");
    const confirmEmailInput = document.querySelector("#confirmEmailInput");
    const validEmailInput = await isEmailValid(emailInput.value);
    const validConfirmEmailInput = await isEmailValid(confirmEmailInput.value);
    if (!validEmailInput.success || !validConfirmEmailInput.success) {
      alert(validEmailInput.error);
      return;
    }
    signUpData.email = emailInput.value;
    signUpData.confirmEmail = confirmEmailInput.value;
    if (signUpData.email === signUpData.confirmEmail) {
      await displaySignUpPasswordPage();
    }
  }

  if (passwordNextButton) {
    const passwordInput = document.querySelector("#passwordInput");
    let confirmPasswordInput = document.querySelector("#confirmPasswordInput");
    const validPassword = isPasswordValid(passwordInput.value);
    const validConfirmPassword = isPasswordValid(confirmPasswordInput.value);
    if (!validPassword.success || !validConfirmPassword.success) {
      alert(validPassword.error);
      return;
    }
    signUpData.password = passwordInput.value;
    signUpData.confirmPassword = confirmPasswordInput.value;
    if (signUpData.password === signUpData.confirmPassword) {
      await displaySignUpBirthdayPage();
    }
  }

  if (birthdayNextButton) {
    const birthdayInput = document.querySelector("#birthdayInput");
    console.log(birthdayInput.value);
    await displaySignUpNamePage();
  }

  if (nameNextButton) {
    await displaySignUpUsernamePage();
  }

  if (usernameNextButton) {
    await displaySignUpProfilePicturePage();
  }

  if (profilePictureNextButton) {
    await displayProfileConfirmation();
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
    console.log("album name:", albumName);
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
  console.log(fileInput);
  await fileInput.click();
}

sectionDrag = async (event) => {
  event.preventDefault();
  console.log("File(s) in drop zone");
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
  console.log("Files uploaded:", albumPhotos);
  console.log(files.length);
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
        console.log("clicked", circleDiv.id);
        //MODIFY THIS TO SELECT CIRCLE TO BE USED FOR POST CONFIRMATION & POST

        albumObj.isCircle = true;
        albumObj.id = circleDiv.id;

        console.log("Selected circle object:", albumObj);

        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
          console.log(data);
          albumObj.circleSrc = data.circle.picture;
          albumObj.circleName = data.circle.name;
          console.log(albumObj);
        }
        await displayAlbumConfirmation();
      }
    }
  });
  document.querySelector("#createNewCircle").addEventListener("click", async function (event) {
    console.log("MAKE A NEW CIRCLE PROCESS");
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
  //pageName.classList.add("text-light-mode-accent")
  
  const backSpan = document.querySelector("span.backSpan")
  if (backSpan) {
    if (backSpan.getAttribute("username")) {
      backSpan.removeAttribute("username")
    }
    backSpan.setAttribute("circleId", circleId)
    backSpan.childNodes[0].id = "albumToCircleButton"
  } else {
    leftHeaderButton.innerHTML = `<span class="backSpan" circleid="${circleId}"><img src="/lightmode/back_button.svg" alt="Back Button" id="albumToCircleButton" class=""></span>`
  }
  rightHeaderButton.innerHTML = `<img src="/lightmode/save_button.svg" alt="Save Button" id="updateCircle" circleId="${circleId}">`;

  const privacyCheckboxDiv = document.querySelector(".privacyCheckboxDiv")
  privacyCheckboxDiv.classList.remove("hidden")

  const privacyCheckbox = document.querySelector("#privacyCheckbox")
  privacyCheckbox.addEventListener("change", async function () {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    privacyIcon.src = "/lightmode/lock_icon.svg";
    privacyLabel.innerHTML = "Private";
    await updateCheckbox();
  });

  const circleImage = document.querySelector("#circleImage img")
  const hiddenImageInput = document.createElement("input")
  hiddenImageInput.id = "fileUpload"
  hiddenImageInput.type ="file"
  hiddenImageInput.multiple = "false"
  hiddenImageInput.className = "hidden"
  circleImage.parentNode.append(hiddenImageInput)
  circleImage.addEventListener("click", async function (event) {
    event.preventDefault();
    await hiddenImageInput.click();
  });
  hiddenImageInput.addEventListener("input", async function (event) {
    event.preventDefault();
    const res = await handleSelectFile();
    if (res) {
      circleImage.src = await res.data;
    }
  });


  const circleName = document.querySelector("#circleName p")
  const circleNameInput = document.createElement("input")
  circleNameInput.id = "circleNameInput"
  circleNameInput.type = "text"
  circleNameInput.placeholder = "Add a circle name"
  circleNameInput.value = circleName.textContent
  circleNameInput.className = "w-234 text-center bg-transparent text-h2 text-text-grey font-light items-end border-none"
  circleName.remove();
  document.querySelector("#circleName").append(circleNameInput)

  const inviteMore = document.createElement("img")
  inviteMore.src = "/invite_more_friends.svg"
  inviteMore.id = "inviteMoreUsers"
  inviteMore.className = "w-42 h-42 rounded-full object-cover"
  document.querySelector(".memberList").append(inviteMore)

}