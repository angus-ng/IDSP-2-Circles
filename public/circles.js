async function displayCreateCircle() {
  const origin = leftHeaderButton.getAttribute("origin");
    nav.classList.add("hidden");
    pageName.textContent = `New Circle`;

    leftHeaderButton.classList.remove("hidden");
    leftHeaderButton.innerHTML = backIcon;
    console.log(origin)
    if (origin === "fromCreateAlbum") {
      leftHeaderButton.id = "albumConfirmationBack";
    } else {
      leftHeaderButton.id = "backToExplore";
    }

    rightHeaderButton.textContent = "Next";
    rightHeaderButton.className = "text-lg";
    rightHeaderButton.id = "nextInviteFriends";
  
    const pageContent = document.querySelector(".pageContent");
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
    const origin = leftHeaderButton.getAttribute("origin");
    nav.classList.add("hidden");
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "circlePreviewBack";
    pageName.textContent = "New Circle";

    if (origin === "fromCreateAlbum") {
      rightHeaderButton.id = "createCircleToAlbum";
    } else {
      rightHeaderButton.id = "createCircle";
    }
  
    rightHeaderButton.textContent = "Create";
  
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
                    ${editIcon}
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
    document.querySelector("#circleImage").addEventListener("click", async function (event) {
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

  const origin = leftHeaderButton.getAttribute("origin");
  const circleId = circleData.circle.id;
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.setAttribute("circleId", circleId);
  leftHeaderButton.classList.remove("hidden");

  if (origin === "fromSearchProfile") {
    leftHeaderButton.id = "backToSearchProfile"
  }

  if (origin === "fromProfile") {
    leftHeaderButton.id = "backToProfile";
  }

  if (origin === "fromExplore") {
    leftHeaderButton.id = "backToExplore";
  }

  if(origin === "fromAlbumCreation") {
    leftHeaderButton.id = "backToProfile"
    leftHeaderButton.setAttribute("username", currentLocalUser)
  }
  const currentUserMembership = circleData.members.find((member) => member.user.username === currentLocalUser)
  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2 w-full h-22">
    <div class="flex gap-2">
      <button id="circleEditButton" class="${circleData.circle.ownerId === currentLocalUser || (currentUserMembership ? currentUserMembership.mod : false) ? "" : "hidden"}" ownerId="${circleData.circle.ownerId}">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 5.76359C22.0008 5.61883 21.9731 5.47533 21.9183 5.34132C21.8636 5.20731 21.7829 5.08542 21.681 4.98265L17.017 0.318995C16.9142 0.217053 16.7923 0.136401 16.6583 0.0816639C16.5243 0.026927 16.3808 -0.000818536 16.236 1.83843e-05C16.0912 -0.000818536 15.9477 0.026927 15.8137 0.0816639C15.6797 0.136401 15.5578 0.217053 15.455 0.318995L12.342 3.43176L0.319018 15.4539C0.217068 15.5566 0.136411 15.6785 0.0816699 15.8125C0.0269289 15.9466 -0.000818595 16.09 1.83857e-05 16.2348V20.8985C1.83857e-05 21.1902 0.115911 21.4699 0.3222 21.6762C0.52849 21.8825 0.808279 21.9984 1.10002 21.9984H5.76401C5.91793 22.0067 6.07189 21.9827 6.21591 21.9277C6.35993 21.8728 6.49079 21.7882 6.60001 21.6794L18.557 9.6573L21.681 6.59953C21.7814 6.49292 21.8632 6.37023 21.923 6.23655C21.9336 6.14888 21.9336 6.06025 21.923 5.97257C21.9281 5.92137 21.9281 5.86978 21.923 5.81858L22 5.76359ZM5.31301 19.7985H2.20001V16.6858L13.123 5.76359L16.236 8.87636L5.31301 19.7985ZM17.787 7.32547L14.674 4.2127L16.236 2.66182L19.338 5.76359L17.787 7.32547Z" fill="#0E0E0E"/>
        </svg>
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
  const memberList = [];
  for (i = 0; i < circleData.members.length; i++) {
    if (i > 3){
      const count = circleData.members.length - 4;
      const andMore = `
      <div class="w-42 h-42 rounded-full border-0 border-secondary border-solid flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      memberList.push(andMore);
      break;
    }
    if (circleData.members[i].user.username === currentLocalUser) {
      currentUserProfilePicture = circleData.members[i].user.profilePicture;
    }
    memberList.push(`<img src="${circleData.members[i].user.profilePicture}" class="w-42 h-42 rounded-full object-cover"/>`);
  }

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
      <div class="w-full h-min relative album" id="${obj.id}" circleid="${obj.circleId}">
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
      <div class="memberCount grid grid-cols-2 justify-between place-items-center mt-12 mb-2 mr-0">
        <button class="viewMoreMembers col-span-1 text-base font-medium justify-self-start hover:underline">${circleData.members.length} Friends</button>
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

  const privacyCheckbox = document.querySelector("#privacyCheckbox");
  circleData.circle.isPublic ? privacyCheckbox.setAttribute("checked", true) : privacyCheckbox.removeAttribute("checked");

  const viewMoreMembers = document.querySelector(".viewMoreMembers");
  viewMoreMembers.addEventListener("click", async() => {
    await displayCircleMembers(circleData.circle.id);
  });

  const albumListTarget = document.querySelector("#albumList");
  albumListTarget.addEventListener("click", async function (event) {
    pageName.classList.remove("text-light-mode-accent");
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
      await displayComments(albumDiv.id, currentUserProfilePicture, albumDiv.getAttribute("circleid"));
      return;
    }

    if (albumDiv) {
      if (albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id);
        if (success && data) {
          if (origin === "fromExplore") {
            leftHeaderButton.setAttribute("origin", "fromExploreCircle");
          } else if (origin === "fromSearchProfile") {
            leftHeaderButton.setAttribute("origin", "fromSearchProfileCircle");
          } else {
            leftHeaderButton.setAttribute("origin", "fromCircleProfile");
          }
          leftHeaderButton.setAttribute("albumId", data.id)
          await displayAlbum(data);
        }
      }
    }
  });

  if (currentUserMembership) {
    const inviteMore = document.createElement("button");
    inviteMore.innerHTML = `
    <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M2,21h8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM23,16a1,1,0,0,1-1,1H19v3a1,1,0,0,1-2,0V17H14a1,1,0,0,1,0-2h3V12a1,1,0,0,1,2,0v3h3A1,1,0,0,1,23,16Z">
        </path>
      </g>
    </svg>`;
    inviteMore.id = "inviteMoreUsers";
    inviteMore.className = "col-span-1 justify-self-end w-6 h-6";
    const memberList = document.querySelector(".memberCount");
    memberList.append(inviteMore);

    document.querySelector("#inviteMoreUsers").addEventListener("click", async function (event) {
      const portrait = event.target.closest("button");
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
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "toActivity";
  const { circleInvites } = await getActivities(currentLocalUser);
  let circleInviteList = circleInvites.map((invite) => {
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
    }).join("");

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

async function displayCircleMembers(circleId) {
  pageName.classList.remove("text-light-mode-accent");
  const { success, data: circleData } = await getCircle(circleId);
  
  leftHeaderButton.id = "backToCircle";
  leftHeaderButton.setAttribute("circleId", circleData.circle.id);
  rightHeaderButton.innerHTML = "";
  pageName.textContent = `${circleData.circle.name} Members`;

  const removeMemberIcon = `
  <div class="flex-none w-[30px] z-50">
    <div class="removeMemberIcon">
      <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.5 10.5C17.5 7.7375 15.2625 5.5 12.5 5.5C9.7375 5.5 7.5 7.7375 7.5 10.5C7.5 13.2625 9.7375 15.5 12.5 15.5C15.2625 15.5 17.5 13.2625 17.5 10.5ZM2.5 23V24.25C2.5 24.9375 3.0625 25.5 3.75 25.5H21.25C21.9375 25.5 22.5 24.9375 22.5 24.25V23C22.5 19.675 15.8375 18 12.5 18C9.1625 18 2.5 19.675 2.5 23ZM22.5 13H27.5C28.1875 13 28.75 13.5625 28.75 14.25C28.75 14.9375 28.1875 15.5 27.5 15.5H22.5C21.8125 15.5 21.25 14.9375 21.25 14.25C21.25 13.5625 21.8125 13 22.5 13Z" fill="#0E0E0E"/>
      </svg>
    </div>
  </div>`;

  const ownerIcon = `
  <div class="flex-none w-[30px] z-50">
    <div class="ownerIcon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM12.9524 12.699L12.8541 12.5227C12.4741 11.841 12.2841 11.5002 12 11.5002C11.7159 11.5002 11.5259 11.841 11.1459 12.5227L11.0476 12.699C10.9397 12.8927 10.8857 12.9896 10.8015 13.0535C10.7173 13.1174 10.6125 13.1411 10.4028 13.1886L10.2119 13.2318C9.47396 13.3987 9.10501 13.4822 9.01723 13.7645C8.92945 14.0468 9.18097 14.3409 9.68403 14.9291L9.81418 15.0813C9.95713 15.2485 10.0286 15.3321 10.0608 15.4355C10.0929 15.5389 10.0821 15.6504 10.0605 15.8734L10.0408 16.0765C9.96476 16.8613 9.92674 17.2538 10.1565 17.4282C10.3864 17.6027 10.7318 17.4436 11.4227 17.1255L11.6014 17.0432C11.7978 16.9528 11.8959 16.9076 12 16.9076C12.1041 16.9076 12.2022 16.9528 12.3986 17.0432L12.5773 17.1255C13.2682 17.4436 13.6136 17.6027 13.8435 17.4282C14.0733 17.2538 14.0352 16.8613 13.9592 16.0765L13.9395 15.8734C13.9179 15.6504 13.9071 15.5389 13.9392 15.4355C13.9714 15.3321 14.0429 15.2485 14.1858 15.0813L14.316 14.9291C14.819 14.3409 15.0706 14.0468 14.9828 13.7645C14.895 13.4822 14.526 13.3987 13.7881 13.2318L13.5972 13.1886C13.3875 13.1411 13.2827 13.1174 13.1985 13.0535C13.1143 12.9896 13.0603 12.8927 12.9524 12.699Z" fill="#000000"></path> </g></svg>
    </div>
  </div>`;

  const modIcon = `
  <div class="flex-none w-[30px] z-50">
    <div class="modIcon">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5 9.00011L10 12.0001H14L12.5 15.0001M20 12.0001C20 16.4612 14.54 19.6939 12.6414 20.6831C12.4361 20.7901 12.3334 20.8436 12.191 20.8713C12.08 20.8929 11.92 20.8929 11.809 20.8713C11.6666 20.8436 11.5639 20.7901 11.3586 20.6831C9.45996 19.6939 4 16.4612 4 12.0001V8.21772C4 7.4182 4 7.01845 4.13076 6.67482C4.24627 6.37126 4.43398 6.10039 4.67766 5.88564C4.9535 5.64255 5.3278 5.50219 6.0764 5.22146L11.4382 3.21079C11.6461 3.13283 11.75 3.09385 11.857 3.07839C11.9518 3.06469 12.0482 3.06469 12.143 3.07839C12.25 3.09385 12.3539 3.13283 12.5618 3.21079L17.9236 5.22146C18.6722 5.50219 19.0465 5.64255 19.3223 5.88564C19.566 6.10039 19.7537 6.37126 19.8692 6.67482C20 7.01845 20 7.4182 20 8.21772V12.0001Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
    </div>
  </div>`;
  const currentUserMembership = circleData.members.find((member) => member.user.username === currentLocalUser)
  let membersList = circleData.members.map(member => {
    let displayName = document.createElement("h2");
    let username = document.createElement("h2");
    displayName.className = "displayName font-medium text-14 leading-tertiary";
    username.className = "username font-light text-14 text-dark-grey";
    username.setAttribute("username", member.user.username);
    displayName.textContent = member.user.displayName ? member.user.displayName : member.user.username
    username.textContent = `@${member.user.username}`;
    return `
      <div class="flex items-center my-5 user" id="${member.user.username}" mod="${member.mod}">
        <div class="flex-none w-58">
          <img class="rounded-full w-58 h-58 object-cover" src="${member.user.profilePicture}" alt="${member.user.username}'s profile picture"/>
        </div>
        <div class="">
        ${member.user.username === circleData.circle.ownerId ? ownerIcon : (member.mod ? modIcon : "")} 
        </div>
        <div class="ml-8 flex-none w-207">
          ${displayName.outerHTML}
          ${username.outerHTML}
        </div>
        ${(currentLocalUser === circleData.circle.ownerId || ((currentUserMembership && !member.mod) ? currentUserMembership.mod: false)) && member.user.username !== circleData.circle.ownerId ? 
          `<div class="ml-auto pr-2">
            ${removeMemberIcon}
            </div>`: ""}
        ${currentLocalUser === circleData.circle.ownerId && member.user.username !== circleData.circle.ownerId ?
          `<div class="ml-auto pr-2">
            ${modIcon}
          </div>` : ""}
      </div>`;
  }).join("");

  pageContent.innerHTML = `
    <div id="circleMembersPage" class="w-full px-0 mx-0">
      <div class="flex flex-col items-center my-5">
        ${membersList}
      </div>
    </div>`;

  const circleMembersPage = document.querySelector("#circleMembersPage");
  circleMembersPage.addEventListener("click", async(event) => {
    const removeMemberIcon = event.target.closest(".removeMemberIcon");
    const modIcon = event.target.closest(".modIcon");
    const user = event.target.closest(".user")
      if (user) {
        const member = user.getAttribute("id");
        const currentStatus = user.getAttribute("mod")

        if (removeMemberIcon) {
          await displayConfirmationPopup(`remove ${member}`, { member, circleId: circleData.circle.id });
        }

        if (modIcon) {
          if (currentStatus === "true"){ 
            await displayConfirmationPopup(`unmod ${member}`, { member, circleId: circleData.circle.id });
          } else {
            await displayConfirmationPopup(`mod ${member}`, { member, circleId: circleData.circle.id });
          }
        }

    }
  });
}
