async function displayCreateCircle() {
    nav.classList.add("hidden");
    pageName.textContent = `New Circle`;
  
    const fromCreateAlbum = rightButtonSpan.getAttribute("fromCreateAlbum");
    if (fromCreateAlbum === "true") {
      leftHeaderButton.innerHTML = `<img id="albumConfirmationBackButton" src="/lightmode/back_button.svg" alt="Back Button"/>`;
    } else {
      leftHeaderButton.innerHTML = `<img id="backButton" src="/lightmode/back_button.svg" alt="Back Button"/>`;
    }
  
    rightHeaderButton.innerHTML = `<img id="nextInviteFriends" src="/lightmode/next_button.svg" alt="Next Button"/>`;
  
    const pageContent = document.querySelector("#pageContent");
    pageContent.innerHTML = `
      <div id="createNewCircle" class="flex flex-col justify-center items-center p-4 bg-light-mode rounded-lg w-full overflow-hidden">
          <div class="shrink-0 mt-14 mb-6 justify-center">
              <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer"/>                     
          </div>
      
          <div class="flex-1 flex flex-col justify-between w-full px-4">
            <div>
              <form class="flex flex-col" onkeydown="return event.key != 'Enter';">
                <div class="flex items-center mt-4 mb-28">
                    <label for="circleName" class="font-medium text-h2 mr-6">Name</label>
                    <input
                    type="text"
                    placeholder="add a title to your circle..."
                    id="circleName"
                    class="w-full bg-transparent text-h2 text-text-grey font-light items-end border-none"
                    required
                    />
                </div>
              </form>
            </div>
            <div class="flex flex-col">
            <div id="divider" class="my-4">
                <img src="/lightmode/divider.svg" alt="Divider"/>                          
            </div>
              <input id="fileUpload" type="file" class="hidden" multiple=false />
              <div class="flex items-center justify-between mt-2 mb-2">
                <div>
                  <p class="font-medium text-h2 leading-h2">Private or Public</p>
                  <p class="text-14 leading-body">Make new circle private or public</p>
                </div>
                <div>
                  <label class="inline-flex items-center cursor-pointer">
                    <input id="privacyCheckbox" type="checkbox" value="" class="sr-only peer">
                    <img id="privacyIcon" src="/lightmode/lock_icon.svg" alt="Lock icon" class="mr-4"/>
                    <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
                    <div class="peer relative h-5 w-10 rounded-full outline outline-1 outline-black after:absolute after:start-[2px] after:top-0 after:h-4 after:w-4 after:rounded-full after:bg-black after:border after:border-black after:transition-all after:content-[''] peer-checked:bg-cover peer-checked:bg-black border-2 peer-checked:outline-black peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:border-opacity-80 peer-checked:after:border-2 peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        <button id="addPicture" class="w-380 h-45 bg-light-mode-accent text-white rounded-input-box fixed bottom-8">Add Picture</button>
      </div>`;
  
    const circleNameInput = document.querySelector("#circleName");
    circleNameInput.value = newCircleNameInput;
    const addPictureButton = document.querySelector("#addPicture");
    const fileInput = document.querySelector("#fileUpload");
    const circlePhoto = document.querySelector("#circleImage");
  
    circlePhoto.addEventListener("click", async function (event) {
      event.preventDefault();
      await fileInput.click();
    });
  
    addPictureButton.addEventListener("click", async function (event) {
      event.preventDefault();
      await fileInput.click();
    });
  
    fileInput.addEventListener("input", async function (event) {
      event.preventDefault();
      const res = await handleSelectFile();
      if (res) {
        circlePhoto.src = await res.data.url;
      }
  
      addPictureButton.textContent = "Change Picture";
      addPictureButton.className =
        "w-380 h-45 bg-white border-2 border-dark-grey text-dark-grey rounded-input-box fixed bottom-8";
    });
  
    privacyCheckbox.addEventListener("change", async function () {
      const privacyIcon = document.querySelector("#privacyIcon");
      const privacyLabel = document.querySelector("#privacyLabel");
      privacyIcon.src = "/lightmode/lock_icon.svg";
      privacyLabel.innerHTML = "Private";
      updateCheckbox();
    });
    return;
  }

