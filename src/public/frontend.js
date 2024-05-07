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
  pageName.innerHTML = "Login";
  pageContent.innerHTML = `<div id="loginPage" class="flex flex-col items-center rounded-lg mt-10 w-full z-10">
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
  const createCircleButton = event.target.closest("#createCircleButton");
  const closeButton = event.target.closest("#closeButton");

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
    handleCreateCircle();
    nav.classList.remove("hidden");
    return;
  }

  if (backButton) {
    nav.classList.remove("hidden");
    newCircleNameInput = "";
    pageName.innerHTML = "Explore";
    pageContent.innerHTML = "";
    leftHeaderButton.innerHTML = "";
    rightHeaderButton.innerHTML = `<img src="/map_icon_light.svg" alt="Map Icon"</img>`;
    return;
  }

  if (circleBackButton) {
    const circleName = document.querySelector("#circleName");
    console.log(circleName.value)
    isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
    let circleImgSrc = document.querySelector("#circleImage").src;
    newCircleNameInput = circleName.value;
    await displayCreateCircle();
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
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    await displayCreateAlbum();
  }

  if (createCircleModalButton) {
    modal.classList.remove("shown");
    modal.classList.add("hidden");
    await displayCreateCircle();
    await cleanUpSectionEventListener()
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

  leftHeaderButton.innerHTML = `
    <img src="/back_button_icon_light.svg" alt="Back Button" id="backButton"></img>
    `;
  rightHeaderButton.innerHTML = `
    <img src="/next_button_light.svg" alt="Next Button" id="nextInviteFriends"></img>
    `;

  const pageContent = document.querySelector("#pageContent");
  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
        <div class="shrink-0 mt-14 mb-6 justify-center">
            <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full">                     
        </div>
    
        <div class="flex-1 fixed bottom-10 px-4">
            <form class="flex flex-col">
                <div class="flex items-center mb-28">
                    <label for="circleName" class="font-medium text-h2 mr-6">Name</label>
                    <input
                    type="text"
                    placeholder="add a title to your circle..."
                    id="circleName"
                    class="w-full bg-transparent text-h2 text-text-grey font-light items-end border-none"
                    required
                    />
                </div>
                <div id="divider" class="my-4">
                    <img src="/divider_light.svg" alt="Divider">                          
                </div>
                <input id="myInput" type="file" class="hidden" multiple=false/>
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
                            <div class="peer relative h-5 w-10 rounded-full outline outline-1 outline-black after:absolute after:start-[2px] after:top-0 after:h-4 after:w-4 after:rounded-full after:border after:border-black after:bg-black after:transition-all after:content-[''] peer-checked:bg-cover peer-checked:bg-black border-2 peer-checked:outline-black peer-checked:after:translate-x-5 peer-checked:after:border-white peer-checked:after:border-opacity-80 peer-checked:after:border-2 peer-checked:after:bg-black rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                    </div>
                </div>
                <button id="addPicture" class="my-5 w-full">
                    <img src="/add_picture.svg" alt="Add Picture Button" class="w-full">
                </button>
            </form>
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
  leftHeaderButton.innerHTML = `<img src="/back_button_icon_light.svg" alt="Back Button" id="backButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/next_button_light.svg" alt="Next Button" id="nextButton"></img>`;
  
    pageContent.innerHTML = `
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
      <p>search or add friends to collaborate with in</p>
      <p>your circle</p>
    </div>
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
      <div class="relative w-full h-9 mt-8">
        <form>
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
                <input type="checkbox" id="add" name="add">
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
    <img src="/back_button_icon_light.svg" alt="Back Button" id="circleBackButton"></img>
    `;
  
  pageName.innerHTML = "New Circle";

  const next = document.querySelector("#nextButton");
  next.id = "createCircleButton";
  next.src = "/create_button_light.svg";

  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
          <div class="flex-shrink-0 mt-20 mb-4">
              <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full">                     
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
  pageContent.innerHTML = "";
  await displayNavBar();
}

async function displayNavBar() {
  const nav = document.querySelector("#nav");
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

    if (exploreButton) {
      pageName.innerHTML = "Explore";
      pageContent.innerHTML = "";
      rightHeaderButton.innerHTML = `<img src="/map_icon_light.svg" alt="Map Icon"</img>`;
      newCircleNameInput = "";
    }
    if (searchButton) {
      pageName.innerHTML = "Search";
      pageContent.innerHTML = "";
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
    }
    if (newButton) {
      modal.classList.remove("hidden");
      modal.classList.add("shown");
      newCircleNameInput = "";
    }
    if (activityButton) {
      pageName.innerHTML = "Activity";
      pageContent.innerHTML = "";
      leftHeaderButton.innerHTML = "";
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
    }
    if (profileButton) {
      pageName.innerHTML = currentLocalUser;
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
      const { success, data } = await getListOfCircles();
      if (success && data) {
        await renderListOfCircles(data);

        //update friendCounter here via id when implemented
        //update profilePicture when implemented

        return;
      }
      pageContent.innerHTML = "";
      await cleanUpSectionEventListener()
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

async function renderListOfCircles(data) {
  // console.log(data)
  let newArr = data.map((obj) => {
    return `
      <div id="${obj.circle.id}" class="circle">
        <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover"/></img>
        <p class="text-center text-secondary">${obj.circle.name}</p>
      </div>`;
  });
  pageContent.innerHTML = `
  <div id="profilePage" class="py-10 mb-4 w-full z-10">
    <div class="flex justify-center mb-4">
      <img id="profilePicture" src="/placeholder_image.svg" class="w-110 h-110 object-cover rounded-full"></img>
    </div>
    <div class="flex justify-center">
      <h2 class="text-base text-center">@${currentLocalUser}</h2>
    </div>
    <div class="mt-6 mb-6 m-auto grid grid-cols-2 gap-4">
      <div class="grid grid-rows-2 gap-0 justify-center">
        <h2 class="text-base font-bold text-center">${data.length}</h2>
        <h2 class="text-secondary text-center">Circles</h2>
      </div>

      <div class="grid grid-rows-2 gap-0 justify-center">
      <h2 class="text-base font-bold text-center" id="friendCounter">0</h2>
      <h2 class="text-secondary text-center">Friends</h2>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
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
    ${newArr.join("")}
    </div>
    <div class="h-100"></div>
  </div>`;
  pageContent.innerHTML = render;

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
}

async function renderListOfCircles(data) {
  // console.log(data)
  let newArr = data.map((obj) => {
    return `
      <div id="${obj.circle.id}" class="circle">
        <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover"/></img>
        <p class="text-center text-secondary">${obj.circle.name}</p>
      </div>`;
  });
  const render = `<div class="flex justify-center mt-6 mb-4">
    <img id="profilePicture" src="/placeholder_image.svg" class="w-110 h-110 object-cover rounded-full"></img>
  </div>
  <div class="flex justify-center">
    <h2 class="text-base text-center">@${currentLocalUser}</h2>
  </div>
  <div class="mt-6 mb-6 m-auto grid grid-cols-2 gap-4">
    <div class="grid grid-rows-2 gap-0 justify-center">
      <h2 class="text-base font-bold text-center">${data.length}</h2>
      <h2 class="text-secondary text-center">Circles</h2>
    </div>

    <div class="grid grid-rows-2 gap-0 justify-center">
    <h2 class="text-base font-bold text-center" id="friendCounter">0</h2>
    <h2 class="text-secondary text-center">Friends</h2>
    </div>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <img id="albumTab" src="/albumTab_deselected_light.svg" class="w-180 h-27 object-cover"></img>
    </div>
    <div>
      <img id="circleTab" src="/circlesTab_selected_light.svg" class="w-180 h-27 object-cover"></img>
    </div>
  </div>
  <div id="albumList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6 hidden">
  </div>
  <div id="circleList" class="m-auto grid grid-cols-3 gap-4 mt-6 mb-6">
  ${newArr.join("")}
  </div>`;
  pageContent.innerHTML = render;

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
}

async function displayCreateAlbum () {
  pageName.innerHTML = `New Album`;

  leftHeaderButton.innerHTML = `
    <img src="/close_icon_light.svg" alt="Close Button" id="closeButton"></img>
    `;
  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
  <div class="font-light text-dark-grey">select which photos you want to add to your album</div>
  <div id="createNewAlbum" class="flex flex-col justify-center py-10 my-48 w-full z-10">
    <div class="flex flex-col items-center">
      <form>
        <input id="myInput" type="file" style="visibility: hidden" multiple="false" />
      </form>
      <div class="flex justify-center mb-6">
        <img id="uploadIcon" src="/upload_photo_light.svg" alt="Upload Icon"/>
      </div>
      <div class="flex justify-center">
        <p class="text-base text-grey leading-body">drag and drop to&nbsp;</p>
        <p class="text-base underline text-grey leading-body">upload</p>
      </div>
      <div class="flex justify-center mt-4">
        <p class="text-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
      </div>
    </div>
  </div>
  `;

  const section = document.querySelector("section");
  section.classList.add("imageUploadSection");
  console.log(section.classList);
  const uploadSection = document.querySelector(".imageUploadSection");

  const fileInput = document.querySelector("#myInput");
  
  if (uploadSection.getAttribute('listener') !== true){
    uploadSection.addEventListener("mousedown", sectionUploadClick, true);
  }

  if (fileInput.getAttribute('listener') !== true) {
    fileInput.addEventListener("input", async function (event) {
      const res = await handleSelectFile();
    
      const files = event.target.files;
      console.log(files)
      if (files.length > 0) {
        await displayCreateAlbumPreview();
      }
    });
  }

  if (uploadSection.getAttribute('listener') !== true){
    uploadSection.addEventListener("dragover", sectionDrag, true);
    uploadSection.addEventListener("drop", sectionDrop, true);
  }

  section.classList.remove("imageUploadSection");
}

