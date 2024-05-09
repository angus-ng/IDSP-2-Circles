const pageName = document.querySelector("#pageName");
const pageContent = document.querySelector("#pageContent");
const leftHeaderButton = document.querySelector("#leftButton");
const rightHeaderButton = document.querySelector("#rightButton");

let currentLocalUser;
let isPrivacyPublic = false;
let newCircleNameInput = "";
let isEditable = false;
let addPictureSrc;
let circleImgSrc;
let albumPhotos = [];
let albumObj = {};

async function initiatePage() {
  const username = await getSessionFromBackend();
  currentLocalUser = username;
  console.log(username);
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

function displayLoginPage() {
  pageContent.innerHTML = `
  <div id="loginPage" class="flex flex-col items-center rounded-lg w-full z-10">
    <div class="flex-shrink-0 mt-2 mb-6">
        <img src="/logo_with_wordmark_light.svg" alt="Logo with Wordmark">  
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
                    <img src="/login_button_light.svg" alt="Login Button">
                </button>
            </div>
            <div id="divider" class="my-6">
                <img src="/orDivider_light.svg" alt="Divider">
            </div>
            <div class="flex items-center justify-between mt-4">
                <div class="grid grid-cols-2 gap-2.5">
                    <form action="/auth/google">
                        <button>
                            <img src="/google_icon_light.svg" alt="Google Icon">
                        </button>
                    </form>
                    <form action="/auth/facebook">
                        <button id="facebookAuth">
                            <img src="/facebook_icon_light.svg" alt="Facebook Icon">
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

const header = document.querySelector("header");
header.addEventListener("click", async (event) => {
  const nextButtonInviteFriends = event.target.closest("#nextInviteFriends");
  const nextButton = event.target.closest("#nextButton");
  const backButton = event.target.closest("#backButton");
  const circleBackButton = event.target.closest("#circleBackButton");
  const circlePreviewBackButton = event.target.closest("#circlePreviewBackButton");
  const createCircleButton = event.target.closest("#createCircleButton");
  const closeButton = event.target.closest("#closeButton");
  const albumNextButton = event.target.closest("#albumNext");
  const backButtonAlbum = event.target.closest("#backButtonAlbum");
  const createAlbumButton = event.target.closest("#createAlbum");
  const albumConfirmationBackButton = event.target.closest("#albumConfirmationBackButton");
  const addCircleBackButton = event.target.closest("#addCircleBackButton");

  if (nextButtonInviteFriends) {
    const circleName = document.querySelector("#circleName");
    newCircleNameInput = circleName.value;
    circleImgSrc = document.querySelector("#circleImage").src;
    addPictureSrc = document.querySelector("#addPicture img").src;
    isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
    await displayInviteFriends();
    return;
  }

  if (nextButton) {
    await displayCreateCirclePreview();
    circleName.value = newCircleNameInput;
    document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
    document.querySelector("#circleImage").src = circleImgSrc;
    await updateCheckbox();
    return;
  }

  if (createCircleButton) {
    console.log("yes");
    const { success, data } = await handleCreateCircle();
    const circleId = data;
    if (success && data) {
      const { success, data, error } = await getCircle(circleId)
      if (success && data) {
        await displayCircle(data)
      }
    }
    nav.classList.remove("hidden");
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
    document.querySelector("#addPicture img").src = addPictureSrc;
    circleName.value = newCircleNameInput;
    await updateCheckbox();
    return;
  }

  if (closeButton) {
    newCircleNameInput = "";
    pageName.innerHTML = "Explore";
    pageContent.innerHTML = "";
    leftHeaderButton.innerHTML = "";
    rightHeaderButton.innerHTML = `<img src="/map_icon_light.svg" alt="Map Icon"</img>`;
    return;
  }

  if (albumNextButton) {
    const { success, data } = await getListOfCircles();
    if (success && data) {
      const circleRender = await displayListOfCircles(data);
      console.log(circleRender)
      showCreateOrAddToCircle(circleRender);
      return;
    }
  }

  if (addCircleBackButton) {
    await displayCreateAlbumPreview(albumPhotos);
  }

  if (backButtonAlbum) {
    const span = event.target.closest("span")
    if (span) {
      if (span.hasAttribute("id")){
        let { success, data, error } = await getCircle(span.id)
        if (success && data) {
          await displayCircle(data)
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
    const { success, data } = await getListOfCircles();
    if (success && data) {
      const circleRender = await displayListOfCircles(data);
      console.log(circleRender)
      showCreateOrAddToCircle(circleRender);
      return;
    }
  }

  if (createAlbumButton) {
    console.log("album created");
    const albumName = await getAlbumName();
    albumObj.name = albumName;
    const { success, data } = await handleCreateAlbum(albumObj);
    const albumId = data;
    if (success && data) {
      const { success, data, error } = await getAlbum(albumId);
      if (success && data) {
        console.log(data)
        await displayAlbum(data);
      }
    }
    nav.classList.remove("hidden");
    return;
  }
});

// create Cirlcle/Album modal
const modal = document.querySelector("#modal");
modal.addEventListener("click", async function (event) {
  event.preventDefault();
  const closeModal = event.target.closest("#closeModalButton");
  const createAlbumModalButton = event.target.closest(
    "#createAlbumModalButton"
  );
  const createCircleModalButton = event.target.closest(
    "#createCircleModalButton"
  );

  if (closeModal) {
    if (modal.classList.contains("shown")) {
      modal.classList.remove("shown");
      modal.classList.add("hidden");
    }
  }

  if (createAlbumModalButton) {
    clearNewAlbum()
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    await displayCreateAlbum();
  }

  if (createCircleModalButton) {
    clearNewAlbum()
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    await displayCreateCircle();
    await cleanUpSectionEventListener();
  }
});

// const facebookAuthButton = document.querySelector("#facebookAuth");
// facebookAuthButton.addEventListener("click", async function (event) {
//     event.preventDefault();
//     let { success, data, error } = await facebookAuth();
//     if (success) {
//         await displayExplore()
//     }
// })

// async function facebookAuth () {
//     const response = await fetch("/auth/facebook");
//     const jsonResponse = await response.json()

//     if (!response.ok) {
//         return { success: false, error: "Error with facebook OAuth"};
//     }

//     return jsonResponse;
// }

// delagate event
// const localAuthButton = document.querySelector("#localAuth");
// console.log(localAuthButton);
// localAuthButton.addEventListener("click", async function () {
//   console.log("login");
//   let { success, data, error } = await localAuth();
//   if (success && data) {
//     console.log(data);
//     currentLocalUser = data;
//     await displayExplore();
//   }
// });

async function handleLocalAuth() {
  let { success, data, error } = await localAuth();
  if (success && data) {
    console.log(data);
    currentLocalUser = data;
    await displayExplore();
  }
}

function toggleEdit() {
  isEditable = !isEditable;

  if (isEditable) {
    circleName.removeAttribute("readonly");
    return circleName.focus();
  }

  circleName.setAttribute("readonly", true);
}

pageContent.addEventListener("click", (event) => {
  const localAuthButton = document.querySelector("#localAuth");
  const editButton = event.target.closest("#editButton");
  const parentId = event.target.parentElement.id;
  const uploadPhotoSection = event.target.closest("#createNewAlbum");

  if (parentId === "editButton") {
    toggleEdit();
  } else if (parentId === "localAuth") {
    handleLocalAuth();
  }

  // if (uploadPhotoSection) {
  //   displayCreateAlbumPreview();
  // }
});

async function displayCreateCircle() {
  nav.classList.add("hidden");
  pageName.innerHTML = `New Circle`;

  leftHeaderButton.innerHTML = `<img src="/back_button_icon_light.svg" alt="Back Button" id="backButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/next_button_light.svg" alt="Next Button" id="nextInviteFriends"></img>`;

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
              <img src="/divider_light.svg" alt="Divider">                          
          </div>
            <input id="myInput" type="file" class="hidden" multiple=false />
            <div class="flex items-center justify-between mt-2 mb-2">
              <div>
                <p class="font-medium text-h2 leading-h2">Private or Public</p>
                <p class="text-14 leading-body">Make new circle private or public</p>
              </div>
              <div>
                <label class="inline-flex items-center cursor-pointer">
                  <input id="privacyCheckbox" type="checkbox" value="" class="sr-only peer">
                  <img id="privacyIcon" src="/lock_icon_light.svg" alt="Lock icon" class="mr-4">
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
  const fileInput = document.querySelector("#myInput");
  const nextButton = document.querySelector("#nextButton");
  const circlePhoto = document.querySelector("#circleImage");

  circlePhoto.addEventListener("click", async function(event) {
    event.preventDefault();
    await fileInput.click();
  })

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
    document.querySelector("#addPicture img").src = "/change_picture_light.svg";
  });

  privacyCheckbox.addEventListener("change", async function () {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    privacyIcon.src = "/lock_icon_light.svg";
    privacyLabel.innerHTML = "Private";
    updateCheckbox();
  });
  return;
}

async function displayInviteFriends() {
  nav.classList.add("hidden");
  pageName.innerHTML = "Invite Friends";
  leftHeaderButton.innerHTML = `<img src="/back_button_icon_light.svg" alt="Back Button" id="circleBackButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/next_button_light.svg" alt="Next Button" id="nextButton"></img>`;
  
    pageContent.innerHTML = `
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
      <p>search or add friends to collaborate with in</p>
      <p>your circle</p>
    </div>
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
      <div class="relative w-full h-9 mt-8">
        <form onkeydown="return event.key != 'Enter';">
          <input class="w-380 px-14 py-2 border-grey border-2 rounded-input-box" placeholder="search friends"/>
          <img src="/search_icon_light_no_text.svg" alt="search icon" class="absolute left-4 top-2.5 w-6 h-6"/>
        </form>
      </div>
      <div class="shrink-0 mt-10 mb-6 justify-center w-full">
        <h1 class="font-bold text-20 leading-body">Suggested Friends</h1>
        <div id="suggestedFriends">
          <div class="flex items-center my-5">
            <div class="flex-none w-58">
              <img class="rounded w-58 h-58" src="/placeholder_image.svg" alt="friend profile picture"></img>
            </div>
            <div class="ml-8 flex-none w-207">
              <h2 class="font-medium text-14 leading-tertiary">username</h2>
              <h2 class="font-light text-14 text-dark-grey">display name</h2>
            </div>
            <div class="flex-none w-58">
              <form>
                <input type="checkbox" id="add" name="add" class="cursor-pointer">
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
}

async function displayCreateCirclePreview() {
  nav.classList.add("hidden");
  leftHeaderButton.innerHTML = `
    <img src="/back_button_icon_light.svg" alt="Back Button" id="circlePreviewBackButton"></img>
    `;
  
  pageName.innerHTML = "New Circle";

  const next = document.querySelector("#nextButton");
  next.id = "createCircleButton";
  next.src = "/create_button_light.svg";

  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
          <div class="flex-shrink-0 mt-20 mb-4">
              <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer">                     
          </div>
          <div class="flex justify-center my-5 relative w-full">
            <div class="flex justify-center items-center">
                <input
                    type="text"
                    value="Sample Text"
                    readonly
                    id="circleName"
                    class="bg-transparent text-2xl font-bold border-none text-center p-1 min-w-[50px] w-auto"
                />
            </div>
            <button id="editButton" class="absolute right-0 top-0 mt-2 mr-1">
                <img src="/edit_icon_light.svg" alt="Edit Icon" />
            </button>
          </div>
          <div id="divider" class="mb-2">
              <img src="/divider_light.svg" alt="Divider">                          
          </div>
          <input id="myInput" type="file" class="hidden" multiple=false/>
          <div class="flex items-center justify-between w-full">
              <div>
                  <p class="font-medium text-h2 leading-h2">Private or Public</p>
                  <p class="text-body leading-tertiary text-dark-grey">Make new circle private or public</p>
              </div>
              <div>
                  <label class="inline-flex items-center cursor-pointer">
                      <input id="privacyCheckbox" type="checkbox" value="" class="sr-only peer">
                      <img id="privacyIcon" src="/lock_icon_light.svg" alt="Lock icon" class="mr-4">
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

  const fileInput = document.querySelector("#myInput");
  const circlePhoto = document.querySelector("#circleImage");
  document.querySelector("#circleImage").addEventListener("click", async function(event) {
      event.preventDefault();
      await fileInput.click();
    })
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
    privacyIcon.src = "/lock_icon_light.svg";
    privacyLabel.innerHTML = "Private";
    await updateCheckbox();
  });

  const circleNameInput = document.querySelector("#circleName");
  circleNameInput.value = newCircleNameInput;
}