async function displayCreateCirclePreview() {
    nav.classList.add("hidden");
    leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="circlePreviewBackButton"/>`;
    pageName.textContent = "New Circle";
    const fromCreateAlbum = rightButtonSpan.getAttribute("fromCreateAlbum");
    const next = document.querySelector("#nextButton");
    next.src = "/lightmode/create_button.svg";
    if (fromCreateAlbum === "true") {
      next.id = "createCircleToAlbum";
    } else {
      next.id = "createCircleButton";
    }
  
  
    pageContent.innerHTML = `
      <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
            <div class="flex-shrink-0 mt-14 mb-4">
                <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer"/>                     
            </div>
            <div class="flex justify-center my-5 relative w-full gap-2">
                <input
                    type="text"
                    placeholder="add a name to your circle"
                    id="circleName"
                    class="bg-transparent text-24 font-bold border-none text-center flex-1 px-0"
                />
                <button id="editButton" class="pl-1">
                    <img src="/lightmode/edit_icon.svg" alt="Edit Icon"/>
                </button>
            </div>
            <div id="divider" class="mb-2">
                <img src="/lightmode/divider.svg" alt="Divider"/>                          
            </div>
            <input id="fileUpload" type="file" class="hidden" multiple=false/>
            <div class="flex items-center justify-between w-full">
                <div>
                    <p class="font-medium text-h2 leading-h2">Private or Public</p>
                    <p class="text-body leading-tertiary text-dark-grey">Make new circle private or public</p>
                </div>
                <div>
                    <label class="inline-flex items-center cursor-pointer">
                    <input id="privacyCheckbox" type="checkbox" value="" class="sr-only peer">
                    <img id="privacyIcon" src="/lightmode/lock_icon.svg" alt="Lock icon" class="mr-4">
                    <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
                    <div class="peer relative h-5 w-10 rounded-full outline outline-1 outline-black after:absolute after:start-[2px] after:top-0 after:h-4 after:w-4 after:rounded-full after:border after:border-black after:bg-black after:transition-all after:content-[''] peer-checked:bg-cover peer-checked:bg-black border-2 peer-checked:outline-black peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:border-opacity-80 peer-checked:after:border-2 peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
                    </label>
                </div>
            </div>
            <div class="flex items-center justify-between w-full hidden">
              <div class="mt-10">
                <p class="font-bold text-26 leading-h2">added friends</p>
              </div>
            </div>
            <div class="flex items-center justify-between w-full hidden">
              <div class="mt-10">
                <p class="text-body leading-tertiary">Most Recent Activity with:</p>
              </div>
            </div>
            </form>
          </div>
      </div>`;
  
    const editButton = document.querySelector("#editButton");
    const circleNameInput = document.querySelector("#circleName");
  
    editButton.addEventListener("click", () => {
      circleNameInput.focus();
    });
  
    const fileInput = document.querySelector("#fileUpload");
    const circlePhoto = document.querySelector("#circleImage");
    document
      .querySelector("#circleImage")
      .addEventListener("click", async function (event) {
        event.preventDefault();
        await fileInput.click();
      });
  
    fileInput.addEventListener("input", async function (event) {
      event.preventDefault();
      const res = await handleSelectFile();
      if (res) {
        circlePhoto.src = await res.data.url;
      }
    });
  
    privacyCheckbox.addEventListener("change", async function () {
      const privacyIcon = document.querySelector("#privacyIcon");
      const privacyLabel = document.querySelector("#privacyLabel");
      privacyIcon.src = "/lightmode/lock_icon.svg";
      privacyLabel.innerHTML = "Private";
      await updateCheckbox();
    });
  
    circleNameInput.value = newCircleNameInput;
}

async function displayListOfCircles(data) {
  let circleListArr = data.UserCircle.map((obj) => {
    let circleName = document.createElement("p");
    circleName.className = "text-center text-secondary";
    circleName.textContent = obj.circle.name;
    return `
      <div id="${obj.circle.id}" class="circle">
        <div class="flex justify-center">
          <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover cursor-pointer border-circle border-black"/>
        </div>
        ${circleName.outerHTML}
      </div>`;
  });
  return circleListArr;
}

async function displayListOfCirclesHorizontally(data) {
  let circleListArr = data.UserCircle.map((obj) => {
    let circleName = document.createElement("p");
    circleName.className = "text-center text-secondary break-words text-wrap";
    circleName.textContent = obj.circle.name;
    return `
      <div id="${obj.circle.id}" class="circle w-85 h-104">
        <div class="flex justify-center w-85 h-85 mb-1">
          <img src="${obj.circle.picture}" class="rounded-full w-85 h-85 object-cover cursor-pointer border-circle border-light-mode-accent"/>
        </div>
        ${circleName.outerHTML}
      </div>`;
  });
  return circleListArr;
}

async function displayCircle(circleData) {
  const imgElement = document.querySelector("#profileBackButton");
  if (imgElement) {
    imgElement.classList.remove("hidden");
    imgElement.id = "circleToProfileButton";
  }
  
  const backSpan = document.querySelector(".backSpan");
  if (backSpan) {
    const circleId = backSpan.getAttribute("circleId");
    const imgElement = document.querySelector("#albumToCircleButton");
    if (circleId === null) {
      if (backSpan.getAttribute("username") === null) {
        leftHeaderButton.innerHTML = "";
      } else if (imgElement) {
        imgElement.id = "circleToProfileButton";
      }
    }
  } else {
    const circleId = circleData.circle.id;
    const backSpan = document.createElement("span");
    backSpan.className = "backSpan";
    const imgElement = document.createElement("img");
    imgElement.id = "albumToCircleButton";
    imgElement.src = "/lightmode/back_button.svg";
    imgElement.alt = "Back Button";
    
    backSpan.setAttribute("circleId", circleId);
    backSpan.appendChild(imgElement);
    leftHeaderButton.appendChild(backSpan);
  }

  const circlePreviewBackButton = document.querySelector(
    "#circlePreviewBackButton"
  );
  const newAlbumToCircleButton = document.querySelector(
    "#newAlbumToCircleButton"
  );
  if (circlePreviewBackButton || newAlbumToCircleButton) {
    leftHeaderButton.innerHTML = "";
  }
  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2 w-full h-22">
    <div class="flex gap-2">
      <button id="circleEditButton" class="${circleData.circle.ownerId === currentLocalUser ? "" : "hidden"}">
        <img src="/lightmode/edit_icon.svg"></img>
        <span circleid=${circleData.circle.id}></span>
      </button>
      <button id="circleShareButton">
        <svg width="22" height="22" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.52237 14.4666C9.62361 14.5669 9.70395 14.6862 9.75876 14.8174C9.81357 14.9487 9.84179 15.0895 9.84179 15.2316C9.84179 15.3737 9.81357 15.5145 9.75876 15.6458C9.70395 15.777 9.62361 15.8963 9.52237 15.9966L9.059 16.4574C8.56713 16.9483 7.98226 17.3375 7.33823 17.6022C6.69419 17.867 6.00375 18.0022 5.30685 18C4.25734 18.0003 3.23132 17.6911 2.35858 17.1114C1.48584 16.5317 0.805602 15.7076 0.403928 14.7434C0.00225372 13.7792 -0.102809 12.7181 0.102032 11.6945C0.306874 10.6709 0.812414 9.73068 1.55469 8.99285L4.69959 5.86537C5.36851 5.20026 6.20404 4.72503 7.11968 4.48888C8.03532 4.25274 8.99778 4.26427 9.90744 4.52227C10.8171 4.78027 11.6409 5.27537 12.2935 5.95632C12.9461 6.63726 13.4039 7.4793 13.6193 8.39525C13.655 8.53452 13.6624 8.67947 13.641 8.82161C13.6197 8.96375 13.57 9.10022 13.4949 9.22302C13.4198 9.34582 13.3209 9.45248 13.2038 9.53676C13.0867 9.62104 12.9539 9.68123 12.8132 9.71381C12.6724 9.74639 12.5265 9.75071 12.3841 9.72651C12.2416 9.70231 12.1055 9.65008 11.9836 9.57287C11.8617 9.49567 11.7565 9.39505 11.6742 9.27691C11.5919 9.15876 11.5342 9.02547 11.5043 8.88485C11.3765 8.34416 11.1057 7.84725 10.72 7.44547C10.3344 7.0437 9.84782 6.75166 9.31065 6.59953C8.77347 6.4474 8.20519 6.4407 7.66454 6.58014C7.12389 6.71958 6.63051 7.00008 6.23539 7.39266L3.09049 10.5201C2.65211 10.9557 2.35348 11.5108 2.23235 12.1152C2.11122 12.7196 2.17304 13.3461 2.40999 13.9156C2.64694 14.485 3.04838 14.9718 3.56354 15.3143C4.0787 15.6569 4.68443 15.8398 5.30413 15.84C5.71589 15.8411 6.12379 15.7611 6.50422 15.6044C6.88466 15.4478 7.23008 15.2177 7.52049 14.9274L7.98295 14.4666C8.08386 14.3658 8.20381 14.2858 8.3359 14.2312C8.46799 14.1766 8.60962 14.1485 8.75266 14.1485C8.8957 14.1485 9.03734 14.1766 9.16943 14.2312C9.30151 14.2858 9.42146 14.3658 9.52237 14.4666ZM19.4458 1.54541C18.4504 0.555883 17.1006 0 15.6932 0C14.2857 0 12.9359 0.555883 11.9405 1.54541L11.4781 2.00531C11.2741 2.2082 11.1595 2.48337 11.1595 2.7703C11.1595 3.05723 11.2741 3.3324 11.4781 3.53529C11.6821 3.73818 11.9588 3.85216 12.2473 3.85216C12.5359 3.85216 12.8126 3.73818 13.0166 3.53529L13.48 3.0745C14.068 2.4897 14.8656 2.16116 15.6972 2.16116C16.5289 2.16116 17.3264 2.4897 17.9145 3.0745C18.5025 3.6593 18.8329 4.45245 18.8329 5.27948C18.8329 6.10651 18.5025 6.89966 17.9145 7.48446L14.7642 10.6074C14.4738 10.8978 14.1284 11.128 13.7479 11.2846C13.3675 11.4413 12.9596 11.5213 12.5478 11.52C11.8414 11.5195 11.156 11.2817 10.6025 10.8452C10.0491 10.4087 9.66018 9.79912 9.49884 9.11525C9.43355 8.83622 9.25948 8.5944 9.01491 8.44301C8.77034 8.29161 8.47531 8.24303 8.19473 8.30795C7.91414 8.37288 7.67098 8.54599 7.51874 8.7892C7.3665 9.03242 7.31765 9.32581 7.38293 9.60484C7.65544 10.763 8.31338 11.7957 9.25005 12.5354C10.1867 13.2751 11.3472 13.6784 12.5433 13.68H12.5478C13.245 13.6819 13.9357 13.5463 14.5799 13.2811C15.2241 13.0158 15.809 12.6262 16.3009 12.1347L19.4458 9.00725C19.9385 8.51733 20.3294 7.93569 20.5961 7.29553C20.8627 6.65538 21 5.96925 21 5.27633C21 4.58341 20.8627 3.89728 20.5961 3.25713C20.3294 2.61697 19.9385 2.03532 19.4458 1.54541Z" fill="black"/>
        </svg>
      </button>
    </div>
  </div>`;
  pageName.textContent = "";
  let currentUserProfilePicture = null;
  let currentUserUsername = null;
  const memberList = circleData.members.map((obj) => {
    if (obj.user.username === currentLocalUser) {
      currentUserProfilePicture = obj.user.profilePicture;
      currentUserUsername = obj.user.username;
    }
    return `<img src="${obj.user.profilePicture}" class="w-42 h-42 rounded-full object-cover"/>`;
  });

  const albumList = circleData.circle.albums.map((obj) => {
    let albumName = document.createElement("p");
    albumName.className = "text-white text-shadow shadow-black";
    albumName.textContent = obj.name;
    const userLiked = obj.likes.some(like => like.userId === currentLocalUser);
    const likedClass = userLiked ? "liked" : "";
    const heartColor = userLiked ? "#FF4646" : "none";
    const heartColorStroke = userLiked ? "#FF4646" : "white";
    // CHANGE ME : placeholder image 
    console.log(obj.photos[0])
    return `
      <div class="w-full h-min relative album" id="${obj.id}">
        <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0]? obj.photos[0].src : "/placeholder_image.svg"}"/>
        <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
          ${albumName.outerHTML}
        </div>
        <div class="absolute inset-0 flex items-end justify-end gap-1 p-2">
          <div class="like cursor-pointer ${likedClass}">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="${heartColor}" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.22318 16.2905L9.22174 16.2892C6.62708 13.9364 4.55406 12.0515 3.11801 10.2946C1.69296 8.55118 1 7.05624 1 5.5C1 2.96348 2.97109 1 5.5 1C6.9377 1 8.33413 1.67446 9.24117 2.73128L10 3.61543L10.7588 2.73128C11.6659 1.67446 13.0623 1 14.5 1C17.0289 1 19 2.96348 19 5.5C19 7.05624 18.307 8.55118 16.882 10.2946C15.4459 12.0515 13.3729 13.9364 10.7783 16.2892L10.7768 16.2905L10 16.9977L9.22318 16.2905Z" stroke="${heartColorStroke}" stroke-width="2"/>
            </svg>
          </div>
          <div class="comment cursor-pointer">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 19.125C8.79414 19.125 7.12658 18.6192 5.70821 17.6714C4.28983 16.7237 3.18434 15.3767 2.53154 13.8006C1.87873 12.2246 1.70793 10.4904 2.04073 8.81735C2.37352 7.14426 3.19498 5.60744 4.4012 4.40121C5.60743 3.19498 7.14426 2.37353 8.81735 2.04073C10.4904 1.70793 12.2246 1.87874 13.8006 2.53154C15.3767 3.18435 16.7237 4.28984 17.6714 5.70821C18.6192 7.12658 19.125 8.79414 19.125 10.5C19.125 11.926 18.78 13.2705 18.1667 14.455L19.125 19.125L14.455 18.1667C13.2705 18.78 11.925 19.125 10.5 19.125Z" stroke="#F8F4EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>`;
  });

  let circleName = document.createElement("p");
  circleName.className = "text-center text-20 font-bold break-words text-wrap max-w-[234px]";
  circleName.textContent = circleData.circle.name;
  pageContent.innerHTML = `
    <div id="circlePage" class="w-full px-0 mx-0">
      <div id="circleImage" class="relative flex justify-center mt-6 mb-1.5">
        <img src="${circleData.circle.picture}" class="rounded-full w-180 h-180 object-cover"/>
      </div>
      <div id="circleName" class="relative my-3 flex justify-center items-center max-w-full h-11">
        ${circleName.outerHTML}
      </div>
      <div class="grid grid-cols-1 place-items-center justify-center h-8">
        <span class="privacyState">
            <label class="inline-flex items-center cursor-pointer">
            <input id="privacyCheckbox" type="checkbox" value="" class="sr-only peer">
            <img id="privacyIcon" src="${circleData.circle.isPublic ? "/lightmode/globe_icon.svg" : "/lightmode/lock_icon.svg"}" alt="Lock icon" class="mr-4">
            <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">
              ${circleData.circle.isPublic ? "Public" : "Private"}
            </span>
            <div class="hidden privacyCheckboxDiv peer relative h-5 w-10 rounded-full outline outline-1 outline-black after:absolute after:start-[2px] after:top-0 after:h-4 after:w-4 after:rounded-full after:bg-black after:border after:border-black after:transition-all after:content-[''] peer-checked:bg-cover peer-checked:bg-black border-2 peer-checked:outline-black peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:border-opacity-80 peer-checked:after:border-2 peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
        </span>
        </label>
      </div>
      <div class="grid grid-cols-5 place-items-center mt-12 mb-2">
        <p class="grid-span-1 text-base font-medium">${
          circleData.members.length
        } Friends</p>
      </div>
      <div class="flex gap-2 memberList">
        ${memberList.join("")}
      </div>
      <div id="albumList" class="pb-48 w-full">
        <div class="mt-6 mb-2">
          <p class="text-24 font-medium">Albums</p>
        </div>
        <div class="columns-2 gap-4 space-y-4 grid-flow-row">
          ${albumList.join("")}
        </div>
      </div>
    </div>`;
  const privacyCheckbox = document.querySelector("#privacyCheckbox")
  circleData.circle.isPublic ? privacyCheckbox.setAttribute("checked", true) : privacyCheckbox.removeAttribute("checked")
  const albumListTarget = document.querySelector("#albumList");
  albumListTarget.addEventListener("click", async function (event) {
    event.preventDefault();
    const albumDiv = event.target.closest(".album");
    const like = event.target.closest(".like");
    const comment = event.target.closest(".comment");

    if (like) {
      const albumId = event.target.closest("div.album").getAttribute("id");
      if (like.classList.contains("liked")) {
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#FFFFFF");
        await likeAlbum(albumId);
      } else {
        like.classList.add("liked");
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
        await likeAlbum(albumId);
      }
      return;
    }

    if (comment) {
      await displayComments(
        albumDiv.id,
        currentUserProfilePicture,
        currentLocalUser
      );
      return;
    }

    if (albumDiv) {
      if (albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id);
        if (success && data) {
          await displayAlbum(data);
        }
      }
    }
  });

  if (circleData.circle.ownerId === currentLocalUser) {
    const inviteMore = document.createElement("img");
    inviteMore.src = "/invite_more_friends.svg";
    inviteMore.id = "inviteMoreUsers";
    inviteMore.className = "w-42 h-42 rounded-full object-cover";
    const memberList = document.querySelector(".memberList")
    memberList.append(inviteMore);

    memberList.addEventListener("click", async function (event) {
      const portrait = event.target.closest("img")
      if (portrait) {
        if (portrait.id === "inviteMoreUsers") {
          await displayInviteFriends(true, circleData.circle.id)
        }
      }
    })
  }
}
  
