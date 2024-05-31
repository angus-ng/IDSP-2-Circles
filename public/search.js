async function displaySearch() {
    pageName.textContent = "Search";
    rightHeaderButton.innerHTML = "";
    leftHeaderButton.innerHTML = "";
    pageContent.innerHTML = `
      <div id="searchPage" class="w-full h-full">
        <div class="w-full h-full ml-2 bg-light-mode">
          <div class="fixed mb-6">
            <div class="relative w-full h-12 bg-light-mode">
              <input type="text" id="searchBox" class="w-380 px-10 py-2 mt-2 border-grey border-2 rounded-input-box text-secondary leading-secondary" placeholder="search account">
              <div class="absolute left-3 top-3.5 w-25 h-25">${searchBarIcon}</div>
            </div>
          </div>
          <div class="flex flex-col shrink-0 justify-center w-380">
            <div id="suggestedFriends" class="flex flex-col mt-20 pb-48"></div>
          </div>
        </div>
      </div>
      `;
    const searchBox = document.querySelector("#searchBox");
  
    // this is to show all users when the page first loads
    const suggestedFriends = document.querySelector("#suggestedFriends");
    let storedSearchResults = [];
  
    async function initializeSearch() {
      const initialSearchResult = await getSearchResult(searchBox.value);
      storedSearchResults = initialSearchResult.data;
      
      updateSuggestedFriends(storedSearchResults);
    }
  
    function updateSuggestedFriends(data) {
      suggestedFriends.innerHTML = displayUserSearch(data).join("");
    }
  
    await initializeSearch();
  
    searchBox.addEventListener("input", (event) => {
      const searchTerm = searchBox.value.toLowerCase();
      if (!searchTerm.trim()) {
        updateSuggestedFriends(storedSearchResults);
        return;
      }
      const filteredResults = storedSearchResults.filter((user) => {
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
  
    // Initial load
    suggestedFriends.addEventListener("click", async function (event) {
      event.preventDefault();
      const user = event.target.closest("div.user");
      if (user) {
        const { success, data } = await getUser(user.id);
        if (success && data) {
          leftHeaderButton.setAttribute("origin", "fromSearch");
          return await displayProfile(data);
        }
      }
    });
    suggestedFriends.addEventListener("click", async (event) => {
      event.preventDefault();
      const target = event.target;
      const username = target.getAttribute("name");
      const method = target.getAttribute("method");
      let response;
      switch (method) {
        case "Add Friend":
          response = await sendFriendRequest(username, currentLocalUser);
          await displayPopup("friend request sent");
          await displaySearch();
          break;
        case "Remove Friend":
          response = await unfriend(username, currentLocalUser);
          await displaySearch();
          break;
        case "Remove Request":
          response = await removeFriendRequest(username, currentLocalUser);
          await displaySearch();
          break;
        case "Accept Request":
          response = await acceptFriendRequest(username, currentLocalUser);
          await displaySearch();
          break;
        default:
          break;
      }
    });
}

function displayUserSearch(listOfUsers) {
    if (!listOfUsers) {
      return [];
    }
  
    let newArr = listOfUsers.map((user) => {
      if (user.username === currentLocalUser) {
        return;
      }
      let friendStatus = "Add Friend";
      for (let friend of user.friendOf) {
        if (friend.friend_1_name === currentLocalUser) {
          method = "Remove Friend";
          friendStatus = "Remove Friend";
        }
      }
      for (let request of user.requestReceived) {
        if (request.requester.username === currentLocalUser) {
          friendStatus = "Remove Request";
        }
      }
      for (let request of user.requestsSent) {
        if (request.requestee.username === currentLocalUser) {
          friendStatus = "Accept Request";
        }
      }
      let displayName = document.createElement("h2");
      let username = document.createElement("h2");
      displayName.className = "font-medium text-14 leading-tertiary";
      username.className = "font-light text-14 text-dark-grey";
      displayName.textContent = user.displayName
        ? user.displayName
        : user.username;
      username.textContent = `@${user.username}`;
      return `<div class="flex items-center my-3 user cursor-pointer" id="${user.username}">
        <div class="flex-none w-58">
          <img class="rounded-full w-58 h-58 object-cover" src="${user.profilePicture}" alt="${user.username}'s profile picture"/>
        </div>
        <div class="ml-8 flex-none w-207">
          ${displayName.outerHTML}
          ${username.outerHTML}
        </div>
        <div class="ml-auto w-5">
          <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7.5 7.5L1 14" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>`;
    });
    return newArr;
}