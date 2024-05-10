function displayLoginPage() {
  pageContent.innerHTML = `
    <div id="loginPage" class="flex flex-col items-center rounded-lg w-full z-10">
      <div class="flex-shrink-0 mt-2 mb-6">
          <img src="/lightmode/logo_with_wordmark.svg" alt="Logo with Wordmark">  
      </div>
  
      <div class="flex-1">
              <div class="flex items-center mt-6 mb-6">
                  <label for="login" class=""></label>
                  <input type="text" placeholder="Phone number, email, or username" id="emailInput" name="emailInput" class="rounded-input-box w-input-box border-dark-grey border-2 text-17 items-end">
              </div>
              <div class="flex items-center mt-4 mb-6">
                  <label for="password" class=""></label>
                  <input type="text" placeholder="Password" id="passwordInput" name="passwordInput" class="rounded-input-box w-input-box text-17 border-dark-grey border-2 items-end">
              </div>
              <div class="flex items-center mt-4 mb-6">
                  <div class="grid grid-cols-2 w-full">
                      <div class="col-start-0">
                          <input type="checkbox" name="rememberMe" id="rememberMe" class="size-5">
                          <label for="rememberMe" class="ml-2 text-secondary">Remember Me</label>
                      </div>
                      <div class="justify-self-end">
                          <a href="" class="text-secondary leading-secondary text-light-mode-accent text-decoration-line: underline">Forgot Password?</a>
                      </div>
                  </div>
              </div>
                  <button id="localAuth" class="my-2 w-full">
                      <img src="/lightmode/login_button.svg" alt="Login Button">
                  </button>
              </div>
              <div id="divider" class="my-6">
                  <img src="/lightmode/orDivider.svg" alt="Divider">
              </div>
              <div class="flex items-center justify-between mt-4">
                  <div class="grid grid-cols-2 gap-2.5">
                      <form action="/auth/google">
                          <button>
                              <img src="/lightmode/google_icon.svg" alt="Google Icon">
                          </button>
                      </form>
                      <form action="/auth/facebook">
                          <button id="facebookAuth">
                              <img src="/lightmode/facebook_icon.svg" alt="Facebook Icon">
                          </button>
                      </form>
                  </div>
              </div>
          <div class="flex items-center justify-between mt-6 gap-1">
              <p class="text-secondary leading-secondary">Don't have an account?</p>
              <a href="/auth/register" class="text-secondary leading-secondary text-light-mode-accent text-decoration-line: underline">Sign up</a>
          </div>
      </div>
  </div>`;
}