async function displayExplore() {
  pageName.innerHTML = "Explore";
  leftHeaderButton.innerHTML = "";
  rightHeaderButton.innerHTML = `<img src="/map_icon_light.svg" alt="Map Icon"</img>`;
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
  <div id="searchPage" class="flex flex-col justify-center py-2 w-full h-screen">
  </div>
  `;
}

async function displayActivity() {
  pageName.innerHTML = "Activity";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  pageContent.innerHTML = `
  <div id="activityPage" class="flex flex-col justify-center py-2 w-full h-screen">
  </div>
  `;
}

async function displayNavBar() {
  const nav = document.querySelector("#nav");
  nav.classList.remove("hidden");
  nav.innerHTML = `<div class="border-b border-dark-grey"></div>

    <footer class="w-full flex justify-between items-center pt-4 pb-5 px-6 bg-light-mode-bg">
        
        <a href="" id="explore" class="flex flex-col items-center">        
            <img src="/explore_icon_light.svg" alt="Explore Icon">             
        </a>
        <a href="" id="search" class="flex flex-col items-center">
            <img src="/search_icon_light.svg" alt="Search Icon">   
        </a>
        <a href="" id="new" class="flex flex-col items-center">
            <img src="/new_icon_light.svg" alt="New Icon">   
        </a>
        <a href="" id="activity" class="flex flex-col items-center">
            <img src="/activity_icon_light.svg" alt="Activity Icon">           
        </a>
        <a href="" id="profile" class="flex flex-col items-center">
            <img src="/profile_icon_light.svg" alt="Profile Icon">
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
async function updateCheckbox() {
  if (document.querySelector("#privacyCheckbox").checked) {
    privacyIcon.src = "/globe_icon_light.svg";
    privacyLabel.innerHTML = "Public";
    return;
  }
}

async function getListOfCircles() {
  const response = await fetch("/circle/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

async function displayProfile(circleRender, albumRender){
  pageContent.innerHTML = `
  <div id="profilePage" class="container pt-8 pb-16 mb-4 w-full">
    <div class="flex justify-center mb-4">
      <img id="profilePicture" src="/placeholder_image.svg" class="w-110 h-110 object-cover rounded-full"></img>
    </div>
    <div class="flex justify-center">
      <h2 class="text-base text-center">@${currentLocalUser}</h2>
    </div>
    <div class="mt-6 mb-6 m-auto grid grid-cols-2 gap-4">
      <div class="grid grid-rows-2 gap-0 justify-center">
        <h2 class="text-base font-bold text-center">${circleRender.length}</h2>
        <h2 class="text-secondary text-center">Circles</h2>
      </div>

      <div class="grid grid-rows-2 gap-0 justify-center">
      <h2 class="text-base font-bold text-center" id="friendCounter">0</h2>
      <h2 class="text-secondary text-center">Friends</h2>
      </div>
    </div>
    <div class="flex flex-row justify-between">
      <div>
        <img id="albumTab" src="/albumTab_deselected_light.svg" class="w-180 h-27 object-cover"></img>
      </div>
      <div>
        <img id="circleTab" src="/circlesTab_selected_light.svg" class="w-180 h-27 object-cover"></img>
      </div>
    </div>
    <div id="albumList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 hidden">
    </div>
    <div id="circleList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 place-items-center">
    ${circleRender.join("")}
    </div>
    <div class="h-100"></div>
  </div>`;
  document.querySelector("#circleList").addEventListener("click", async function (event){
    const circleDiv = event.target.closest("div.circle")
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")){
        let { success, data, error } = await getCircle(circleDiv.id)
        if (success && data) {
          await displayCircle(data)
        }
      }
    }
  })
  await cleanUpSectionEventListener()
}

async function displayListOfCircles(data) {
  // console.log(data)
  let newArr = data.map((obj) => {
    return `
      <div id="${obj.circle.id}" class="circle">
        <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover cursor-pointer border-circle border-black"/></img>
        <p class="text-center text-secondary">${obj.circle.name}</p>
      </div>`;
  });
  return newArr
}

async function displayCreateAlbum () {
  pageName.innerHTML = `New Album`;

  leftHeaderButton.innerHTML = `
    <img src="/close_icon_light.svg" alt="Close Button" id="closeButton"></img>
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
          <input id="myInput" type="file" class="hidden" multiple="false" />
        </form>
        <div class="flex justify-center mt-64 md:mt-52 mb-6">
          <img id="uploadIcon" src="/upload_photo_light.svg" alt="Upload Icon" />
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

  const fileInput = document.querySelector("#myInput");
  
  if (uploadSection.getAttribute('listener') !== true){
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute('listener') !== true) {
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

  if (uploadSection.getAttribute('listener') !== true){
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  uploadSection.classList.remove("imageUploadSection");
}

function displayCreateAlbumPreview(albumPhotos) {
  console.log(albumPhotos);

  pageName.textContent = "New Album";

  leftHeaderButton.innerHTML = `<img src="/close_icon_light.svg" alt="Close Button" id="closeButton">`;
  rightHeaderButton.innerHTML = `<img src="/next_button_light.svg" alt="Next Button" id="albumNext">`;

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  const mappedPhotos = albumPhotos.map((obj) => {
    return {
      photoSrc: obj.data
    };
  });
  console.log("Mapped photos:", mappedPhotos);
  console.log(albumPhotos);
  albumObj.photos = mappedPhotos;

  mappedPhotos.forEach((photo, index) => {
    console.log(`Creating slide ${index + 1} for photo with src: ${photo.photoSrc}`);

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
      <div class="flex flex-col items-center bg-light-grey w-full h-full overflow-hidden mt-3 p-5 border-t border-spacing-2 border-dashed border-grey">
        <form class="hidden">
          <input id="myInput" type="file" class="hidden" multiple="false"/>
        </form>
        <div class="flex justify-center mt-24 md:mt-16 mb-5">
          <img id="uploadIcon" src="/upload_photo_grey_light.svg" alt="Upload Icon"/>
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
    
    const slider = new KeenSlider("#carousel", {
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
      dragStartThreshold: 10
    }, [navigation]);
}

async function displayAlbumConfirmation() {
  nav.classList.add("hidden");
  console.log(albumObj);

  leftHeaderButton.innerHTML = `<img src="/back_button_icon_light.svg" alt="Back Button" id="albumConfirmationBackButton"></img>`;
  
  pageName.innerHTML = "Post";

  rightHeaderButton.innerHTML = `<img src="/create_button_light.svg" alt="Create Button" id="createAlbum"></img>`;

  const carouselDiv = document.createElement("div");
  carouselDiv.id = "carousel";
  carouselDiv.className = "keen-slider overflow-hidden";

  albumObj.photos.forEach((photo, index) => {
    console.log(`Creating slide ${index + 1} for photo with src: ${photo.photoSrc}`);

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
    
    const slider = new KeenSlider("#carousel", {
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
      dragStartThreshold: 10
    }, [navigation]);
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

async function displayCircle(circleData) { 
  leftHeaderButton.innerHTML = `
  <img src="/back_button_icon_light.svg" alt="Back Button" id="backButton"></img>
  `;
  rightHeaderButton.innerHTML = "";
  pageName.innerHTML = ""
  const memberList = circleData.members.map((obj) => {
    return `<img src="${obj.user.profilePicture}" class="w-42 h-42 rounded-full object-cover"></img>`
  })
  console.log(circleData.circle.albums)
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
    </div>`
  })
  console.log(albumList)

  pageContent.innerHTML = `
  <div class="w-full px-0 mx-0">
    <div class="flex justify-center mt-6 mb-1.5">
      <img src="${circleData.circle.picture}" class="rounded-full w-180 h-180 object-cover"/></img>
    </div>
    <div class="mb-3">
      <p class="text-center text-20 font-bold">${circleData.circle.name}</p>
    </div>
    <div class="grid grid-cols-1 place-items-center">
      <label class="inline-flex items-center cursor-pointer">
          <img id="privacyIcon" src="/lock_icon_light.svg" alt="Lock icon" class="mr-4">
          <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
      </label>
    </div>
    <div class="grid grid-cols-5 place-items-center mt-12 mb-2">
      <p class="grid-span-1 text-base font-medium">${circleData.members.length} Friends</p>
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
  </div>`

  const albumListTarget = document.querySelector("#albumList")
  albumListTarget.addEventListener("click", async function (event) {
    event.preventDefault()
    const albumDiv = event.target.closest(".album")
    if (albumDiv){
      if(albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id)
        if (success && data) {
          await displayAlbum(data)
        }
      }
    }
  })
}

