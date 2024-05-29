async function displayListOfFriends(friends) {
  let newArr = friends.map((friend) => {
    let displayName = document.createElement("h2");
    let username = document.createElement("h2");
    displayName.className = "font-medium text-14 leading-tertiary";
    username.className = "font-light text-14 text-dark-grey";
    displayName.textContent = friend.displayName
      ? friend.displayName
      : friend.username;
    username.textContent = `@${friend.username}`;
    return `
    <div class="flex items-center my-5 user" id="${friend.username}">
    <div class="flex-none w-58">
      <img class="rounded-full w-58 h-58" src="${friend.profilePicture}" alt="${friend.username}'s profile picture"/>
    </div>
    <div class="ml-8 flex-none w-207">
      ${displayName.outerHTML}
      ${username.outerHTML}
    </div>
    <div class="flex-none w-58">
      <form>
        <input type="checkbox" id="add" name="add" class="cursor-pointer" value="${friend.username}">
      </form>
    </div>
  </div>`;
  });
  return newArr;
}

async function displayInviteFriends(fromCircle = false, circleId = "") {
  nav.classList.add("hidden");
  let friends = await getFriends(currentLocalUser);
  if (fromCircle && circleId) {
    const { data, success } = await getCircle(circleId)
    if (data && success) {
      const memberList = data.members.map((userObj) => {
        return userObj.user.username;
      });
      friends = friends.filter((user) => {
        if (!memberList.includes(user.username)) {
          return user;
        }
      });
    }
  }
  const friendsList = await displayListOfFriends(friends);
  pageName.textContent = "Invite Friends";
  leftHeaderButton.classList.remove("hidden");
  leftHeaderButton.innerHTML = backIcon;
  leftHeaderButton.id = "circleBackButton";
  rightHeaderButton.textContent = "Next";
  rightHeaderButton.className = "text-lg";
  rightHeaderButton.id = "circleNext";
  if (fromCircle && circleId) {
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "backToCircle";
    leftHeaderButton.setAttribute("circleId", circleId);
    rightHeaderButton.textContent = "Done";
    rightHeaderButton.className = "text-lg";
    rightHeaderButton.id = "inviteDone";
  }

  pageContent.innerHTML = `
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
      <p>search or add friends to collaborate with in</p>
      <p>your circle</p>
    </div>
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
      <div class="relative w-full h-9 mt-8">
        <form onkeydown="return event.key != 'Enter';">
          <input class="w-380 px-10 py-2 border-grey border-2 rounded-input-box text-secondary leading-secondary" placeholder="search friends"/>
          <img src="/lightmode/search_icon_grey.svg" alt="search icon" class="absolute left-3 top-search w-25 h-25"/>
        </form>
      </div>
      <div class="shrink-0 mt-10 mb-6 justify-center w-full">
        <h1 class="font-bold text-20 leading-body">Suggested Friends</h1>
        <div id="suggestedFriends"></div>
      </div>
    </div>
    `;
  const suggestedFriends = document.querySelector("#suggestedFriends");
  suggestedFriends.innerHTML = friendsList.join("");
}

function saveCheckedFriends() {
  const addCheckboxes = document.querySelectorAll("#add");
  addCheckboxes.forEach((checkbox) => {
    if (checkbox.checked && !checkedFriends.includes(checkbox.value)) {
      checkedFriends.push(checkbox.value);
    }
  });
}

async function displayFriends(username) {
    nav.classList.add("hidden");
  
    // this is to show all users when the page first loads
    pageName.textContent = "Friends";
    leftHeaderButton.classList.remove("hidden");
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "friendsBackButton";
    leftHeaderButton.setAttribute("username", username);
    rightHeaderButton.innerHTML = "";
  
    pageContent.innerHTML = `
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full bg-light-mode">
      <div class="w-380 bg-light-mode">
        <div class="fixed ml-2 bg-light-mode">
          <p>We don’t send notifications when you edit</p>
          <p>your Friends List.</p>
          <div class="h-9 bg-light-mode w-full mt-6">
              <form onkeydown="return event.key != 'Enter';" class="h-9 bg-light-mode w-full relative">
                <input id="searchFriendsBox" class="w-380    px-10 py-2 border-grey border-2 rounded-input-box text-secondary leading-secondary bg-white" placeholder="search friends"/>
                <img src="/lightmode/search_icon_grey.svg" alt="search icon" class="absolute left-3 top-search w-25 h-25"/>
              </form>
          </div>
        </div>
      </div>
    </div>
    <div id="allFriendsList" class="flex flex-col items-center mt-20 p-4 bg-light-mode rounded-lg w-full">
      <div class="flex flex-col shrink-0 mt-10 mb-6 justify-center w-380">
        <h1 id="friendCount" class="font-bold text-20 leading-body"></h1>
        <div id="friendsDiv" class="flex flex-col pb-24 w-full"></div>
      </div>
    </div>`;
  
    const searchBox = document.querySelector("#searchFriendsBox");
    const friendsDiv = document.querySelector("#friendsDiv");
    let friendsList = [];
  
    async function initializeSearch() {
      const friends = await getFriends(username);
      friendsList = friends;
                    
      updateSuggestedFriends(friends);
    }
  
    function updateSuggestedFriends(friends) {
      friendsDiv.innerHTML = displayFriendsList(friends, username).join("");
      if (friends.length === 1) {
        friendCount.innerHTML = `${friends.length} friend`;
      } else if (friends.length > 1) {
        friendCount.innerHTML = `${friends.length} friends`;
      } else {
        friendCount.innerHTML = `0 friends`;
      }
    }
  
    await initializeSearch();
  
    searchBox.addEventListener("input", (event) => {
      const searchTerm = searchBox.value.toLowerCase();
      const filteredResults = friendsList.filter((user) => {
        if (user.displayName) {
          return (
            user.username.toLowerCase().includes(searchTerm) ||
            user.displayName.toLowerCase().includes(searchTerm)
          );
        }
        return user.username.toLowerCase().includes(searchTerm);
      });
      updateSuggestedFriends(filteredResults);
    });
    const allFriendsList = document.querySelector("#allFriendsList");
    allFriendsList.addEventListener("click", async (event) => {
      event.preventDefault();
      const removeFriend = event.target.closest(".removeFriendIcon");

      if (removeFriend) {
        const username = document.querySelector(".username").getAttribute("username");
        await displayPopup("friend removed");
        await unfriend(username, currentLocalUser);
        await displayFriends(currentLocalUser);
        return;
      }

      const user = event.target.closest("div.user");
      if (user) {
        const { success, data } = await getUser(user.id);
        if (success && data) {
          leftHeaderButton.setAttribute("secondaryOrigin", "fromFriendsList");
          return await displayProfile(data);
        }
      }
    });
  }
  
