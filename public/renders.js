function displayLoginPage() {
  pageContent.innerHTML = `
    <div id="loginPage" class="flex flex-col items-center rounded-lg w-full h-screen z-10">
      <div class="h-380 mt-32 mb-6">
          ${logoWithWordmark} 
      </div>
      <div class="h-45 mt-10">
        <form action="/auth/login">
          <button class="w-380 h-45 bg-light-mode-accent rounded-input-box text-white">Login</button>
        </form>
      </div>
      <div class="h-45 mt-10">
        <form action="/auth/register">
          <p class="text-body leading-body inline">Don't have an account?</p>
          <button class="text-body leading-body inline text-light-mode-accent text-decoration-line: underline cursor-pointer">Sign up</button>
        </form>
      </div>
    </div>
  </div>`;
}

async function displayNavBar() {
  const nav = document.querySelector("#nav");
  nav.classList.remove("hidden");
  nav.innerHTML = `
  <div class="border-b border-dark-grey"></div>
      <footer class="w-full flex justify-between items-center pt-4 pb-5 px-6 bg-light-mode-bg text-grey text-13">
          <a id="explore" class="flex flex-col items-center cursor-pointer">        
              ${exploreIcon}
              <p class="mt-1">explore</p>
          </a>
          <a id="search" class="flex flex-col items-center cursor-pointer">
              ${searchIcon}
              <p class="mt-1">search</p>
          </a>
          <a id="new" class="flex flex-col items-center cursor-pointer">
              ${newIcon}
              <p class="mt-1">new</p>
          </a>
          <a id="activity" class="flex flex-col items-center cursor-pointer">
              ${activityIcon}
              <p class="mt-1">activity</p>         
          </a>
          <a id="profile" class="flex flex-col items-center cursor-pointer">
              ${profileIcon}
              <p class="mt-1">profile</p>
          </a>
      </footer>`;

  const navBar = document.querySelector("footer");
  navBar.addEventListener("click", async function (event) {
    event.preventDefault();
    const exploreButton = event.target.closest("#explore");
    const searchButton = event.target.closest("#search");
    const newButton = event.target.closest("#new");
    const activityButton = event.target.closest("#activity");
    const profileButton = event.target.closest("#profile");

    clearNewAlbum();

    if (exploreButton) {
      const { data } = await getUser(currentLocalUser);
      await displayExplore(data);
      pageName.setAttribute("page", "explore");
      newCircleNameInput = "";
      pageName.classList.remove("text-light-mode-accent");
    }
    if (searchButton) {
      navigationHistory = [];
      await displaySearch();
      pageName.setAttribute("page", "search");
      newCircleNameInput = "";
      pageName.classList.remove("text-light-mode-accent");
    }
    if (newButton) {
      newCircleNameInput = "";
      await displayNewModal();
      pageName.setAttribute("page", "new");
      pageName.classList.remove("text-light-mode-accent");
    }
    if (activityButton) {
      await displayActivity();
      newCircleNameInput = "";
      pageName.setAttribute("page", "activity");
      pageName.classList.remove("text-light-mode-accent");
    }
    if (profileButton) {
      navigationHistory = [];
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
      pageName.classList.remove("text-light-mode-accent");
      const { success, data } = await getUser(currentLocalUser);
      if (success && data) {
        pageName.setAttribute("page", "profile");
        leftHeaderButton.setAttribute("origin", "fromProfile");
        return await displayProfile(data);
      }
    }
  });
}

async function displayNewModal() {
  openModal();
  const closeModalButton = document.querySelector("#closeModalButton");
  closeModalButton.classList.remove("hidden");
  const modalContent = document.querySelector("#modalContent");
  modalContent.innerHTML = `
  <div class="flex flex-row gap-6 justify-center text-light-mode-accent font-medium text-14 text-center">
    <button id="createAlbumModalButton" class="ml-1 flex-col">
        ${newAlbumIcon}
        <p class="mt-3 text-center">create album</p>
    </button>
    <button id="createCircleModalButton" class="ml-1 flex-col">
        ${newCircleIcon}
        <p class="mt-3 text-center">create circle</p>
    </button>                        
  </div>`;
}