async function displayCreateCircle() {
  nav.classList.add("hidden");
  pageName.innerHTML = `New Circle`;

  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="backButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/lightmode/next_button.svg" alt="Next Button" id="nextInviteFriends"></img>`;

  const pageContent = document.querySelector("#pageContent");
  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col justify-center items-center p-4 bg-light-mode rounded-lg w-full overflow-hidden">
        <div class="shrink-0 mt-14 mb-6 justify-center">
            <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer">                     
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
              <img src="/lightmode/divider.svg" alt="Divider">                          
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
                  <img id="privacyIcon" src="/lightmode/lock_icon.svg" alt="Lock icon" class="mr-4">
                  <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
                  <div class="peer relative h-5 w-10 rounded-full outline outline-1 outline-black after:absolute after:start-[2px] after:top-0 after:h-4 after:w-4 after:rounded-full after:bg-black after:border after:border-black after:transition-all after:content-[''] peer-checked:bg-cover peer-checked:bg-black border-2 peer-checked:outline-black peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:border-opacity-80 peer-checked:after:border-2 peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
                </label>
              </div>
            </div>
            <button id="addPicture" class="my-5">
              <img src="/add_picture.svg" alt="Add Picture Button" class="w-full">
            </button>
          </div>
        </div>
    </div>
    `;
  const circleNameInput = document.querySelector("#circleName");
  circleNameInput.value = newCircleNameInput;
  const addPictureButton = document.querySelector("#addPicture");
  const fileInput = document.querySelector("#fileUpload");
  const nextButton = document.querySelector("#nextButton");
  const circlePhoto = document.querySelector("#circleImage");

  circlePhoto.addEventListener("click", async function (event) {
    event.preventDefault();
    await fileInput.click();
  });

  addPictureButton.addEventListener("click", async function (event) {
    console.log("clicked add picture button");
    event.preventDefault();
    await fileInput.click();
  });

  fileInput.addEventListener("input", async function (event) {
    event.preventDefault();
    const res = await handleSelectFile();
    if (res) {
      circlePhoto.src = await res.data;
    }
    document.querySelector("#addPicture img").src =
      "/lightmode/change_picture.svg";
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

async function displayListOfFriends(friends) {
  let newArr = friends.map((friend) => {
    return `<div class="flex items-center my-5">
    <div class="flex-none w-58">
      <img class="rounded w-58 h-58" src="${friend.profilePicture}" alt="${friend.username}'s profile picture"></img>
    </div>
    <div class="ml-8 flex-none w-207">
      <h2 class="font-medium text-14 leading-tertiary">${friend.username}</h2>
      <h2 class="font-light text-14 text-dark-grey">${friend.username}</h2>
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

async function displayInviteFriends() {
  nav.classList.add("hidden");
  const friends = await getFriends(currentLocalUser);
  const friendsList = await displayListOfFriends(friends);
  pageName.innerHTML = "Invite Friends";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="circleBackButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/lightmode/next_button.svg" alt="Next Button" id="nextButton"></img>`;

  pageContent.innerHTML = `
      <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
        <p>search or add friends to collaborate with in</p>
        <p>your circle</p>
      </div>
      <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
        <div class="relative w-full h-9 mt-8">
          <form onkeydown="return event.key != 'Enter';">
            <input class="w-380 px-14 py-2 border-grey border-2 rounded-input-box" placeholder="search friends"/>
            <img src="/lightmode/search_icon_no_text.svg" alt="search icon" class="absolute left-4 top-2.5 w-6 h-6"/>
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
    if (checkbox.checked) {
      checkedFriends.push(checkbox.value);
    }
  });
}

async function displayCreateCirclePreview() {
  nav.classList.add("hidden");
  leftHeaderButton.innerHTML = `
      <img src="/lightmode/back_button.svg" alt="Back Button" id="circlePreviewBackButton"></img>
      `;

  pageName.innerHTML = "New Circle";

  const next = document.querySelector("#nextButton");
  next.id = "createCircleButton";
  next.src = "/lightmode/create_button.svg";

  pageContent.innerHTML = `
      <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
            <div class="flex-shrink-0 mt-20 mb-4">
                <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer">                     
            </div>
            <div class="flex justify-center my-5 relative w-full">
              <div class="flex justify-center items-center">
                  <input
                      type="text"
                      placeholder="add a name to your circle"
                      readonly
                      id="circleName"
                      class="bg-transparent text-2xl font-bold border-none text-center p-1 min-w-[50px] w-auto"
                  />
              </div>
              <button id="editButton" class="absolute right-0 top-0 mt-2 mr-1">
                  <img src="/lightmode/edit_icon.svg" alt="Edit Icon" />
              </button>
            </div>
            <div id="divider" class="mb-2">
                <img src="/lightmode/divider.svg" alt="Divider">                          
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
            <div class="flex items-center justify-between w-full">
              <div class="mt-10">
                <p class="font-bold text-26 leading-h2">added friends</p>
              </div>
            </div>
            <div class="flex items-center justify-between w-full">
              <div class="mt-10">
                <p class="text-body leading-tertiary">Most Recent Activity with:</p>
              </div>
            </div>
            </form>
          </div>
      </div>`;

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
      circlePhoto.src = await res.data;
    }
  });
  //This needs to be implemented when SPA creates the html for the privacy toggle

  privacyCheckbox.addEventListener("change", async function () {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    privacyIcon.src = "/lightmode/lock_icon.svg";
    privacyLabel.innerHTML = "Private";
    await updateCheckbox();
  });

  const circleNameInput = document.querySelector("#circleName");
  circleNameInput.value = newCircleNameInput;
}

async function displayExplore() {
  pageName.innerHTML = "Explore";
  leftHeaderButton.innerHTML = "";
  rightHeaderButton.innerHTML = `<img src="/lightmode/map_icon.svg" alt="Map Icon"</img>`;
  pageContent.innerHTML = `
    <div id="explorePage" class="flex flex-col justify-center py-2 w-full h-screen">
    </div>
    `;
  header.classList.remove("hidden");
  await displayNavBar();
}

async function displaySearch() {
  pageName.innerHTML = "Search";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  pageContent.innerHTML = `
    <div id="searchPage" class="flex flex-col py-2 w-full h-screen">
    <input type="text" id="searchBox">
      <div class="shrink-0 mt-10 mb-6 justify-center w-full">
        <div id="suggestedFriends"></div>
      </div>
    </div>
    `;
  const searchBox = document.querySelector("#searchBox");

  // this is to show all users when the page first loads
  const searchResult = await getSearchResult(searchBox.value);
  const suggestedFriends = document.querySelector("#suggestedFriends");
  suggestedFriends.innerHTML = displayUserSearch(searchResult.data).join("");

  searchBox.addEventListener("input", async (event) => {
    const searchResult = await getSearchResult(searchBox.value);
    suggestedFriends.innerHTML = displayUserSearch(searchResult.data).join("");
  });

  suggestedFriends.addEventListener("click", async (event) => {
    event.preventDefault();
    const target = event.target;
    const username = target.getAttribute("name");
    const method = target.getAttribute("method");
    switch (method) {
      case "Add Friend":
        const response = await sendFriendRequest(username, currentLocalUser);
        alert(response);
        await displaySearch();
        break;
      case "Remove Friend":
        const res = await unfriend(username, currentLocalUser);
        alert(res);
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
    let followStatus = "Add Friend";
    for (let friend of user.friendOf) {
      if (friend.friend_1_name === currentLocalUser) {
        followStatus = "Remove Friend";
      }
    }
    return `<div class="flex items-center my-5">
      <div class="flex-none w-58">
        <img class="rounded w-58 h-58" src="${user.profilePicture}" alt="${user.username}'s profile picture"></img>
      </div>
      <div class="ml-8 flex-none w-207">
        <h2 class="font-medium text-14 leading-tertiary">${user.username}</h2>
      </div>
      <div class="flex-none w-58">
        <form>
          <button name="${user.username}" method="${followStatus}" class="cursor-pointer">${followStatus}</button>
        </form>
      </div>
    </div>`;
  });
  return newArr;
}

async function displayActivity() {
  pageName.innerHTML = "Activity";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  const { friendRequests, circleInvites } = await getActivites(
    currentLocalUser
  );

  pageContent.innerHTML = `
    <div id="activityPage" class="flex flex-col py-2 w-full h-screen">
      <div class="shrink-0 mt-10 mb-6 w-full">
          <h1 class="font-bold text-20 leading-body">Friend Requests</h1>
          <div id="friendRequests"> </div>
      </div>
      <div class="shrink-0 mt-10 mb-6 w-full">
          <h1 class="font-bold text-20 leading-body">Circle Invites</h1>
          <div id="circleInvites"> </div>
      </div>
    </div>
    `;
  const friendRequestsDiv = document.querySelector("#friendRequests");
  friendRequestsDiv.innerHTML = displayFriendRequests(friendRequests);
  const circleInvitesDiv = document.querySelector("#circleInvites");
  circleInvitesDiv.innerHTML = displayCircleInvites(circleInvites);

  const activityPage = document.querySelector("#activityPage");
  activityPage.addEventListener("click", async (event) => {
    event.preventDefault();
    const target = event.target;
    const id = target.getAttribute("identifier");
    const invitee = target.getAttribute("sentTo");
    switch (target.name) {
      case "friendRequest":
        await acceptFriendRequest(id, invitee);
        await displayActivity();
        break;
      case "circleInvite":
        await acceptCircleInvite(id, invitee);
        await displayActivity();
        break;
      case "albumInvite":
        await acceptAlbumInvite(id, invitee);
        await displayActivity();
        break;
      default:
        console.log("DO NOTHING LOL");
        break;
    }
  });
}

async function displayNavBar() {
  const nav = document.querySelector("#nav");
  nav.classList.remove("hidden");
  nav.innerHTML = `<div class="border-b border-dark-grey"></div>
  
      <footer class="w-full flex justify-between items-center pt-4 pb-5 px-6 bg-light-mode-bg">
          
          <a href="" id="explore" class="flex flex-col items-center">        
              <img src="/lightmode/explore_icon.svg" alt="Explore Icon">             
          </a>
          <a href="" id="search" class="flex flex-col items-center">
              <img src="/lightmode/search_icon.svg" alt="Search Icon">   
          </a>
          <a href="" id="new" class="flex flex-col items-center">
              <img src="/lightmode/new_icon.svg" alt="New Icon">   
          </a>
          <a href="" id="activity" class="flex flex-col items-center">
              <img src="/lightmode/activity_icon.svg" alt="Activity Icon">           
          </a>
          <a href="" id="profile" class="flex flex-col items-center">
              <img src="/lightmode/profile_icon.svg" alt="Profile Icon">
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
      await displayExplore();
      newCircleNameInput = "";
    }
    if (searchButton) {
      await displaySearch();
      newCircleNameInput = "";
    }
    if (newButton) {
      modal.classList.remove("hidden");
      modal.classList.add("shown");
      newCircleNameInput = "";
    }
    if (activityButton) {
      await displayActivity();
      newCircleNameInput = "";
    }
    if (profileButton) {
      pageName.innerHTML = currentLocalUser;
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
      const { success, data } = await getListOfCircles();
      if (success && data) {
        const circleRender = await displayListOfCircles(data);
        await displayProfile(circleRender);
        //update friendCounter here via id when implemented
        //update profilePicture when implemented

        return;
      }
    }
  });
}

async function displayProfile(circleRender, albumRender) {
  pageContent.innerHTML = `
    <div id="profilePage" class="pt-8 pb-16 mb-4 w-full">
      <div class="flex justify-center mb-4">
        <img id="profilePicture" src="/placeholder_image.svg" class="w-110 h-110 object-cover rounded-full"></img>
      </div>
      <div class="flex justify-center">
        <h2 class="text-base text-center">@${currentLocalUser}</h2>
      </div>
      <div class="mt-6 mb-6 m-auto grid grid-cols-2 gap-4">
        <div class="grid grid-rows-2 gap-0 justify-center">
          <h2 class="text-base font-bold text-center">${
            circleRender.length
          }</h2>
          <h2 class="text-secondary text-center">Circles</h2>
        </div>
  
        <div class="grid grid-rows-2 gap-0 justify-center">
        <h2 class="text-base font-bold text-center" id="friendCounter">0</h2>
        <h2 class="text-secondary text-center">Friends</h2>
        </div>
      </div>
      <div class="flex flex-row justify-between">
        <div>
          <img id="albumTab" src="/lightmode/albumTab_deselected.svg" class="w-180 h-27 object-cover"></img>
        </div>
        <div>
          <img id="circleTab" src="/lightmode/circlesTab_selected.svg" class="w-180 h-27 object-cover"></img>
        </div>
      </div>
      <div id="albumList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 hidden">
      </div>
      <div id="circleList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 place-items-center">
      ${circleRender.join("")}
      </div>
      <div class="h-100"></div>
    </div>`;
  document
    .querySelector("#circleList")
    .addEventListener("click", async function (event) {
      const circleDiv = event.target.closest("div.circle");
      if (circleDiv) {
        if (circleDiv.hasAttribute("id")) {
          let { success, data, error } = await getCircle(circleDiv.id);
          if (success && data) {
            await displayCircle(data);
          }
        }
      }
    });
  await cleanUpSectionEventListener();
}

async function displayListOfCircles(data) {
  let newArr = data.map((obj) => {
    return `
        <div id="${obj.circle.id}" class="circle">
          <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover cursor-pointer border-circle border-black"/></img>
          <p class="text-center text-secondary">${obj.circle.name}</p>
        </div>`;
  });
  return newArr;
}

async function displayCreateAlbum() {
  pageName.innerHTML = `New Album`;

  leftHeaderButton.innerHTML = `
      <img src="/lightmode/close_icon.svg" alt="Close Button" id="closeButton"></img>
      `;
  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
    <div class="flex flex-col h-full w-full justify-center items-center">
      <div class="font-light text-11 text-center text-dark-grey w-full">
        <p>Select which photos you want to add to</p>
        <p>your album</p>
      </div>
  
      <div id="createNewAlbum" class="flex-1 flex flex-col justify-start items-center w-full">
        <div class="flex flex-col items-center">
          <form>
            <input id="fileUpload" type="file" class="hidden" multiple="false" />
          </form>
          <div class="flex justify-center mt-64 md:mt-52 mb-6">
            <img id="uploadIcon" src="/lightmode/upload_photo.svg" alt="Upload Icon" />
          </div>
          <div class="flex justify-center">
            <p class="text-base text-grey leading-body">drag and drop to&nbsp;</p>
            <p class="text-base underline text-grey leading-body cursor-pointer">upload</p>
          </div>
          <div class="flex justify-center mt-4 mb-96">
            <p class="text-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
          </div>
        </div>
      </div>
    </div>`;

  const uploadSection = document.querySelector("#createNewAlbum");

  const fileInput = document.querySelector("#fileUpload");

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute("listener") !== true) {
    fileInput.addEventListener("input", async function (event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = await uploadFile(files[i]);
        albumPhotos.push(file);
      }
      console.log("Files uploaded:", albumPhotos);
      console.log(files.length);
      if (files.length > 0) {
        await displayCreateAlbumPreview(albumPhotos);
        await cleanUpSectionEventListener();
      }
    });
  }

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  uploadSection.classList.remove("imageUploadSection");
}

function displayCreateAlbumPreview(albumPhotos) {
  console.log(albumPhotos);

  pageName.textContent = "New Album";

  leftHeaderButton.innerHTML = `<img src="/lightmode/close_icon.svg" alt="Close Button" id="closeButton">`;
  rightHeaderButton.innerHTML = `<img src="/lightmode/next_button.svg" alt="Next Button" id="albumNext">`;

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  const mappedPhotos = albumPhotos.map((obj) => {
    return {
      photoSrc: obj.data,
    };
  });
  console.log("Mapped photos:", mappedPhotos);
  console.log(albumPhotos);
  albumObj.photos = mappedPhotos;

  mappedPhotos.forEach((photo, index) => {
    console.log(
      `Creating slide ${index + 1} for photo with src: ${photo.photoSrc}`
    );

    const slideDiv = document.createElement("div");
    slideDiv.className = "keen-slider__slide";

    const img = document.createElement("img");
    img.className = "rounded-12.75 h-image w-image object-cover";
    img.src = photo.photoSrc;
    img.alt = `image ${index}`;

    slideDiv.appendChild(img);

    carouselDiv.appendChild(slideDiv);
  });

  const pageContent = document.querySelector("#pageContent");
  pageContent.innerHTML = `
    <div class="flex flex-col h-full w-full items-center">
      <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
        <p>select which photos you want to add to</p>
        <p class="">your album</p>
      </div>
      <div id="createNewAlbum" class="flex-1 flex-col items-center bg-light-mode w-430 overflow-hidden p-2">
        <div class="w-full">
          
        </div>
        <div class="w-full mt-3">
          <h1 class="text-h2 leading-h2 font-medium">Upload more files<h1>
        </div>
        <div id="dropMore" class="flex flex-col items-center bg-light-grey w-full h-full overflow-hidden mt-3 p-5 border-t border-spacing-2 border-dashed border-grey">
          <form class="hidden">
            <input id="fileUpload" type="file" class="hidden" multiple="false"/>
          </form>
          <div class="flex justify-center mt-24 md:mt-16 mb-5">
            <img id="uploadIcon" src="/lightmode/upload_photo_grey.svg" alt="Upload Icon"/>
          </div>
          <div class="flex justify-center">
            <p class="text-base text-dark-grey leading-body">drag and drop to&nbsp;</p>
            <p class="text-base underline text-dark-grey leading-body cursor-pointer">upload</p>
          </div>
          <div class="flex justify-center mt-4">
            <p class="text-dark-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
          </div>
        </div>
        </div>
      </div>`;

  const createNewAlbum = document.querySelector("#createNewAlbum div.w-full");
  createNewAlbum.appendChild(carouselDiv);

  function navigation(slider) {
    let wrapper, dots;

    function createDiv(className) {
      const div = document.createElement("div");
      className.split(" ").forEach((name) => div.classList.add(name));
      return div;
    }

    function setupWrapper() {
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function setupDots() {
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        const dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    slider.on("created", () => {
      setupWrapper();
      setupDots();
    });

    slider.on("slideChanged", () => {
      if (dots && dots.children) {
        const currentIndex = slider.track.details.rel;
        Array.from(dots.children).forEach((dot, idx) => {
          dot.classList.toggle("dot--active", idx === currentIndex);
        });
      }
    });
  }

  const slider = new KeenSlider(
    "#carousel",
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: 2,
        spacing: 15,
      },
      loop: false,
      initial: 0,
      drag: true,
      dragStartThreshold: 10,
    },
    [navigation]
  );

  const uploadSection = document.querySelector("#dropMore");
  const fileInput = document.querySelector("#fileUpload");
  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute("listener") !== true) {
    fileInput.addEventListener("input", async function (event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = await uploadFile(files[i]);
        albumPhotos.push(file);
      }
      console.log("Files uploaded:", albumPhotos);
      console.log(files.length);
      if (files.length > 0) {
        await displayCreateAlbumPreview(albumPhotos);
        await cleanUpSectionEventListener();
      }
    });
  }

  if (uploadSection.getAttribute("listener") !== true) {
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  uploadSection.classList.remove("imageUploadSection");
}

async function displayAlbumConfirmation() {
  nav.classList.add("hidden");
  console.log(albumObj);

  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="albumConfirmationBackButton"></img>`;

  pageName.innerHTML = "Post";

  rightHeaderButton.innerHTML = `<img src="/lightmode/create_button.svg" alt="Create Button" id="createAlbum"></img>`;

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  albumObj.photos.forEach((photo, index) => {
    console.log(
      `Creating slide ${index + 1} for photo with src: ${photo.photoSrc}`
    );

    const slideDiv = document.createElement("div");
    slideDiv.className = "keen-slider__slide";

    const img = document.createElement("img");
    img.className = "rounded-12.75 h-image w-image object-cover";
    img.src = photo.photoSrc;
    img.alt = `image ${index}`;

    slideDiv.appendChild(img);

    carouselDiv.appendChild(slideDiv);
  });

  pageContent.innerHTML = `
      <div id="albumConfirmation" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
        <div id="albumCarousel" class="flex-1 flex flex-col justify-between w-full px-4 m-40">
          <div class="w-full">
          
          </div>
        </div>
        <div id="albumCircle"class="flex flex-row justify-center items-center ml-4 w-full">
          <img id="circleImage" class="w-62 h-62 rounded-full" src="/placeholder_image.svg"></img>
          <div class="flex flex-col ml-4">
            <h2 id="circleName" class="text-20 font-medium mr-2.5"></h2>
            <button id="editButton">
              <p class="text-light-mode-accent underline text-secondary">Edit<p>
            </button>
          </div>
        </div>
        <div class="flex-1 flex flex-col justify-between w-full px-4 mt-40">
          <form class="flex flex-col" onkeydown="return event.key != 'Enter';">
            <div class="flex items-center mt-4 mb-28">
                <label for="albumName" class="font-medium text-h2 mr-6">Title</label>
                <input
                type="text"
                placeholder="add a title to your album"
                id="albumName"
                class="w-full bg-transparent text-h2 text-text-grey font-light items-end border-none"
                required
                />
            </div>
          </form>
        </div>
        <div class="flex items-center justify-between w-full">
          <div class="mt-10">
            <p class="font-bold text-26 leading-h2 hidden">Edit</p>
          </div>
        </div>
        </div>
      </div>`;

  const circleImage = document.querySelector("#circleImage");
  console.log(albumObj.circleSrc);

  circleImage.src = albumObj.circleSrc;
  circleName.textContent = albumObj.circleName;

  const createNewAlbum = document.querySelector("#albumCarousel div.w-full");
  createNewAlbum.appendChild(carouselDiv);

  function navigation(slider) {
    let wrapper, dots;

    function createDiv(className) {
      const div = document.createElement("div");
      className.split(" ").forEach((name) => div.classList.add(name));
      return div;
    }

    function setupWrapper() {
      wrapper = createDiv("navigation-wrapper");
      slider.container.parentNode.appendChild(wrapper);
      wrapper.appendChild(slider.container);
    }

    function setupDots() {
      dots = createDiv("dots");
      slider.track.details.slides.forEach((_e, idx) => {
        const dot = createDiv("dot");
        dot.addEventListener("click", () => slider.moveToIdx(idx));
        dots.appendChild(dot);
      });
      wrapper.appendChild(dots);
    }

    slider.on("created", () => {
      setupWrapper();
      setupDots();
    });

    slider.on("slideChanged", () => {
      if (dots && dots.children) {
        const currentIndex = slider.track.details.rel;
        Array.from(dots.children).forEach((dot, idx) => {
          dot.classList.toggle("dot--active", idx === currentIndex);
        });
      }
    });
  }

  const slider = new KeenSlider(
    "#carousel",
    {
      loop: true,
      mode: "free-snap",
      slides: {
        origin: "center",
        perView: 2,
        spacing: 15,
      },
      loop: false,
      initial: 0,
      drag: true,
      dragStartThreshold: 10,
    },
    [navigation]
  );
}

async function displayCircle(circleData) {
  leftHeaderButton.innerHTML = `
    <img src="/lightmode/back_button.svg" alt="Back Button" id="backButton"></img>
    `;
  rightHeaderButton.innerHTML = "";
  pageName.innerHTML = "";
  const memberList = circleData.members.map((obj) => {
    return `<img src="${obj.user.profilePicture}" class="w-42 h-42 rounded-full object-cover"></img>`;
  });
  console.log(circleData.circle.albums);
  const albumList = circleData.circle.albums.map((obj) => {
    return `
      <div class="w-full h-min relative album" id="${obj.id}">
        <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0].src}"/>
        <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
          <p class="text-light-mode-bg">${obj.name}</p>
        </div>
        <div class="absolute inset-0 flex items-end justify-end gap-1 p-2">
          <img src="/like_icon.svg" alt="Like Icon"></img>
          <img src="/comment_icon.svg" alt="Comment Icon"></img>
        </div>
      </div>`;
  });
  console.log(albumList);

  pageContent.innerHTML = `
    <div class="w-full px-0 mx-0">
      <div class="flex justify-center mt-6 mb-1.5">
        <img src="${
          circleData.circle.picture
        }" class="rounded-full w-180 h-180 object-cover"/></img>
      </div>
      <div class="mb-3">
        <p class="text-center text-20 font-bold">${circleData.circle.name}</p>
      </div>
      <div class="grid grid-cols-1 place-items-center">
        <label class="inline-flex items-center cursor-pointer">
            <img id="privacyIcon" src="/lightmode/lock_icon.svg" alt="Lock icon" class="mr-4">
            <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
        </label>
      </div>
      <div class="grid grid-cols-5 place-items-center mt-12 mb-2">
        <p class="grid-span-1 text-base font-medium">${
          circleData.members.length
        } Friends</p>
      </div>
      <div class="flex gap-2">
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

  const albumListTarget = document.querySelector("#albumList");
  albumListTarget.addEventListener("click", async function (event) {
    event.preventDefault();
    const albumDiv = event.target.closest(".album");
    if (albumDiv) {
      if (albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id);
        if (success && data) {
          await displayAlbum(data);
        }
      }
    }
  });
}

function displayCircleInvites(circleInvites) {
  if (circleInvites.length === 0) {
    return `<div class="flex items-center my-5">
        <div class="ml-8 flex-none w-207">
          <h2 class="font-medium text-14 leading-tertiary">No circle invites. Maybe go out and have fun XD? 😂😂😂</h2>
        </div>
      </div>`;
  }
  let newArr = circleInvites.map((invite) => {
    return `<div class="flex items-center my-5">
      <div class="flex-none w-58">
        <img class="rounded w-58 h-58" src="${invite.circle.picture}" alt="${invite.circle.name}'s picture"></img>
      </div>
      <div class="ml-8 flex-none w-207">
        <h2 class="font-medium text-14 leading-tertiary">${invite.circle.name}</h2>
      </div>
      <div class="flex-none w-58">
        <form>
          <button identifier="${invite.circle.id}" sentTo="${invite.invitee_username}" name="circleInvite" class="cursor-pointer">Accept</button>
        </form>
      </div>
    </div>`;
  });
  return newArr;
}

async function displayAlbum(albumData) {
  console.log(albumData);
  leftHeaderButton.innerHTML = `
    <span id="${albumData.circle.id}">
    <img src="/lightmode/back_button_icon.svg" alt="Back Button" id="backButtonAlbum"></img>
    </span
    `;
  rightHeaderButton.innerHTML = ``;

  pageName.innerHTML = `${albumData.name}`;

  const memberList = albumData.circle.UserCircle.map((obj) => {
    return `<img src="${obj.user.profilePicture}" class="w-16 h-16 rounded-full object-cover"></img>`;
  });
  const photoList = albumData.photos.map((obj) => {
    return `<div id="photo" class="w-full h-min relative photo" albumId="${obj.id}">
      <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.src}"/>
    </div>`;
  });

  pageContent.innerHTML = `
      <div id="albumPhotos">
        <div id="memberList" class="flex mt-8 justify-center">
          ${memberList.join("")}
        </div>
        <div class="mt-4">
          <p class="flex justify-center font-medium text-lg">${
            albumData.circle.name
          }</p>
        </div>
        <div class="grid grid-cols-5 place-items-center mt-12 mb-2 mr-0">
          <p class="grid-span-1 text-base font-medium">${
            albumData.photos.length
          } Photos</p>
        </div>
        <div id="photoList" class="pb-28 w-full">
          <div class="columns-2 gap-4 space-y-4 grid-flow-row">
            ${photoList.join("")}
          </div>
        </div>
    </div>`;
  const albumPhotos = document.querySelector("#albumPhotos");
  console.log("THIS", albumPhotos);
  albumPhotos.addEventListener("click", async (event) => {
    const photo = event.target.closest("#photo img");
    const overlay = event.target.closest("#photoOverlay");
    if (photo) {
      console.log(photo.src);
      await displayPhoto(photo.src);
    }

    if (overlay) {
      const img = event.target.closest("#image");
      if (img) {
        event.stopPropagation();
      } else {
        overlay.remove();
      }
    }
  });
}

function displayFriendRequests(friendRequest) {
  if (friendRequest.length === 0) {
    return `<div class="flex items-center my-5">
        <div class="ml-8 flex-none w-207">
          <h2 class="font-medium text-14 leading-tertiary">No friend requests. Maybe go make some friends XD? 😂😂😂</h2>
        </div>
      </div>`;
  }
  let newArr = friendRequest.map((request) => {
    return `<div class="flex items-center my-5">
      <div class="flex-none w-58">
        <img class="rounded w-58 h-58" src="${request.requester.profilePicture}" alt="${request.requester.username}'s profile picture"></img>
      </div>
      <div class="ml-8 flex-none w-207">
        <h2 class="font-medium text-14 leading-tertiary">${request.requesterName}</h2>
      </div>
      <div class="flex-none w-58">
        <form>
          <button identifier="${request.requesterName}" sentTo="${request.requesteeName}" name="friendRequest" class="cursor-pointer">Accept</button>
        </form>
      </div>
    </div>`;
  });
  return newArr;
}

async function displayPhoto(photoSrc) {
  const albumPhotos = document.querySelector("#albumPhotos");
  const photoDiv = document.createElement("div");
  photoDiv.className =
    "absolute top-0 left-0 bg-overlay-bg h-screen w-screen flex justify-center items-center mx-auto z-20";
  photoDiv.id = "photoOverlay";
  const personalView = document.createElement("img");
  personalView.src = `${photoSrc}`;
  personalView.id = "image";
  personalView.className = "max-w-sm object-cover rounded-xl";

  photoDiv.appendChild(personalView);
  albumPhotos.appendChild(photoDiv);
}
