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
  const currentUserMembership = circleData.members.find((member) => member.user.username === currentLocalUser)
  rightHeaderButton.innerHTML = `
  <div class="flex flex-row flex-nowrap gap-2 w-full h-22">
    <div class="flex gap-2">
      <button id="circleEditButton" class="${circleData.circle.ownerId === currentLocalUser || (currentUserMembership ? currentUserMembership.mod : false) ? "" : "hidden"}" ownerId="${circleData.circle.ownerId}">
        ${circleEditIcon}
        <span circleid=${circleData.circle.id}></span>
      </button>
      <button id="circleShareButton">
        ${shareIcon}
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
            ${commentIcon}
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
    <div class="removeMemberIcon">${removeUserIcon}</div>
  </div>`;

  const owner = `
    <div class="flex-none w-[30px] z-50">
      <div class="ownerIcon">${ownerIcon}</div>
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

    const modIconColor = (member.mod) ? "#0044CC" : "black";

    const modIcon = `
      <div class="flex-none w-[30px] z-50">
        <div class="modIcon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M11.5 9.00011L10 12.0001H14L12.5 15.0001M20 12.0001C20 16.4612 14.54 19.6939 12.6414 20.6831C12.4361 20.7901 12.3334 20.8436 12.191 20.8713C12.08 20.8929 11.92 20.8929 11.809 20.8713C11.6666 20.8436 11.5639 20.7901 11.3586 20.6831C9.45996 19.6939 4 16.4612 4 12.0001V8.21772C4 7.4182 4 7.01845 4.13076 6.67482C4.24627 6.37126 4.43398 6.10039 4.67766 5.88564C4.9535 5.64255 5.3278 5.50219 6.0764 5.22146L11.4382 3.21079C11.6461 3.13283 11.75 3.09385 11.857 3.07839C11.9518 3.06469 12.0482 3.06469 12.143 3.07839C12.25 3.09385 12.3539 3.13283 12.5618 3.21079L17.9236 5.22146C18.6722 5.50219 19.0465 5.64255 19.3223 5.88564C19.566 6.10039 19.7537 6.37126 19.8692 6.67482C20 7.01845 20 7.4182 20 8.21772V12.0001Z" stroke="${modIconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
          </svg>
        </div>
      </div>`;

    return `
      <div class="w-full flex items-center my-5 user" id="${member.user.username}" mod="${member.mod}">
        <div class="flex-none w-58">
          <img class="rounded-full w-58 h-58 object-cover" src="${member.user.profilePicture}" alt="${member.user.username}'s profile picture"/>
        </div>
        <div class="ml-8 flex-none w-207">
          ${displayName.outerHTML}
          ${username.outerHTML}
        </div>
        ${(currentLocalUser === circleData.circle.ownerId || ((currentUserMembership && !member.mod) ? currentUserMembership.mod: false)) && member.user.username !== circleData.circle.ownerId ? 
          `<div class="ml-auto pr-2">
            ${removeMemberIcon}
            </div>`: ""}
        ${(currentLocalUser === circleData.circle.ownerId && member.user.username !== circleData.circle.ownerId) ? 
          `<div class="ml-auto pr-2">
            ${modIcon}
          </div>` : 
          `<div class="ml-auto pr-2">
            ${member.user.username === circleData.circle.ownerId ? owner : (member.mod ? modIcon : "")}
          </div>`}
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

async function displaySandboxCircle(circleData){
  console.log(circleData)
  header.classList.remove("hidden");

  let circleName = document.createElement("p");
  circleName.className = "text-center text-20 font-bold break-words text-wrap max-w-[234px]";
  circleName.textContent = circleData.name;

  const albumList = circleData.albums.map((obj) => {
    let albumName = document.createElement("p");
    albumName.className = "text-white text-shadow shadow-black";
    albumName.textContent = obj.name;
    // CHANGE ME : placeholder image 
    console.log(obj.photos[0])
    return `
      <div class="w-full h-min relative album" name="${obj.name}">
        <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0]? obj.photos[0].src : "/placeholder_image.svg"}"/>
        <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
          ${albumName.outerHTML}
        </div>
      </div>`;
  });

  pageContent.innerHTML = `
  <div id="circlePage" class="w-full px-0 mx-0">
      <div id="circleImage" class="relative flex justify-center mt-6 mb-1.5">
        <img src="${circleData.picture}" class="rounded-full w-180 h-180 object-cover"/>
      </div>
      <div id="circleName" class="relative my-3 flex justify-center items-center max-w-full h-11">
        ${circleName.outerHTML}
      </div>
      <div class="memberCount place-items-center mt-12 mb-2 mr-0">
        ${circleData._count.UserCircle} Friends
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

    const albumListTarget = document.querySelector("#albumList");
    albumListTarget.addEventListener("click", async function (event) {
      event.preventDefault();
      const albumDiv = event.target.closest(".album");
      if (albumDiv) {
        const albumName = albumDiv.getAttribute("name");
        const albumData = circleData.albums.find(album => album.name === albumName);
        if (albumData) {
          await displaySandboxAlbum(albumData, circleData);
        }
      }
    });
}