async function displayPopup(activity) {
  const notificationText = document.querySelector("#notificationText");
  notificationText.textContent = `${activity}`;
  const popup = document.querySelector("#popup");
  popup.classList.remove("hidden");

  const closeButton = document.querySelector("#popupCloseButton");
  closeButton.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  setTimeout(() => {
    popup.classList.add("opacity-0", "duration-1000");
    popup.addEventListener("transitionend", async () => {
      await resetPopup();
    });
  }, 2000);

  async function resetPopup() {
    const notificationText = popup.querySelector("#notificationText");
    notificationText.textContent = "";
    popup.classList.remove("opacity-0", "duration-1000");
    popup.classList.add("hidden");
  }
}

async function displayConfirmationPopup(activity, helperObj) {
  const confirmationText = document.querySelector("#confirmationText");
  confirmationText.textContent = `${activity}`;
  const confirmationPopup = document.querySelector("#confirmationPopup");
  confirmationPopup.classList.remove("hidden");
  confirmationPopup;

  const confirmationDetails = confirmationPopup.querySelector("#confirmationDetails");
  const confirmationIcon = confirmationPopup.querySelector("#confirmationIcon");

  if (activity === `remove ${helperObj.member}`) {
    confirmationDetails.innerHTML = `
    <p class="text-14">Once this member has been removed. They</p>
    <p class="text-14">must be re-invited to the circle.</p>`;

    contextButton.textContent = "Remove";
    confirmationIcon.innerHTML = removeUserIcon;
  }

  if (activity === `mod ${helperObj.member}` || activity === `unmod ${helperObj.member}`) {
    if (activity.slice(0,3) === "mod") {
      confirmationDetails.innerHTML = `
      <p class="text-14">Once this member is a moderator. They</p>
      <p class="text-14">must be unmodded to revoke privileges.</p>`;
      contextButton.textContent = "Mod";
    } else {
      confirmationDetails.innerHTML = `
      <p class="text-14">Revoke moderator privileges</p>
      <p class="text-14">from this user?</p>`;
      contextButton.textContent = "Unmod";
    }

    confirmationIcon.innerHTML = modIcon;
  }

  if (activity === "delete comment") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Once these items are be deleted. This</p>
      <p class="text-14">can not be undone</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = largeDeleteIcon;
  }

  if (activity === "delete circle") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Deleting a circle is permanent.</p>
      <p class="text-14">This action can not be undone.</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = largeDeleteIcon;
  }

  if (activity === "delete album") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Deleting an album is permanent.</p>
      <p class="text-14">Photos and comments will be removed.</p>
      <p class="text-14">This action can not be undone.</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = largeDeleteIcon;
  }

  if (activity === "delete photo") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Deleting a photo is permanent.</p>
      <p class="text-14">This action can not be undone.</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = largeDeleteIcon;
  }

  const confirmEventHandler = async (event) => {
    event.stopImmediatePropagation();
    const cancelButton = event.target.closest("#cancelButton");
    const contextButton = event.target.closest("#contextButton");
    const closeWindowAfterAction = () => {
      confirmationPopup.classList.add("hidden");
      confirmationText.textContent = "";
      confirmationPopup.removeEventListener("click", confirmEventHandler, true);
    }
    if (cancelButton) {
      closeWindowAfterAction();
    }

    if (contextButton) {
      if (activity === "delete comment") {
        await deleteComment(helperObj.commentId);
        closeWindowAfterAction();
        await displayComments(helperObj.albumId, helperObj.currentUserProfilePicture, helperObj.circleId );
      }
      if (activity.slice(0,3) === "mod" || activity.slice(0, 5) === "unmod") {
        const { success, error } = await toggleMod(helperObj)
        if (success && !error) {
          closeWindowAfterAction();
            await displayCircleMembers(helperObj.circleId);
        }
      }
      if (activity.slice(0, 6) === "remove") {
        const { success, error } = await removeFromCircle(helperObj)
        if (success && !error) { 
          closeWindowAfterAction();
            await displayCircleMembers(helperObj.circleId);
        }
      }
      if (activity === "delete circle") {
        const { success, data, error } = await deleteCircle(helperObj.circleId)
        if (success && !error) {
          const { success, data } = await getUser(currentLocalUser);
          if (success && data) {
            closeWindowAfterAction();
            await displayExplore(data);
          }
        }
      }
      if (activity === "delete album") {
        const { success, error } = await deleteAlbum(helperObj.albumId)
        if (success && !error) {
          closeWindowAfterAction();
          const { success, data } = await getCircle(helperObj.circleId)
          if (success && data) {
            leftHeaderButton.id = "backToExplore"
            leftHeaderButton.setAttribute("circleId", helperObj.circleId)
            await displayCircle(data);
          }
        }
      }
      if (activity === "delete photo") {
        const { success, error } = await deletePhoto(helperObj.photoId)
        if (success && !error) {
          closeWindowAfterAction();
          const { success, data } = await getAlbum(helperObj.albumId)
          if (success && data) {
            await displayAlbum(data);
          }
        }
      }
    }
  };

  confirmationPopup.addEventListener("click", confirmEventHandler, true);
}