function displayFriendsList(friends, username) {
    let removeFriendIcon = "";
    if (username === currentLocalUser) {
      removeFriendIcon = `
      <div class="flex-none w-[30px] z-50">
        <div class="removeFriendIcon">
          <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 10.5C17.5 7.7375 15.2625 5.5 12.5 5.5C9.7375 5.5 7.5 7.7375 7.5 10.5C7.5 13.2625 9.7375 15.5 12.5 15.5C15.2625 15.5 17.5 13.2625 17.5 10.5ZM2.5 23V24.25C2.5 24.9375 3.0625 25.5 3.75 25.5H21.25C21.9375 25.5 22.5 24.9375 22.5 24.25V23C22.5 19.675 15.8375 18 12.5 18C9.1625 18 2.5 19.675 2.5 23ZM22.5 13H27.5C28.1875 13 28.75 13.5625 28.75 14.25C28.75 14.9375 28.1875 15.5 27.5 15.5H22.5C21.8125 15.5 21.25 14.9375 21.25 14.25C21.25 13.5625 21.8125 13 22.5 13Z" fill="#0E0E0E"/>
          </svg>
        </div>
      </div>`;
    }
    return friends.map((friend) => {
      let displayName = document.createElement("h2");
      let username = document.createElement("h2");
      displayName.className = "displayName font-medium text-14 leading-tertiary";
      username.className = "username font-light text-14 text-dark-grey";
      username.setAttribute("username", friend.username);
      displayName.textContent = friend.displayName ? friend.displayName : friend.username;
      username.textContent = `@${friend.username}`;
      return `
        <div class="flex items-center my-5 user" id="${friend.username}">
          <div class="flex-none w-58">
            <img class="rounded-full w-58 h-58 object-cover" src="${friend.profilePicture}" alt="${friend.username}'s profile picture"/>
          </div>
          <div class="ml-8 flex-none w-207">
            ${displayName.outerHTML}
            ${username.outerHTML}
          </div>
          <div class="ml-auto pr-2">
            ${removeFriendIcon}
          </div>
        </div>`;
    });
}
  
async function displayFriendRequests() {
    pageName.textContent = "Friend Requests";
    leftHeaderButton.innerHTML = backIcon;
    leftHeaderButton.id = "toActivity";
    const { friendRequests } = await getActivities(currentLocalUser);
  
    let friendRequestsList = friendRequests.map((request) => {
      let username = document.createElement("h2");
      username.className = "font-medium text-14 leading-tertiary";
      username.textContent = `@${request.requester.username}`;
      const displayName = username.cloneNode(true);
      request.requester.displayName
        ? (displayName.textContent = request.requester.displayName)
        : (displayName.textContent = request.requester.username);
      return `
      <div class="flex items-center my-5 user" id="${request.requester.username}">
        <div class="flex-none w-58">
          <img class="rounded-full w-58 h-58 object-cover" src="${request.requester.profilePicture}" alt="${request.requester.username}'s profile picture"/>
        </div>
        <div class="ml-8 flex-none w-110 grid grid-rows-2">
          <div>
            ${displayName.outerHTML}
          </div>
          <div>
            ${username.outerHTML}
          </div>
        </div>
        <div class="ml-auto w-166">
          <form class="flex text-white gap-2">
            <button identifier="${request.requesterName}" 
            sentTo="${request.requesteeName}" name="acceptFriendRequest" 
            class="w-request h-request rounded-input-box bg-light-mode-accent z-50">accept</button>
            <button identifier="${request.requesterName}" 
            sentTo="${request.requesteeName}" name="declineFriendRequest" 
            class="w-request h-request rounded-input-box bg-dark-grey z-50">decline</button>
          </form>
        </div>
      </div>`;
    }).join("");

  pageContent.innerHTML = `<div id="friendRequestsList" class="flex flex-col pb-200">${friendRequestsList}</div>`;
  const friendRequestsListPage = document.querySelector("#friendRequestsList");
  friendRequestsListPage.addEventListener("click", async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute("identifier");
    const invitee = event.target.getAttribute("sentTo");
    switch (event.target.name) {
      case "acceptFriendRequest": {
        await acceptFriendRequest(id, invitee);
        await displayFriendRequests();
        return;
      }
      case "declineFriendRequest": {
        await removeFriendRequest(id, invitee);
        await displayFriendRequests();
        return;
      }
      default:
        break;
    }
    const user = event.target.closest("div.user");
    if (user) {
      const { success, data } = await getUser(user.id);
      if (success && data) {
        leftButtonSpan.setAttribute("origin", "fromFriendRequests");
        return await displayProfile(data);
      }
      return;
    }
  });
}