async function displayCreateAlbumPreview() {
  pageName.innerHTML = `New Album`;

  leftHeaderButton.innerHTML = `<img src="/close_icon_light.svg" alt="Close Button" id="closeButton"></img>`;
  rightHeaderButton.innerHTML = `<img src="/next_button_light.svg" alt="Next Button" id="nextButton"></img>`;

  const pageContent = document.querySelector("#pageContent");
  pageContent.innerHTML = `
  <div class="font-light text-dark-grey">select which photos you want to add to your album</div>
  <div id="createNewAlbum" class="flex flex-col items-center bg-light-mode w-430 z-10">
    <div class="flex-shrink-0 w-full items-center mt-20 mb-4">
      <div id="indicators-carousel" class="relative w-full" data-carousel="static">
      <!-- Carousel wrapper -->
      <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
          <!-- Item 1 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item="active">
              <img src="/hi.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
          <!-- Item 2 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/hi.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
          <!-- Item 3 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/hi.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
          <!-- Item 4 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/hi.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
          <!-- Item 5 -->
          <div class="hidden duration-700 ease-in-out" data-carousel-item>
              <img src="/hi.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
          </div>
      </div>
      <!-- Slider indicators -->
      <div class="absolute z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
          <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
          <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
          <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
          <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
          <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
      </div>
      <!-- Slider controls -->
      <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
              </svg>
              <span class="sr-only">Previous</span>
          </span>
      </button>
      <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
          <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
              <span class="sr-only">Next</span>
          </span>
      </button>
  </div>
    </div>
    <div class="flex flex-col items-center w-full bg-light-grey mt-2">
      <form>
        <input id="myInput" type="file" style="visibility: hidden" multiple="false" />
      </form>
      <div class="flex justify-center mb-6">
        <img id="uploadIcon" src="/upload_photo_grey_light.svg" alt="Upload Icon"/>
      </div>
      <div class="flex justify-center">
        <p class="text-base text-dark-grey leading-body">drag and drop to&nbsp;</p>
        <p class="text-base underline text-dark-grey leading-body">upload</p>
      </div>
      <div class="flex justify-center mt-4">
        <p class="text-dark-grey text-secondary leading-secondary">PNG, JPEG, JPG</p>
      </div>
    </div>
  </div>`;

  const carouselImages = document.querySelector("#image-carousel");
  const imageCount = carouselImages.children.length;
  const dots = Array.from(document.querySelectorAll("button[data-index"));
  let currentIndex = 0;
  
  function updateCarousel() {
    const translateClass = `-translate-x-[$currentIndex * 100}%]`;
  
    carouselImages.classList.add(translateClass);
    updateDots();
  }
  
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.className = `mx-1 w-3 h-3 rounded-full cursor-pointer`;
      dot.classList.add(index === currentIndex ? "bg-grey" : "bg-medium-grey");
    });
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
    });
  });
  
  updateCarousel();

}