async function displayCircleInvites() {
  pageName.textContent = "Circle Invites";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="toActivity">`;
  const { circleInvites } = await getActivities(currentLocalUser);
  let circleInviteList = circleInvites
    .map((invite) => {
      let circleName = document.createElement("h2");
      circleName.className = "font-medium text-14 leading-tertiary";
      circleName.textContent = invite.circle.name;
      return `
    <div class="flex items-center my-3">
      <div class="flex-none w-58">
        <img class="rounded-input-box w-58 h-58 object-cover" src="${invite.circle.picture}" alt="${invite.circle.name}'s picture">
      </div>
      <div class="ml-8 flex-none w-110">
        ${circleName.outerHTML}
      </div>
      <div class="ml-auto w-166">
        <form class="flex text-white gap-2">
          <button identifier="${invite.circle.id}" sentTo="${invite.invitee_username}" name="acceptCircleInvite" class="w-request h-request rounded-input-box bg-light-mode-accent">accept</button>
          <button identifier="${invite.circle.id}" sentTo="${invite.invitee_username}" name="declineCircleInvite" class="w-request h-request rounded-input-box bg-dark-grey">decline</button>
        </form>
      </div>
    </div>`;
    })
    .join("");

  pageContent.innerHTML = `<div id="circleInviteList" class="flex flex-col pb-200">${circleInviteList}</div>`;
  const circleInviteListPage = document.querySelector("#circleInviteList");
  circleInviteListPage.addEventListener("click", async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute("identifier");
    const invitee = event.target.getAttribute("sentTo");
    switch (event.target.name) {
      case "acceptCircleInvite":
        await acceptCircleInvite(id, invitee);
        await displayCircleInvites();
        break;
      case "declineCircleInvite":
        await declineCircleInvite(id, invitee);
        await displayCircleInvites();
        break;
      default:
        break;
    }
  });
}