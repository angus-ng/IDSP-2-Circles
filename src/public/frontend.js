const pageName = document.querySelector("#pageName");
const pageContent = document.querySelector("#pageContent");
const leftHeaderButton = document.querySelector("#leftButton");
const rightHeaderButton = document.querySelector("#rightButton");

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
localAuthButton.addEventListener("click", async function (event) {
  let { success, data, error } = await localAuth();
  if (success && data) {
    await displayExplore();
  }
});

async function localAuth() {
  let emailInput = document.querySelector("#emailInput");
  let passwordInput = document.querySelector("#passwordInput");
  let inputObj = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  let response = await fetch("/auth/local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputObj),
  });

  inputObj = {};
  emailInput.value = "";
  passwordInput.value = "";

  const jsonResponse = await response.json();
  console.log(jsonResponse);

  if (!response.ok) {
    return { success: false, error: "Error with local auth" };
  }

  return jsonResponse;
}

async function displayCreateCircle() {
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
        <div class="flex-shrink-0 mt-20 mb-10">
            <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image">                     
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
    //console.log("change image");
    const res = await handleSelectFile();
    //console.log(res, "helppppp");
    console.log(res, "frontend");
    circlePhoto.src = res.data;
  });

  nextButton.addEventListener("click", async function (event) {
    console.log("clicked next button");
    event.preventDefault();
    await handleCreateCircle();
  });

  //This needs to be implemented when SPA creates the html for the privacy toggle
  const privacyCheckbox = document.querySelector("#privacyCheckbox");
  privacyCheckbox.addEventListener("change", function (event) {
    const privacyIcon = document.querySelector("#privacyIcon");
    const privacyLabel = document.querySelector("#privacyLabel");
    if (this.checked) {
      privacyIcon.src = "/globe_icon_light.svg";
      privacyLabel.innerHTML = "Public";
      return;
    }
    privacyIcon.src = "/lock_icon_light.svg";
    privacyLabel.innerHTML = "Private";
  });
  return;
}

async function displayCreateCirclePreview() {
  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
            <div class="flex-shrink-0 mt-20 mb-4">
                <img src="/placeholder_image.svg" alt="Placeholder Image">                     
            </div>
        
            <div class="flex-1">
                <form action="" class="flex flex-col">
                    <div class="flex justify-center my-5">
                        <h1 class="font-bold text-24 mr-2.5">Name</h1>
                        <img src="/edit_icon_light.svg" alt="Edit Icon">
                    </div>
                    <div id="divider" class="mb-5">
                        <img src="/divider_light.svg" alt="Divider">                          
                    </div>
                    <div class="flex items-center justify-between mt-4">
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
}

async function displayExplore() {
  pageName.innerHTML = "Explore";
  pageContent.innerHTML = "";
  await displayNavBar();
}

async function displayNavBar() {
  const nav = document.querySelector("#nav");
  nav.innerHTML = `<div class="border-b border-dark-grey"></div>

    <footer class="w-full flex justify-between items-center pt-4 pb-8 px-6 mt-2">
        
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
  navBar.addEventListener("click", function (event) {
    event.preventDefault();
    const exploreButton = event.target.closest("#explore");
    const searchButton = event.target.closest("#search");
    const newButton = event.target.closest("#new");
    const activityButton = event.target.closest("#activity");
    const profileButton = event.target.closest("#profile");

    if (exploreButton) {
      console.log("explore");
    }
    if (searchButton) {
      console.log("search");
    }
    if (newButton) {
      modal.classList.remove("hidden");
      modal.classList.add("shown");
    }
    if (activityButton) {
      console.log("activity");
    }
    if (profileButton) {
      console.log("profile");
    }
  });
}
