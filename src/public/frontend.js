const pageName = document.querySelector("#pageName");
const pageContent = document.querySelector("#pageContent");
const leftHeaderButton = document.querySelector("#leftButton");
const rightHeaderButton = document.querySelector("#rightButton");

let currentLocalUser;
let isPrivacyPublic = false;
let newCircleNameInput = "";
let isEditable = false;
let addPictureSrc;

const header = document.querySelector("header");
header.addEventListener("click", async (event) => {
    const nextButton = event.target.closest("#nextButton");
    const backButton = event.target.closest("#backButton");
    const circleBackButton = event.target.closest("#circleBackButton");
    const createCircleButton = event.target.closest("#createCircleButton");

    if (nextButton) {
        let circleImgSrc = document.querySelector("#circleImage").src;
        addPictureSrc = document.querySelector("#addPicture img").src;
        isPrivacyPublic = document.querySelector("#privacyCheckbox").checked;
        const circleName = document.querySelector("#circleName");
        newCircleNameInput = circleName.value;
        await displayCreateCirclePreview();
        document.querySelector("#privacyCheckbox").checked = isPrivacyPublic;
        document.querySelector("#circleImage").src = circleImgSrc;
        circleName.value = newCircleNameInput;
        await updateCheckbox()
        return;
    }

    if (createCircleButton) {
      console.log("yes")
      handleCreateCircle();
      return;
    }

    if (backButton) {
        newCircleNameInput = "";
        pageName.innerHTML = "Explore";
        pageContent.innerHTML = "";
        leftHeaderButton.innerHTML = "";
        rightHeaderButton.innerHTML = `<img src="/map_icon_light.svg" alt="Map Icon"</img>`;
        return;
    }

    if (circleBackButton) {
        const circleName = document.querySelector("#circleName");
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
        console.log("create album");
    }

    if (createCircleModalButton) {
        modal.classList.remove("shown");
        modal.classList.add("hidden");
        await displayCreateCircle();
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
const localAuthButton = document.querySelector("#localAuth");
localAuthButton.addEventListener("click", async function () {
    let { success, data, error } = await localAuth();
    if (success && data) {
        console.log(data)
        currentLocalUser = data;
        await displayExplore();
    }
})

function toggleEdit () {
  isEditable = !isEditable;

  if (isEditable) {
      circleName.removeAttribute("readonly");
      return circleName.focus();
  }

  circleName.addAttribute("readonly");
}

pageContent.addEventListener("click", (event) => {
  const editButton = event.target.closest("#editButton");

  if (editButton) {
      event.preventDefault();
      toggleEdit();
  }

})

async function displayCreateCircle () {
    pageName.innerHTML = `New Circle`;

  leftHeaderButton.innerHTML = `
    <img src="/back_button_icon_light.svg" alt="Back Button" id="backButton"></img>
    `;
  rightHeaderButton.innerHTML = `
    <img src="/next_button_light.svg" alt="Next Button" id="nextButton"></img>
    `;

  const pageContent = document.querySelector("#pageContent");
  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
        <div class="flex-shrink-0 mt-10 mb-10">
            <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full">                     
        </div>
    
        <div class="flex-1">
            <form action="" class="flex flex-col">
                <div class="flex items-center mt-8 mb-14">
                    <label for="circleName" class="font-medium text-h2 mr-6">Name</label>
                    <input
                    type="text"
                    placeholder="add a title to your circle..."
                    id="circleName"
                    class="w-full bg-light-mode-bg text-20 items-end border-none"
                    required
                    />
                </div>
                <div id="divider" class="my-4">
                    <img src="/divider_light.svg" alt="Divider">                          
                </div>
                <input id="myInput" type="file" style="visibility:hidden" multiple=false/>
                <div class="flex items-center justify-between mt-4">
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

  addPictureButton.addEventListener("click", async function (event) {
    console.log("clicked add picture button");
    event.preventDefault();
    await fileInput.click();
  });

  fileInput.addEventListener("input", async function (event) {
    event.preventDefault();
    const res = await handleSelectFile();
    circlePhoto.src = await res.data;
    document.querySelector("#addPicture img").src = "/change_picture_light.svg"
  });

  // nextButton.addEventListener("click", async function (event) {
  //   console.log("clicked next button");
  //   event.preventDefault();
  //   await handleCreateCircle();
  // });

    //This needs to be implemented when SPA creates the html for the privacy toggle

    privacyCheckbox.addEventListener("change", async function() {
        const privacyIcon = document.querySelector("#privacyIcon");
        const privacyLabel = document.querySelector("#privacyLabel");
        updateCheckbox();
        privacyIcon.src = "/lock_icon_light.svg";
        privacyLabel.innerHTML = "Private";
    });
    return;
}

async function displayCreateCirclePreview () {
    leftHeaderButton.innerHTML = `
    <img src="/back_button_icon_light.svg" alt="Back Button" id="circleBackButton"></img>
    `
    const next = document.querySelector("#nextButton")
    next.id = "createCircleButton"
    next.src = "/create_button_light.svg"

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
                    class="bg-light-mode-bg text-lg border-none text-center p-1 min-w-[50px] w-auto"
                />
            </div>
            <button
                id="editButton"
                class="absolute right-0 top-0 mt-2 mr-1"
            >
                <img src="/edit_icon_light.svg" alt="Edit Icon" />
            </button>
                    </div>
                    <div id="divider" class="mb-5">
                        <img src="/divider_light.svg" alt="Divider">                          
                    </div>
                    <div class="flex items-center justify-between mt-4 w-full">
                        <div>
                            <p class="font-medium text-h2 leading-h2">Private or Public</p>
                            <p class="text-14 leading-body text-dark-grey">Make new circle private or public</p>
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
                    <!-- need to add added friends section later -->
                </form>
            </div>
        </div>
    `;
        //This needs to be implemented when SPA creates the html for the privacy toggle

    privacyCheckbox.addEventListener("change", async function() {
        const privacyIcon = document.querySelector("#privacyIcon");
        const privacyLabel = document.querySelector("#privacyLabel");
        await updateCheckbox
        privacyIcon.src = "/lock_icon_light.svg";
        privacyLabel.innerHTML = "Private";
    });

    const circleNameInput = document.querySelector("#circleName");
    circleNameInput.value = newCircleNameInput;
}

async function displayExplore () {
    pageName.innerHTML = "Explore"
    pageContent.innerHTML = "";
    await displayNavBar();
}


async function displayNavBar () {
    const nav = document.querySelector("#nav");
    nav.innerHTML = `<div class="border-b border-dark-grey"></div>

    <footer class="w-full flex justify-between items-center pt-4 pb-8 px-6 bg-light-mode-bg">
        
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
        }
        if (searchButton) {
            pageName.innerHTML = "Search";
            pageContent.innerHTML = "";
            rightHeaderButton.innerHTML = "";
        }
        if (newButton) {
            modal.classList.remove("hidden");
            modal.classList.add("shown");
        }
        if (activityButton) {
            pageName.innerHTML = "Activity";
            pageContent.innerHTML = "";
            leftHeaderButton.innerHTML = "";
            rightHeaderButton.innerHTML = "";
        }
        if (profileButton) {
            pageName.innerHTML = currentLocalUser;
            rightHeaderButton.innerHTML = "";
            const { success, data } = await getListOfCircles();
            if (success && data) {
              await renderListOfCircles(data);
              
              //update friendCounter here via id when implemented
              //update profilePicture when implemented

              return;
            }
            pageContent.innerHTML = "";
        }
    });
}
async function updateCheckbox () {
  if (document.querySelector("#privacyCheckbox").checked) {
    privacyIcon.src = "/globe_icon_light.svg"
    privacyLabel.innerHTML = "Public";
    return;
  }
}

async function getListOfCircles () {
  const response = await fetch("/circle/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  })
  return await response.json()
}

async function renderListOfCircles(data) {
  // console.log(data)
  let newArr = data.map((obj) => {
    return `
      <div>
        <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover"/></img>
        <p class="text-center text-secondary">${obj.circle.name}</p>
      </div>`
  })
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
  </div>`
  pageContent.innerHTML = render
}