async function cleanUpSectionEventListener() {
  const section = document.querySelector("section")
  section.removeEventListener("mousedown", sectionUploadClick, true)
  section.removeEventListener("dragover", sectionDrag, true)
  section.removeEventListener("drop", sectionDrop, true)
  console.log("CLEANED")
}

async function sectionUploadClick(event) {
  const fileInput = document.querySelector("#myInput");
  event.preventDefault();
  event.stopImmediatePropagation()
  console.log(fileInput)
  await fileInput.click();
}

sectionDrag = async(event) => {
  event.preventDefault();
  console.log("File(s) in drop zone");
}

sectionDrop = async(event) => {
  event.preventDefault();
  await dropHandler(event);
}

async function dropHandler(event) {
  event.preventDefault();
  const fileList = [];
  const files = event.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = await uploadFile(files[i]);
    fileList.push(file);
  }
  console.log(fileList);
  console.log(files.length)
  if (files.length > 0) {
    await displayCreateAlbumPreview(files);
  }
}

async function showCreateOrAddToCircle(circleRender) {
  pageName.innerHTML = `Add to a Circle`;
  leftHeaderButton.innerHTML = `
    <img src="/back_button_icon_light.svg" alt="Back Button" id="addCircleBackButton"></img>
    `;
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
  </div>`

  await cleanUpSectionEventListener();
  document.querySelector("#circleList").addEventListener("click", async function (event){
    const circleDiv = event.target.closest("div.circle")
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")){
        console.log("clicked", circleDiv.id)
        //MODIFY THIS TO SELECT CIRCLE TO BE USED FOR POST CONFIRMATION & POST

        albumObj.isCircle = true;
        albumObj.id = circleDiv.id;

        console.log("Selected circle object:", albumObj);
        
        let { success, data, error } = await getCircle(circleDiv.id)
        if (success && data) {
          console.log(data);
          albumObj.circleSrc = data.circle.picture;
          albumObj.circleName = data.circle.name;
          console.log(albumObj);
        }
        await displayAlbumConfirmation();
      }
    }
  })
  document.querySelector("#createNewCircle").addEventListener("click", async function (event) {
    console.log("MAKE A NEW CIRCLE PROCESS")
  })
}

async function displayAlbum(albumData){
  console.log(albumData)
  leftHeaderButton.innerHTML = `
  <span id="${albumData.circle.id}">
  <img src="/back_button_icon_light.svg" alt="Back Button" id="backButtonAlbum"></img>
  </span
  `;

  pageName.innerHTML = `${albumData.name}`
  
  const memberList = albumData.circle.UserCircle.map((obj) => {
    return `<img src="${obj.user.profilePicture}" class="w-16 h-16 rounded-full object-cover"></img>`
  })
  const photoList = albumData.photos.map((obj) => {
    return `<div class="w-full h-min relative photo" id="${obj.id}">
    <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.src}"/>
  </div>`
  })

  pageContent.innerHTML = `
    <div id="albumPhotos">
      <div id="memberList" class="flex mt-8 justify-center">
        ${memberList.join("")}
      </div>
      <div class="mt-4">
        <p class="flex justify-center font-medium text-lg">${albumData.circle.name}</p>
      </div>
      <div class="grid grid-cols-5 place-items-center mt-12 mb-2 mr-0">
        <p class="grid-span-1 text-base font-medium">${albumData.photos.length} Photos</p>
      </div>
      <div id="photoList" class="pb-28 w-full">
        <div class="columns-2 gap-4 space-y-4 grid-flow-row">
          ${photoList.join("")}
        </div>
      </div>
  </div>`
}

const clearNewAlbum = () => {
  albumObj = {};
  albumPhotos = [];
}