async function displayCircle(circleData) { 
  pageName.innerHTML = ""
  const memberList = circleData.members.map((obj) => {
    return `<img src="${obj.user.profilePicture}" class="w-42 h-42 rounded-full object-cover"></img>`
  })
  console.log(circleData.circle.albums)
  const albumList = circleData.circle.albums.map((obj) => {
    return `
  <div class="w-180 h-min relative" id="${obj.id}">
    <img class="w-180 max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0].src}"/>
    <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
      <p class="text-light-mode-bg">${obj.name}</p>
    </div>
  </div>`
  })
  console.log(albumList)

  pageContent.innerHTML = `
  <div class="flex justify-center mt-6 mb-4">
    <img src="${circleData.circle.picture}" class="rounded-full w-180 h-180 object-cover"/></img>
  </div>
  <div>
    <p class="text-center text-20 text-bold">${circleData.circle.name}</p>
  </div>
  <div class="grid grid-cols-1 place-items-center">
    <label class="inline-flex items-center cursor-pointer">
        <img id="privacyIcon" src="/lock_icon_light.svg" alt="Lock icon" class="mr-4">
        <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">Private</span>
    </label>
  </div>
  <div class="grid grid-cols-5 place-items-center mt-16 mb-4">
    <p class="grid-span-1 text-base font-medium">${circleData.members.length} Friends</p>
  </div>
  <div class="flex gap-2">
    ${memberList.join("")}
  </div>
  <div class="mt-6">
    <p class="text-24 font-medium">Albums</p>
  </div>
  <div class="columns-2 gap-4 space-y-4 grid-flow-row">
    ${albumList.join("")}
  </div>`
}

async function cleanUpSectionEventListener() {
  const section = document.querySelector("section")
  section.removeEventListener("mousedown", sectionUploadClick, true)
  section.removeEventListener("dragover", sectionDrag, true)
  section.removeEventListener("drop", sectionDrop, true)
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