async function displayActivity() {
  pageName.textContent = "All Activity";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  const { friendRequests, circleInvites } = await getActivities(currentLocalUser);
  const noCircleInvites = `<p class="text-secondary text-medium-grey" >No circle invites pending.</p>`;
  const circleInvitePreviews = [];
  for (i = 0; i < circleInvites.length; i++) {
    if (i > 3) {
      const count = circleInvites.length - 4;
      const andMore = `
      <div class="w-8 h-8 rounded-full border-2 border-white border-solid ml-neg12 flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      circleInvitePreviews.push(andMore);
      break;
    }
    const circleImg = document.createElement("img");
    circleImg.src = circleInvites[i].circle.picture;
    circleImg.alt = `${circleInvites[i].circle.name}'s picture`;
    circleImg.className = "w-8 h-8 rounded-full object-cover border-2 border-white border-solid";
    i > 0 ? circleImg.classList.add("ml-neg12") : null;
    circleInvitePreviews.push(circleImg.outerHTML);
  }

  const noFriendRequests = `<p class="text-secondary text-medium-grey" >No friend requests pending.</p>`;
  const friendRequestsPreviews = [];
  for (i = 0; i < friendRequests.length; i++) {
    if (i > 3) {
      const count = friendRequests.length - 4;
      const andMore = `
      <div class="w-8 h-8 rounded-full border-2 border-white border-solid ml-neg12 flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      friendRequestsPreviews.push(andMore);
      break;
    }
    const friendImg = document.createElement("img");
    friendImg.src = friendRequests[i].requester.profilePicture;
    let altText = friendRequests[i].requester.displayName
      ? friendRequests[i].requester.displayName
      : friendRequests[i].requester.username;
    altText = altText + "'s profile picture";
    friendImg.alt = altText;
    friendImg.className = "w-8 h-8 rounded-full object-cover border-2 border-white border-solid";
    i > 0 ? friendImg.classList.add("ml-neg12") : null;
    friendRequestsPreviews.push(friendImg.outerHTML);
  }

  pageContent.innerHTML = `
    <div id="activityPage" class="flex-non flex-col py-2 w-full h-full">
        <div id="circleInviteSection" class="h-100 border-solid border border-y-black border-x-transparent w-full flex items-center flex-wrap flex-row justify-between space-y-0">
            <div class="w-full">
                <h2 class="font-medium text-base">Circle Invites</h2>
            </div>
            <div id="circleInvites" class="flex w-full">
                <div class="flex w-180 h-33 items-center">
                    ${circleInvites.length
                        ? circleInvitePreviews.join("")
                        : noCircleInvites}
                </div>
                <div class="flex w-2 h-33 items-center ml-auto">
                    ${activityArrowIcon}
                </div>
            </div>
        </div>
        <div id="friendInviteSection" class="h-100 border-solid border border-t-transparent border-b-black border-x-transparent w-full flex items-center flex-wrap flex-row space-y-0">
            <div class="w-full">
                <h2 class="font-medium text-base">Friend Requests</h2>
            </div>
            <div id="friendRequests" class="flex w-full">
              <div class="flex w-180 h-33 items-center">
                  ${friendRequests.length
                      ? friendRequestsPreviews.join("")
                      : noFriendRequests}
              </div>
              <div class="flex w-2 h-33 items-center ml-auto">
                  ${activityArrowIcon}
              </div>
            </div>
        </div>
    </div>`;

  const activityPage = document.querySelector("#activityPage");

  activityPage.addEventListener("click", async (event) => {
    const circleInvitesDiv = event.target.closest("#circleInvites");
    const friendRequestsDiv = event.target.closest("#friendRequests");
    event.preventDefault();

    if (circleInvitesDiv) {
      if (circleInvites.length) {
        await displayCircleInvites();
      }
    }

    if (friendRequestsDiv) {
      if (friendRequests.length) {
        await displayFriendRequests();
      }
    }
  });
}

async function displayProfile(userData) {
  nav.classList.remove("hidden");
  leftHeaderButton.classList.remove("hidden");
  const user = userData.username;
  const circleRender = await displayListOfCircles(userData, user);
  const albumRender = await displayListOfAlbums(userData, user, true);

  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = backIcon;
  // leftHeaderButton.id = "profileBackButton";
  leftHeaderButton.removeAttribute("circleId");
  leftHeaderButton.setAttribute("username", user);
  
  const origin = leftHeaderButton.getAttribute("origin");
  const secondaryOrigin = leftHeaderButton.getAttribute("secondaryOrigin");
  if (origin === "fromSearch") {
    if (secondaryOrigin === "fromFriendsList") {
      leftHeaderButton.id = "friendsBackButton";
    } else {
      leftHeaderButton.id = "backToSearch";
    }
  }

  if (origin === "fromFeed") {
    leftHeaderButton.id = "backToExplore";
  }

  if (origin === "fromFriendRequests") {
    leftHeaderButton.id = "backToFriendRequests";
    leftHeaderButton.className = "";
  }

  if (currentLocalUser === user && secondaryOrigin !== "fromFriendsList" && origin !== "fromFriendRequests") {
    leftHeaderButton.classList.add("hidden");
  }
  
  if (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1] !== user) {
    navigationHistory.push(user);
  }

  pageName.textContent = userData.displayName ? userData.displayName : userData.username;
  const username = document.createElement("h2");
  username.id = "username";
  username.setAttribute("username", userData.username);
  username.className = "text-base text-center";
  username.textContent = `@${userData.username}`;

  const friendText = userData._count.friends === 1 ? "Friend" : "Friends";

  const settings = document.createElement("div");
  settings.id = "settings";
  settings.className = "absolute top-0 right-0 w-6 h-6 items-center justify-center cursor-pointer";
  settings.innerHTML = settingsIcon;

  pageContent.innerHTML = `
  <div id="profilePage" class="relative pt-2 pb-16 mb-4 w-full">
    ${currentLocalUser === userData.username ? `${settings.outerHTML}` : ""}
    <div class="flex justify-center mb-4">
      <img id="profilePicture" src="${userData.profilePicture}" class="w-110 h-110 object-cover rounded-full"/>
    </div>
    <div class="flex justify-center mt-2">
      ${username.outerHTML}
    </div>
    <div class="w-180 mt-6 mb-6 m-auto grid grid-cols-2 gap-4">
      <div class="gap-0 justify-center">
        <div id="circles">
          <h2 class="text-base font-bold text-center">${userData._count.UserCircle}</h2>
          <h2 class="text-secondary text-center">Circles</h2>
        </div>
      </div>
      <div class="gap-0 justify-center">
        <div id="friends" class="cursor-pointer">
          <h2 class="text-base font-bold text-center" id="friendCounter">${
            userData._count.friends
          }</h2>
          <h2 class="text-secondary text-center">${friendText}</h2>
        </div>
      </div>
    </div>
    <div id="addAsFriend" class="flex justify-center"></div>
    <div id="profileTabs" class="w-full justify-center mx-auto">
      <ul class="flex flex-row w-full justify-center -mb-px text-sm font-medium text-center text-dark-grey gap-6">
        <li id="albumTab" class="me-2 w-full mr-0">
          <a class="w-full inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-black hover:border-black">
            <p class="text-13 font-bold mr-2">albums</p>
            ${albumTabIcon}
          </a>
        </li>
        <li id="circleTab" class="me-2 w-full mr-0">
          <a class="w-full inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg text-black border-black hover:text-black hover:border-black">
            <p id="circleText" class="text-13 font-bold mr-2">circles</p>
            ${circleTabIcon}
          </a>
        </li>
      </ul>
    </div>
    <div id="albumList" class="m-auto mt-6 mb-6 columns-2 gap-4 space-y-4 grid-flow-row hidden">
      ${albumRender.join("")}
    </div>
    <div id="circleList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 place-items-center">
      ${circleRender.join("")}
    </div>
    <div class="h-100"></div>
  </div>`;

  const addAsFriend = document.querySelector("#addAsFriend");
  currentLocalUser === userData.username
    ? null
    : (addAsFriend.innerHTML = `<button id="addFriendButton" class="w-auto h-38 rounded-input-box text-white text-secondary px-4">Add Friend</button>`);
  if (currentLocalUser !== userData.username) {
    const addButton = addAsFriend.querySelector("#addFriendButton");
    addButton.setAttribute("method", "Add Friend");
    addButton.setAttribute("name", `${userData.username}`);

    let isFriend = false;

    for (let friend of userData.friendOf) {
      if (friend.friend_1_name === currentLocalUser) {
        addButton.setAttribute("method", "Remove Friend");
        addButton.textContent = "Friend";
        isFriend = true;
      }
    }
    for (let request of userData.requestReceived) {
      if (request.requester.username === currentLocalUser) {
        addButton.setAttribute("method", "Remove Request");
        addButton.textContent = "Requested";
      }
    }
    for (let request of userData.requestsSent) {
      if (request.requestee.username === currentLocalUser) {
        addButton.setAttribute("method", "Accept Request");
        addButton.textContent = "Accept Friend";
      }
    }

    switch (addButton.getAttribute("method")) {
      case "Remove Request":
        addButton.classList.add("bg-dark-grey");
        break;
      default:
        addButton.classList.add("bg-light-mode-accent");
        break;
    }

    if (isFriend) {
      addButton.addEventListener("mouseenter", () => {
        addButton.textContent = "Unfriend";
        addButton.classList.remove("bg-light-mode-accent");
        addButton.classList.add("bg-dark-grey");
      });

      addButton.addEventListener("mouseout", () => {
        addButton.textContent = "Friend";
        addButton.classList.remove("bg-dark-grey");
        addButton.classList.add("bg-light-mode-accent");
      });
    }
  }

  const profilePage = document.querySelector("#profilePage");
  profilePage.addEventListener("click", async (event) => {
    const albumTab = event.target.closest("#albumTab");
    const circleTab = event.target.closest("#circleTab");
    const albumTabLink = document.querySelector("#albumTab a");
    const circleTabLink = document.querySelector("#circleTab a");
    const circleList = document.querySelector("#circleList");
    const albumList = document.querySelector("#albumList");
    const settings = event.target.closest("#settings");
    const friends = event.target.closest("#friends");
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
      await displayComments(albumDiv.id, userData.profilePicture, albumDiv.getAttribute("circleid"));
      return;
    }

    if (albumDiv) {
      const user = document.querySelector("span.user").getAttribute("username");

      if (user) {
        if (albumDiv.hasAttribute("id")) {
          let { success, data, error } = await getAlbum(albumDiv.id);
          if (success && data) {
            leftHeaderButton.setAttribute("origin", "fromProfile");
            leftHeaderButton.setAttribute("albumId", albumDiv.id)
            await displayAlbum(data);
          }
        }
      }
    }

    if (albumTab) {
      if (albumList.classList.contains("hidden")) {
        albumList.classList.remove("hidden");
        circleList.classList.add("hidden");
      }

      albumTabLink.querySelector("svg path").setAttribute("fill", "black");
      albumTabLink.classList.add("text-black");
      albumTabLink.classList.add("border-black");
      circleTabLink.querySelector("svg path").setAttribute("fill", "#737373");
      circleTabLink.classList.remove("border-black");
      circleTabLink.classList.remove("text-black");
    }

    if (circleTab) {
      if (circleList.classList.contains("hidden")) {
        circleList.classList.remove("hidden");
        albumList.classList.add("hidden");
      }

      circleTabLink.classList.add("text-black");
      circleTabLink.classList.add("border-black");
      albumTabLink.classList.remove("text-black");
      albumTabLink.classList.remove("border-black");
      circleTabLink.querySelector("svg path").setAttribute("fill", "black");
      albumTabLink.querySelector("svg path").setAttribute("fill", "#737373");
    }

    if (friends) {
      await displayFriends(userData.username);
    }

    if (settings) {
      await displaySettings();
    }
  });

  document.querySelector("#circleList").addEventListener("click", async function (event) {
    const circleDiv = event.target.closest("div.circle");
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")) {
        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
          if (origin === "fromSearch") {
            leftHeaderButton.setAttribute("origin", "fromSearchProfile");
          } else {
            leftHeaderButton.setAttribute("origin", "fromProfile");
          }
          await displayCircle(data, userData.username);
        }
      }
    }
  });

  const addFriendButton = document.querySelector("#addFriendButton");
  if (addFriendButton) {
    addFriendButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const target = event.target;
      const username = target.getAttribute("name");
      const method = target.getAttribute("method");
      let response;
      switch (method) {
        case "Add Friend": {
          response = await sendFriendRequest(username, currentLocalUser);
          await displayPopup("friend request sent");
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Remove Friend": {
          response = await unfriend(username, currentLocalUser);
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Remove Request": {
          response = await removeFriendRequest(username, currentLocalUser);
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Accept Request": {
          response = await acceptFriendRequest(username, currentLocalUser);
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        default:
          break;
      }
    });
  }
  await cleanUpSectionEventListener();

  async function displaySettings() {
    pageName.textContent = "Settings";
    leftHeaderButton.classList.remove("hidden");
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "currentUserProfile";
    rightHeaderButton.innerHTML = "";

    const hiddenImageInput = document.createElement("input");
    hiddenImageInput.id = "fileUpload";
    hiddenImageInput.type ="file";
    hiddenImageInput.multiple = "false";
    hiddenImageInput.className = "hidden";

    pageContent.innerHTML = `
    <div id="settingsPage" class="flex flex-col pt-2 pb-200 mb-4 w-full">
      <div class="flex justify-center mb-4">
        <img id="profilePicture" src="${userData.profilePicture}" class="w-110 h-110 object-cover rounded-full"/>
        ${hiddenImageInput.outerHTML}
      </div>
      <div class="displayName relative flex justify-center items-center w-full mt-2 mx-auto">
        <input 
          type="text" 
          id="displayNameInput" 
          class="flex-1 text-center bg-transparent text-20 text-black font-light border-dark-grey"
          placeholder="${userData.displayName ? userData.displayName : "Add a display name"}">
        <button id="updateDisplayName" class="absolute right-8 w-auto text-body text-grey">Save</button>
    </div>

      <div class="username flex justify-center mt-2">
        ${username.outerHTML}
      </div>
      <div id="albumSettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Albums</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="privacySettings" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row items-center gap-2">
              ${privacyIcon}
              <p class="text-17">Privacy</p>
            </div>
            <div class="flex flex-row py-0">
              ${activityArrowIcon}
            </div>
          </div>
          <div id="notificationSettings" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row items-center gap-2">
              ${notificationIcon}
              <p class="text-17">Notification</p>
            </div>
            <div class="flex flex-row">
              ${activityArrowIcon}
            </div>
          </div>
        </div>
      </div>
      <div id="accessibilitySettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Accessibility</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="modeSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              ${darkModeIcon}
              <p class="text-17">Dark/Light Mode</p>
            </div>
            <div class="flex flex-row">
              ${activityArrowIcon}
            </div>
          </div>
          <div id="contrastSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              ${contrastIcon}
              <p class="text-17">Contrast</p>
            </div>
            <div class="flex flex-row">
              ${activityArrowIcon}
            </div>
          </div>
          <div id="fontSizeSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              ${fontIcon}
              <p class="text-17">Font Size</p>
            </div>
            <div class="flex flex-row">
              ${activityArrowIcon}
            </div>
          </div>
        </div>
      </div>
      <div id="accountSettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Account</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="logOut" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              ${logOutIcon}
              <p class="text-17 text-light-mode-accent">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    const saveButton = document.querySelector("#updateDisplayName");
    const displayNameInput = document.querySelector("#displayNameInput");

    saveButton.addEventListener("click", async(event) => {
      event.preventDefault();
      userData.displayName = displayNameInput.value;
      await updateDisplayName(userData.displayName);
      await displaySettings();
    });

    const profilePicture = document.querySelector("#profilePicture");
    profilePicture.addEventListener("click", async(event) => {
      event.preventDefault();
      await hiddenProfileInput.click();
    })

    const hiddenProfileInput = document.querySelector("#fileUpload");
    hiddenProfileInput.addEventListener("input", async function (event) {
      event.preventDefault();
      const res = await handleSelectFile();
      if (res) {
        const profileImage = document.querySelector("#profilePicture");
        profileImage.src = res.data.url
        await updateProfilePicture(res.data.url);
        await displaySettings();
      }
    });
  }
}

async function displayExplore(userData) {
  const { success, data } = await getAlbumFeed();
  let feedRender = "";
  if (success && data) {
    const { feedData } = await displayFriendAlbums(data);
    if (feedData) {
      feedRender = feedData.join("");
    }
  }

  pageName.textContent = "Explore";
  header.classList.remove("hidden");
  leftHeaderButton.innerHTML = "";
  rightHeaderButton.innerHTML = mapIcon;
  rightHeaderButton.id = "mapButton";
  const circleRender = await displayListOfCirclesHorizontally(userData, currentLocalUser);
  pageContent.innerHTML = `
  <div id="explorePage" class="flex flex-col py-2 w-full h-full>
    <div id="circlesFeed">
      <h2 class="font-medium text-17 mb-2">Your Circles</h2>
      <div class="h-[145px]">
        <div id="circleList" class="m-auto flex flex-row gap-4 overflow-x-auto overflow-y-clip h-full">
          ${circleRender.join("")}
        </div>
      </div>
    </div>
    <div id="feed" class="h-full w-full">
      <h2 class="font-medium text-17">Your Feed</h2>
      <div id="albumList" class="w-full m-auto mt-6 mb-6 grid grid-cols-2 gap-4 pb-[200px]">
        ${feedRender}
      </div>
    </div>
  </div>`;
  await displayNavBar();

  async function displayFriendAlbums(data) {
    const albumList = await Promise.all(data.map(async (obj) => {
      let albumName = document.createElement("p");
      albumName.className = "text-white text-shadow shadow-black";
      albumName.textContent = obj.name;
  
      let userDiv = document.createElement("div");
      userDiv.setAttribute("username", obj.owner.displayName ? obj.owner.displayName : obj.owner.username);
      userDiv.className = "userInfo flex flex-row gap-2 bg-white py-4 items-center justify-start";
      let userImage = document.createElement("img");
      userImage.className = "userImage w-8 h-8 rounded-full object-cover flex-none";
      userImage.src = obj.owner.profilePicture;
      userImage.alt = `${obj.owner.username}'s profile picture`;
      userDiv.append(userImage);
      let username = document.createElement("p");
      username.className = "username text-secondary break-words";
      username.textContent = obj.owner.displayName ? obj.owner.displayName : obj.owner.username;
      userDiv.append(username);

      let creationDate = document.createElement("p");
      creationDate.className = "text-secondary text-dark-grey";
      creationDate.textContent = obj.createdAt;
  
      let circleImage = document.createElement("img");
      circleImage.className = "circle w-8 h-8 rounded-full object-cover";
      circleImage.src = obj.circle.picture;
      
      if(obj.photos[0]) {

        let albumImage = document.createElement("img");
        albumImage.className = "w-176 h-176 rounded-xl object-cover";
        albumImage.src = obj.photos[0].src;
        albumImage.alt = `${obj.name}'s album cover`;
        const userLiked = obj.likes.some(like => like.user.username === currentLocalUser);
        const likedClass = userLiked ? "liked" : "";
        const heartColor = userLiked ? "#FF4646" : "none";
        const heartColorStroke = userLiked ? "#FF4646" : "white";
    
        return `
        <div class="w-full bg-white p-3 rounded-12.75 h-[280px] overflow-hidden">
          <div class="albumCard">
              <div class="w-full h-min relative overflow-hidden album" id="${obj.id}" circleid="${obj.circleId}">
              <div>${albumImage.outerHTML}</div>
              <div class="absolute top-0 right-0 m-2 flex items-start justify-end gap-1 p2">${circleImage.outerHTML}</div>
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
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 19.125C8.79414 19.125 7.12658 18.6192 5.70821 17.6714C4.28983 16.7237 3.18434 15.3767 2.53154 13.8006C1.87873 12.2246 1.70793 10.4904 2.04073 8.81735C2.37352 7.14426 3.19498 5.60744 4.4012 4.40121C5.60743 3.19498 7.14426 2.37353 8.81735 2.04073C10.4904 1.70793 12.2246 1.87874 13.8006 2.53154C15.3767 3.18435 16.7237 4.28984 17.6714 5.70821C18.6192 7.12658 19.125 8.79414 19.125 10.5C19.125 11.926 18.78 13.2705 18.1667 14.455L19.125 19.125L14.455 18.1667C13.2705 18.78 11.925 19.125 10.5 19.125Z" stroke="#F8F4EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
              </div>
            </div>
          </div>
          <div class="h-20">
          ${userDiv.outerHTML}
          ${creationDate.outerHTML}
          </div>
      </div>`;
      }
    }));
    return { feedData: albumList };
  }

  const albumList = document.querySelector("#albumList");
  albumList.addEventListener("click", async(event) => {
    const like = event.target.closest(".like");
    const comment = event.target.closest(".comment");
    const username = event.target.closest(".username");
    const userImage = event.target.closest(".userImage");
    const albumDiv = event.target.closest(".album");

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
      const { data: userData } = await getUser(currentLocalUser);
      await displayComments(albumDiv.id, userData.profilePicture, albumDiv.getAttribute("circleid"));
      return;
    }

    if (albumDiv) {
      if (albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id);
        if (success && data) {
          leftHeaderButton.setAttribute("origin", "fromExplore");
          leftHeaderButton.setAttribute("albumId", albumDiv.id)
          await displayAlbum(data);
        }
      }
      return;
    }

    if (username || userImage) {
      const user = event.target.closest(".userInfo").getAttribute("username");
      const { data: userData } = await getUser(user);
      leftButtonSpan.setAttribute("origin", "fromFeed");
      await displayProfile(userData);
    }
  })

  const circleList = document.querySelector("#circleList");
  circleList.addEventListener("click", async function (event) {
    const circleDiv = event.target.closest("div.circle");
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")) {
        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
          leftHeaderButton.setAttribute("origin", "fromExplore");
          await displayCircle(data, userData.username);
        }
      }
    }
  });

  let isDown = false;
  let startX;
  let scrollLeft;

  circleList.addEventListener("mousedown", (e) => {
    isDown = true;
    circleList.classList.add("active");
    startX = e.pageX - circleList.offsetLeft;
    scrollLeft = circleList.scrollLeft;
  });

  circleList.addEventListener("mouseleave", () => {
    isDown = false;
    circleList.classList.remove("active");
  });

  circleList.addEventListener("mouseup", () => {
    isDown = false;
    circleList.classList.remove("active");
  });

  circleList.addEventListener("mousemove", (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - circleList.offsetLeft;
    const walk = (x - startX) * 1.5;
    circleList.scrollLeft = scrollLeft - walk;
  });
}

async function displaySandboxNav() {
  const nav = document.querySelector("#nav");
  nav.classList.remove("hidden");
  nav.innerHTML = `
  <div class="border-b border-dark-grey"></div>
    <footer class="w-full flex justify-center items-center gap-4 pt-4 pb-5 px-6 bg-light-mode-bg text-grey text-13">
        <img src="/lightmode/logo_with_wordmark.svg" alt="Circles Logo" class="h-12 w-12">
        <a id="landing" class="flex flex-col items-center cursor-pointer">
            <p class="text-body font-bold mt-1">Login / Register to Circles!</p>
        </a>
    </footer>`;

  const navBar = document.querySelector("footer");
  navBar.addEventListener("click", async function (event) {
    event.preventDefault();
    const landing = event.target.closest("#landing");
    if (landing) {
      await displayLoginPage();
    } 
  });
}