const { profile } = require("console");

function displayLoginPage() {
  pageContent.innerHTML = `
    <div id="loginPage" class="flex flex-col items-center rounded-lg w-full z-10">
      <div class="flex-shrink-0 mt-2 mb-6">
          <img src="/lightmode/logo_with_wordmark.svg" alt="Logo with Wordmark"/>  
      </div>
      <div class="flex-1">
        <form>
          <div class="flex items-center mt-6 mb-6">
              <label for="emailInput" class=""></label>
              <input type="text" placeholder="Phone number, email, or username" id="emailInput" name="emailInput" class="rounded-input-box w-input-box border-dark-grey border-2 text-17 items-end">
          </div>
          <div class="flex items-center mt-4 mb-6">
              <label for="password" class=""></label>
              <input type="password" placeholder="Password" id="passwordInput" name="password" class="rounded-input-box w-input-box text-17 border-dark-grey border-2 items-end">
          </div>
        </form>
          <div class="flex items-center mt-4 mb-6">
              <div class="grid grid-cols-2 w-full">
                  <div class="col-start-0">
                      <input type="checkbox" name="rememberMe" id="rememberMe" class="size-5">
                      <label for="rememberMe" class="ml-2 text-secondary">Remember Me</label>
                  </div>
                  <div class="justify-self-end">
                      <a class="text-secondary leading-secondary text-light-mode-accent text-decoration-line: underline cursor-pointer">Forgot Password?</a>
                  </div>
              </div>
          </div>
              <button id="localAuth" class="my-2 w-full">
                  <img src="/lightmode/login_button.svg" alt="Login Button"/>
              </button>
          </div>
          <div id="divider" class="my-6">
              <img src="/lightmode/orDivider.svg" alt="Divider"/>
          </div>
          <div class="flex items-center justify-between mt-4">
              <div class="flex flex-row space-x-4">
                  <form action="/auth/login">
                      <button>
                          <img src="/lightmode/google_icon.svg" alt="Google Icon"/>
                      </button>
                  </form>
                  <form action="/auth/login">
                      <button>
                          <img src="/lightmode/apple_icon.svg" alt="Apple Icon"/>
                      </button>
                  </form>
                  <form action="/auth/login">
                      <button id="facebookAuth">
                          <img src="/lightmode/facebook_icon.svg" alt="Facebook Icon"/>
                      </button>
                  </form>
              </div>
          </div>
      <div class="flex items-center justify-between mt-6 gap-1">
          <p class="text-secondary leading-secondary">Don't have an account?</p>
          <a id="signUp" class="text-secondary leading-secondary text-light-mode-accent text-decoration-line: underline cursor-pointer">Sign up</a>
      </div>
    </div>
  </div>`;

  const loginPage = document.querySelector("#loginPage");
  loginPage.addEventListener("click", async (event) => {
    const signUp = event.target.closest("#signUp");

    if (signUp) {
      await displaySignUpPage();
      await displaySignUpEmailPage();
    }
  });
}

async function displaySignUpPage() {
  header.classList.remove("hidden");
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button"/>`;
  pageContent.innerHTML = `
  <div id="signUpPage" class="flex flex-col items-center rounded-lg w-full h-full z-10">
    <div id="signUpTitleSection" class="w-full mb-4 mt-6">
        <h1 id= "signUpTitle" class="font-medium text-onboarding"></h1>
        <p id="signUpSubtitle" class="text-body leading-body text-onboarding-grey"></p>
    </div>
    <div id="signUpAdditionalContent"></div>
    <div id="signUpPageContent" class="mt-8 flex-1">
        <form class="flex flex-col flex-grow">
            <div id="input1" class="mb-6">
                
            </div>
            <div id="input2" class="mt-4">
               
            </div>
            <div class="flex-grow"></div>
        </form>
    </div>
    <button id="primaryButton" class="w-380 h-45 bg-light-mode-accent text-white rounded-input-box fixed bottom-8">Next</button>
    <button id="secondaryButton" class="w-380 h-45 bg-white text-dark-grey border-2 border-dark-grey rounded-input-box fixed bottom-8 hidden"></button>
  </div>`;
}

async function displaySignUpEmailPage() {
  header.classList.remove("hidden");
  leftHeaderButton.id = "emailBack";
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector("#signUpAdditionalContent");

  let primaryButton = document.querySelector("#primaryButton");
  if (!primaryButton) {
    primaryButton = document.querySelector("#emailNext");
  }

  signUpTitle.textContent = "Enter your Email";
  signUpSubtitle.textContent =
    "Enter the email where you can be contacted. No one will see this on your profile.";
  signUpPageContent.innerHTML = `
  <form class="flex flex-col flex-grow">
    <div class="mb-6">
        <label for="email" class="font-medium text-h2 mb-2">Email</label>
        <input id="emailInput" value="${signUpData.email}" type="email" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Email"/>
    </div>
    <div class="mt-4">
        <label for="emailConfirmation" class="font-medium text-h2 mb-4">Confirm Email</label>
        <input id="confirmEmailInput" value="${signUpData.confirmEmail}" type="email" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Email"/>
    </div>
    <div class="flex-grow"></div>
  </form>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "emailNext";
}

async function displaySignUpPasswordPage() {
  leftHeaderButton.id = "passwordBack";
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector(
    "#signUpAdditionalContent"
  );
  let primaryButton = document.querySelector("#emailNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#passwordNext");
  }

  signUpTitle.textContent = "Create a password";
  signUpSubtitle.textContent = "Your new password must contain:";

  signUpPageContent.innerHTML = `
  <form class="flex flex-col flex-grow">
    <div class="mb-6">
        <label for="password" class="font-medium text-h2 mb-2">Password</label>
        <input id="passwordInput" value="${signUpData.password}" type="password" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Password"/>
    </div>
    <div class="mt-4">
        <label for="passwordConfirmation" class="font-medium text-h2 mb-4">Confirm Password</label>
        <input id="confirmPasswordInput" value="${signUpData.confirmPassword}"  type="password" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Password"/>
    </div>
    <div class="flex-grow"></div>
  </form>`;

  const passwordRequirements = document.createElement("ul");
  passwordRequirements.className =
    "grid grid-cols-2 gap-1 text-secondary list-disc custom-list text-onboarding-grey";
  passwordRequirements.innerHTML = `
  <li>minimum 8 characters</li>
  <li>1 lowercase character</li>
  <li>1 uppercase character</li>
  <li>1 number or special character</li>`;

  signUpPageAdditionalContent.appendChild(passwordRequirements);

  primaryButton.id = "passwordNext";
}

async function displaySignUpBirthdayPage() {
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector("#signUpAdditionalContent");
  let primaryButton = document.querySelector("#passwordNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#birthdayNext");
  }

  leftHeaderButton.id = "birthdayBack";

  signUpTitle.textContent = "Tell us your birthday!";
  signUpSubtitle.textContent =
    "Use your own birthday. No one will see this on your profile.";

  signUpPageContent.innerHTML = `
  <form class="flex flex-col flex-grow">
    <div class="mb-6">
        <label for="date" class="font-medium text-h2 mb-2">Birthday</label>
        <input id="birthdayInput" type="date" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="April 4 2024"/>
    </div>
    <div class="flex-grow"></div>
  </form>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "birthdayNext";
}

async function displaySignUpNamePage() {
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector(
    "#signUpAdditionalContent"
  );
  let primaryButton = document.querySelector("#birthdayNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#nameNext");
  }

  leftHeaderButton.id = "nameBack";

  signUpTitle.textContent = "What’s your name?";
  signUpSubtitle.textContent = "Add your name so friends can find you easier.";

  signUpPageContent.innerHTML = `
  <form class="flex flex-col flex-grow">
      <div class="mb-6">
          <label for="text" class="font-medium text-h2 mb-2">First Name</label>
          <input type="text" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="First Name"/>
      </div>
      <div class="mb-6">
          <label for="text" class="font-medium text-h2 mb-2">Last Name</label>
          <input type="text" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Last Name"/>
      </div>
      <div class="flex-grow"></div>
  </form>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "nameNext";
}

async function displaySignUpUsernamePage() {
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector(
    "#signUpAdditionalContent"
  );
  let primaryButton = document.querySelector("#nameNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#usernameNext");
  }

  leftHeaderButton.id = "usernameBack";

  signUpTitle.textContent = "Create a username";
  signUpSubtitle.textContent =
    "Add a username. You can change this at any time.";

  signUpPageContent.innerHTML = `
  <form class="flex flex-col flex-grow">
      <div class="mb-6">
          <label for="text" class="font-medium text-h2 mb-2">Username</label>
          <input type="text" class="w-380 py-2 border-dark-grey border-2 rounded-input-box text-14 leading-secondary mt-2" placeholder="Username"/>
      </div>
      <div class="flex-grow"></div>
  </form>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "usernameNext";
}

async function displaySignUpProfilePicturePage() {
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector("#signUpAdditionalContent");
  let primaryButton = document.querySelector("#usernameNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#addProfilePicture");
  }

  const secondaryButton = document.querySelector("#secondaryButton");

  leftHeaderButton.id = "profilePictureBack";

  signUpTitle.textContent = "Add a profile picture";
  signUpSubtitle.textContent =
    "Add a profile picture so your friends know it’s you. Everyone will be able to see your picture.";

  signUpPageContent.innerHTML = `<img src=/placeholder_image.svg alt="placeholder image"/>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "addProfilePicture";
  primaryButton.textContent = "Add Picture";
  primaryButton.classList.remove("bottom-8");
  primaryButton.classList.add("bottom-24");
  secondaryButton.classList.remove("hidden");
  secondaryButton.id = "profilePictureNext";
  secondaryButton.textContent = "Skip";
}

async function displayProfileConfirmation() {
  const signUpTitle = document.querySelector("#signUpTitle");
  const signUpSubtitle = document.querySelector("#signUpSubtitle");
  const signUpPageContent = document.querySelector("#signUpPageContent");
  const signUpPageAdditionalContent = document.querySelector("#signUpAdditionalContent");
  let primaryButton = document.querySelector("#addProfilePicture");
  const secondaryButton = document.querySelector("#profilePictureNext");
  if (!primaryButton) {
    primaryButton = document.querySelector("#addProfilePicture");
  }

  leftHeaderButton.id = "profileConfirmationBack";

  signUpTitle.textContent = "Profile picture added";
  signUpSubtitle.textContent = "";

  signUpPageContent.innerHTML = `<img src=/placeholder_image.svg alt="placeholder image"/>`;

  signUpPageAdditionalContent.textContent = "";

  primaryButton.id = "doneButton";
  primaryButton.textContent = "Done";
  secondaryButton.id = "changeProfilePicture";
  secondaryButton.textContent = "Change Picture";
}

async function displayCreateCircle() {
  nav.classList.add("hidden");
  pageName.textContent = `New Circle`;

  leftHeaderButton.innerHTML = `<img id="backButton" src="/lightmode/back_button.svg" alt="Back Button"/>`;
  rightHeaderButton.innerHTML = `<img id="nextInviteFriends" src="/lightmode/next_button.svg" alt="Next Button"/>`;

  const pageContent = document.querySelector("#pageContent");
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

    addPictureButton.textContent = "Change Picture";
    addPictureButton.className = "w-380 h-45 bg-white border-2 border-dark-grey text-dark-grey rounded-input-box fixed bottom-8";
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
    let displayName = document.createElement("h2");
    let username = document.createElement("h2");
    displayName.className = "font-medium text-14 leading-tertiary";
    username.className = "font-light text-14 text-dark-grey";
    displayName.textContent = friend.displayName ? friend.displayName : friend.username;
    username.textContent = `@${friend.username}`;
    return `
    <div class="flex items-center my-5">
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

async function displayInviteFriends() {
  nav.classList.add("hidden");
  const friends = await getFriends(currentLocalUser);
  const friendsList = await displayListOfFriends(friends);
  pageName.textContent = "Invite Friends";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="circleBackButton"/>`;
  rightHeaderButton.innerHTML = `<img src="/lightmode/next_button.svg" alt="Next Button" id="nextButton"/>`;

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

async function displayCreateCirclePreview() {
  nav.classList.add("hidden");
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="circlePreviewBackButton"/>`;

  pageName.textContent = "New Circle";

  const next = document.querySelector("#nextButton");
  next.id = "createCircleButton";
  next.src = "/lightmode/create_button.svg";

  pageContent.innerHTML = `
    <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
          <div class="flex-shrink-0 mt-14 mb-4">
              <img id="circleImage" src="/placeholder_image.svg" alt="Placeholder Image" class="object-cover w-234 h-230 rounded-full cursor-pointer"/>                     
          </div>
          <div class="flex justify-center my-5 relative w-full">
              <input
                  type="text"
                  placeholder="add a name to your circle"
                  id="circleName"
                  class="bg-transparent text-24 font-bold border-none text-center w-auto px-0"
              />
              <button id="editButton" class="mr-1">
                  <img src="/lightmode/edit_icon.svg" alt="Edit Icon" />
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

  circleNameInput.value = newCircleNameInput;
}

async function displayExplore() {
  pageName.textContent = "Explore";
  leftHeaderButton.innerHTML = "";
  rightHeaderButton.innerHTML = `<img src="/lightmode/map_icon.svg" alt="Map Icon"/>`;
  pageContent.innerHTML = `
    <div id="explorePage" class="flex flex-col justify-center py-2 w-full h-screen">
    </div>`;
  header.classList.remove("hidden");
  await displayNavBar();
}

async function displaySearch() {
  pageName.textContent = "Search";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  pageContent.innerHTML = `
    <div id="searchPage" class="py-2 w-full h-full">
      <div class="relative w-full h-9 mt-8">
        <input type="text" id="searchBox" class="w-380 px-10 py-2 border-grey border-2 rounded-input-box text-secondary leading-secondary" placeholder="search account">
        <img src="/lightmode/search_icon_grey.svg" alt="search icon" class="absolute left-3 top-search w-25 h-25"/>
      </div>
      <div class="flex flex-col shrink-0 mt-10 mb-6 justify-center w-full">
        <div id="suggestedFriends"></div>
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
    const filteredResults = storedSearchResults.filter((user) =>
      user.username.toLowerCase().includes(searchBox.value.toLowerCase())
    );
    updateSuggestedFriends(filteredResults);
  });

  // Initial load
  suggestedFriends.addEventListener("click", async function (event) {
    event.preventDefault();
    const user = event.target.closest("div.user");
    if (user) {
      const { success, data } = await getUser(user.id);
      if (success && data) {
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
        console.log(response);
        await displayPopup("friend request sent");
        await displaySearch();
        break;
      case "Remove Friend":
        //MAKE USER CONFIRM IF THEY WANT TO REMOVE THIS FRIEND FIRST
        response = await unfriend(username, currentLocalUser);
        console.log(response);
        await displaySearch();
        break;
      case "Remove Request":
        response = await removeFriendRequest(username, currentLocalUser);
        console.log(response);
        await displaySearch();
        break;
      case "Accept Request":
        response = await acceptFriendRequest(username, currentLocalUser);
        console.log(response);
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
    displayName.textContent = user.displayName ? user.displayName : user.username;
    username.textContent = `@${user.username}`;
    return `<div class="flex items-center my-3 user" id="${user.username}">
      <div class="flex-none w-58">
        <img class="rounded-full w-58 h-58 object-cover" src="${user.profilePicture}" alt="${user.username}'s profile picture"/>
      </div>
      <div class="ml-8 flex-none w-207">
        ${displayName.outerHTML}
        ${username.outerHTML}
      </div>
    </div>`;
  });
  return newArr;
}

async function displayActivity() {
  pageName.textContent = "All Activity";
  rightHeaderButton.innerHTML = "";
  leftHeaderButton.innerHTML = "";
  const { friendRequests, circleInvites } = await getActivities(
    currentLocalUser
  );
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
      const andMore = `<div class="w-8 h-8 rounded-full border-2 border-white border-solid ml-neg12 flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      friendRequestsPreviews.push(andMore);
      break;
    }
    const friendImg = document.createElement("img");
    friendImg.src = friendRequests[i].requester.profilePicture;
    let altText = friendRequests[i].requester.displayName ? friendRequests[i].requester.displayName : friendRequests[i].requester.username;
    altText = altText + "'s profile picture";
    friendImg.alt = altText;
    friendImg.className = "w-8 h-8 rounded-full object-cover border-2 border-white border-solid";i > 0 ? friendImg.classList.add("ml-neg12") : null;
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
                    ${circleInvites.length ? circleInvitePreviews.join("") : noCircleInvites}
                </div>
                <div class="flex w-2 h-33 items-center ml-auto">
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7.5 7.5L1 14" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <div id="friendInviteSection" class="h-100 border-solid border border-t-transparent border-b-black border-x-transparent w-full flex items-center flex-wrap flex-row space-y-0">
            <div class="w-full">
                <h2 class="font-medium text-base">Friend Requests</h2>
            </div>
            <div id="friendRequests" class="flex w-full">
              <div class="flex w-180 h-33 items-center">
                  ${friendRequests.length ? friendRequestsPreviews.join("") : noFriendRequests}
              </div>
              <div class="flex w-2 h-33 items-center ml-auto">
                  <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L7.5 7.5L1 14" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
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

async function displayNavBar() {
  const nav = document.querySelector("#nav");
  nav.classList.remove("hidden");
  nav.innerHTML = `
  <div class="border-b border-dark-grey"></div>
      <footer class="w-full flex justify-between items-center pt-4 pb-5 px-6 bg-light-mode-bg text-grey text-13">
          <a id="explore" class="flex flex-col items-center cursor-pointer">        
              <img src="/lightmode/explore_icon.svg" alt="Explore Icon">
              <p class="mt-1">explore</p>
          </a>
          <a id="search" class="flex flex-col items-center cursor-pointer">
              <img src="/lightmode/search_icon.svg" alt="Search Icon">
              <p class="mt-1">search</p>
          </a>
          <a id="new" class="flex flex-col items-center cursor-pointer">
              <img src="/lightmode/new_icon.svg" alt="New Icon">
              <p class="mt-1">new</p>
          </a>
          <a id="activity" class="flex flex-col items-center cursor-pointer">
              <img src="/lightmode/activity_icon.svg" alt="Activity Icon">
              <p class="mt-1">activity</p>         
          </a>
          <a id="profile" class="flex flex-col items-center cursor-pointer">
              <img src="/lightmode/profile_icon.svg" alt="Profile Icon">
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
      await displayExplore();
      newCircleNameInput = "";
    }
    if (searchButton) {
      await displaySearch();
      newCircleNameInput = "";
    }
    if (newButton) {
      newCircleNameInput = "";
      await displayNewModal();
    }
    if (activityButton) {
      await displayActivity();
      newCircleNameInput = "";
    }
    if (profileButton) {
      rightHeaderButton.innerHTML = "";
      newCircleNameInput = "";
      console.log(await getUser(currentLocalUser));
      const { success, data } = await getUser(currentLocalUser);
      if (success && data) {
        return await displayProfile(data);
      }
    }
  });
}

async function displayNewModal() {
  const modal = document.querySelector("#modal");
  modal.classList.remove("hidden");
  modal.classList.add("shown");
  const closeModalButton = document.querySelector("#closeModalButton");
  closeModalButton.classList.remove("hidden");
  const modalContent = document.querySelector("#modalContent");
  modalContent.innerHTML = `
  <div class="flex space-x-6 justify-center text-light-mode-accent font-medium text-14">
    <button id="createAlbumModalButton">
        <img src="/lightmode/create_album_icon.svg" alt="New Album Icon">
        <p class="mt-3">create album</p>
    </button>              
    <button id="createCircleModalButton">
        <img src="/lightmode/create_circle_icon.svg" alt="New Circle Icon">
        <p class="mt-3">create circle</p>
    </button>                        
  </div>`;
}

async function displayProfile(userData) {
  nav.classList.remove("hidden");
  console.log("here", userData);
  const user = userData.username;

  const circleRender = await displayListOfCircles(userData, user);
  const albumRender = await displayListOfAlbums(userData, user, true);

  const backSpan = document.createElement("span");
  backSpan.className = "backSpan";
  const imgElement = document.createElement("img");
  imgElement.src = "/lightmode/back_button.svg";
  imgElement.alt = "Back Button";
  imgElement.id = "profileBackButton";
  backSpan.removeAttribute("circleId");

  if (currentLocalUser === userData.username) {
    imgElement.classList.add("hidden");
  }

  backSpan.appendChild(imgElement);

  leftHeaderButton.innerHTML = "";
  leftHeaderButton.appendChild(backSpan);

  backSpan.setAttribute("username", `${user}`);

  pageName.textContent = userData.displayName ? userData.displayName : userData.username;
  const username = document.createElement("h2");
  username.id = "username";
  username.className = "text-base text-center";
  username.textContent = `@${userData.username}`;
  pageContent.innerHTML = `
  <div id="profilePage" class="relative pt-2 pb-16 mb-4 w-full">
    ${currentLocalUser === userData.username ? `<div id="settings" class="absolute top-0 right-0 w-6 h-6"><img src="/lightmode/settings_icon.svg"></div>` : ""}
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
          <h2 class="text-base font-bold text-center" id="friendCounter">${userData._count.friends}</h2>
          <h2 class="text-secondary text-center">Friends</h2>
        </div>
      </div>
    </div>
    <div id="addAsFriend" class="flex justify-center">

    </div>
    <div id="profileTabs" class="w-full justify-center mx-auto">
      <ul class="flex flex-row w-full justify-center -mb-px text-sm font-medium text-center text-dark-grey gap-6">
        <li id="albumTab" class="me-2 w-full mr-0">
          <a class="w-full inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-black hover:border-black">
            <p class="text-13 font-bold mr-2">albums</p>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" class="hover:fill-black">
              <path d="M11.55 0H2.45C1.93283 0 1.43684 0.205446 1.07114 0.571142C0.705446 0.936838 0.5 1.43283 0.5 1.95V11.05C0.5 11.5672 0.705446 12.0632 1.07114 12.4289C1.43684 12.7946 1.93283 13 2.45 13H11.55C11.6569 12.9985 11.7635 12.9876 11.8685 12.9675L12.0635 12.922H12.109H12.1415L12.382 12.831L12.4665 12.7855C12.5315 12.7465 12.603 12.714 12.668 12.6685C12.7548 12.6046 12.8373 12.5352 12.915 12.4605L12.9605 12.402C13.0243 12.3373 13.083 12.2678 13.136 12.194L13.1945 12.1095C13.2399 12.0371 13.279 11.961 13.3115 11.882C13.3293 11.8508 13.3446 11.8182 13.357 11.7845C13.3895 11.7065 13.409 11.622 13.435 11.5375V11.44C13.4719 11.313 13.4937 11.1821 13.5 11.05V1.95C13.5 1.43283 13.2946 0.936838 12.9289 0.571142C12.5632 0.205446 12.0672 0 11.55 0ZM2.45 11.7C2.27761 11.7 2.11228 11.6315 1.99038 11.5096C1.86848 11.3877 1.8 11.2224 1.8 11.05V8.2485L3.9385 6.1035C3.99893 6.04258 4.07082 5.99422 4.15002 5.96122C4.22923 5.92822 4.31419 5.91123 4.4 5.91123C4.48581 5.91123 4.57077 5.92822 4.64997 5.96122C4.72918 5.99422 4.80107 6.04258 4.8615 6.1035L10.4515 11.7H2.45ZM12.2 11.05C12.1994 11.1301 12.184 11.2095 12.1545 11.284C12.1396 11.3157 12.1223 11.3461 12.1025 11.375C12.0851 11.4025 12.0655 11.4286 12.044 11.453L8.5665 7.9755L9.1385 7.4035C9.19893 7.34258 9.27082 7.29422 9.35003 7.26122C9.42923 7.22822 9.51419 7.21123 9.6 7.21123C9.68581 7.21123 9.77077 7.22822 9.84997 7.26122C9.92918 7.29422 10.0011 7.34258 10.0615 7.4035L12.2 9.5485V11.05ZM12.2 7.709L10.978 6.5C10.606 6.14704 10.1128 5.95028 9.6 5.95028C9.08722 5.95028 8.59398 6.14704 8.222 6.5L7.65 7.072L5.778 5.2C5.40602 4.84704 4.91278 4.65028 4.4 4.65028C3.88722 4.65028 3.39398 4.84704 3.022 5.2L1.8 6.409V1.95C1.8 1.77761 1.86848 1.61228 1.99038 1.49038C2.11228 1.36848 2.27761 1.3 2.45 1.3H11.55C11.7224 1.3 11.8877 1.36848 12.0096 1.49038C12.1315 1.61228 12.2 1.77761 12.2 1.95V7.709ZM7.975 2.6C7.78216 2.6 7.59366 2.65718 7.43332 2.76432C7.27298 2.87145 7.14801 3.02373 7.07422 3.20188C7.00042 3.38004 6.98111 3.57608 7.01873 3.76521C7.05635 3.95434 7.14921 4.12807 7.28557 4.26443C7.42193 4.40079 7.59565 4.49365 7.78479 4.53127C7.97392 4.56889 8.16996 4.54958 8.34812 4.47578C8.52627 4.40199 8.67855 4.27702 8.78568 4.11668C8.89282 3.95634 8.95 3.76784 8.95 3.575C8.95 3.31641 8.84728 3.06842 8.66443 2.88557C8.48158 2.70272 8.23359 2.6 7.975 2.6Z" fill="#737373"/>
            </svg>
          </a>
        </li>
        <li id="circleTab" class="me-2 w-full mr-0">
          <a class="w-full inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg text-black border-black hover:text-black hover:border-black">
            <p id="circleText" class="text-13 font-bold mr-2">circles</p>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13C6.10083 13 5.25583 12.8293 4.465 12.4878C3.67417 12.1463 2.98625 11.6833 2.40125 11.0987C1.81625 10.5142 1.35323 9.82626 1.0122 9.035C0.671167 8.24373 0.500434 7.39873 0.500001 6.5C0.499567 5.60126 0.670301 4.75627 1.0122 3.965C1.3541 3.17373 1.81712 2.48582 2.40125 1.90125C2.98538 1.31668 3.6733 0.853666 4.465 0.5122C5.2567 0.170733 6.1017 0 7 0C7.8983 0 8.74329 0.170733 9.53499 0.5122C10.3267 0.853666 11.0146 1.31668 11.5987 1.90125C12.1829 2.48582 12.6461 3.17373 12.9884 3.965C13.3308 4.75627 13.5013 5.60126 13.5 6.5C13.4987 7.39873 13.328 8.24373 12.9878 9.035C12.6476 9.82626 12.1846 10.5142 11.5987 11.0987C11.0129 11.6833 10.325 12.1465 9.53499 12.4884C8.74503 12.8303 7.90003 13.0009 7 13ZM7 11.7C8.45166 11.7 9.68124 11.1962 10.6887 10.1887C11.6962 9.18125 12.2 7.95166 12.2 6.5C12.2 5.04833 11.6962 3.81875 10.6887 2.81125C9.68124 1.80375 8.45166 1.3 7 1.3C5.54833 1.3 4.31875 1.80375 3.31125 2.81125C2.30375 3.81875 1.8 5.04833 1.8 6.5C1.8 7.95166 2.30375 9.18125 3.31125 10.1887C4.31875 11.1962 5.54833 11.7 7 11.7Z" fill="#0E0E0E"/>
            </svg>
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
        console.log("Button method:", addButton.getAttribute("method"));
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
      if (like.classList.contains("liked")) {
        console.log("unliked");
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#FFFFFF");
      } else {
        like.classList.add("liked");
        console.log("liked");
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
      }
      return;
    }

    if (comment) {
      await displayComments(albumDiv.id, userData.profilePicture, currentLocalUser);
      return;
    }

    if (albumDiv) {
      const user = document.querySelector("span.user").getAttribute("username");
      console.log("user", user);

      if (user) {
        if (albumDiv.hasAttribute("id")) {
          let { success, data, error } = await getAlbum(albumDiv.id);
          if (success && data) {
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
    console.log("circle", userData)
    if (circleDiv) {
      if (circleDiv.hasAttribute("id")) {
        let { success, data, error } = await getCircle(circleDiv.id);
        if (success && data) {
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
          console.log(response);
          await displayPopup("friend request sent");
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Remove Friend": {
          //MAKE USER CONFIRM IF THEY WANT TO REMOVE THIS FRIEND FIRST
          response = await unfriend(username, currentLocalUser);
          console.log(response);
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Remove Request": {
          response = await removeFriendRequest(username, currentLocalUser);
          console.log(response);
          let { success, data } = await getUser(username);
          if (success && data) {
            await displayProfile(data);
          }
          break;
        }
        case "Accept Request": {
          response = await acceptFriendRequest(username, currentLocalUser);
          console.log(response);
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
    leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="settingsBackButton"/>`;
    rightHeaderButton.innerHTML = "";

    pageContent.innerHTML = `
    <div id="settingsPage" class="flex flex-col pt-2 pb-200 mb-4 w-full">
      <div class="flex justify-center mb-4">
        <img id="profilePicture" src="${userData.profilePicture}" class="w-110 h-110 object-cover rounded-full"/>
      </div>
      <div class="flex justify-center mt-2">
        ${username.outerHTML}
      </div>
      <div id="albumSettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Albums</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="privacySettings" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7719 17.614V14.1053M16.1579 9.7193V6.38596C16.1579 5.22273 15.6958 4.10715 14.8733 3.28462C14.0507 2.46209 12.9352 2 11.7719 2C10.6087 2 9.49311 2.46209 8.67058 3.28462C7.84806 4.10715 7.38596 5.22273 7.38596 6.38596V9.7193M3 20.2456V11.4737C3 11.0084 3.18484 10.5622 3.51385 10.2331C3.84286 9.90413 4.28909 9.7193 4.75439 9.7193H11.7719H18.7895C19.2548 9.7193 19.701 9.90413 20.03 10.2331C20.359 10.5622 20.5439 11.0084 20.5439 11.4737V20.2456C20.5439 20.7109 20.359 21.1571 20.03 21.4862C19.701 21.8152 19.2548 22 18.7895 22H4.75439C4.28909 22 3.84286 21.8152 3.51385 21.4862C3.18484 21.1571 3 20.7109 3 20.2456Z" stroke="#67696B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-17">Privacy</p>
            </div>
            <div class="flex flex-row py-0">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L8 8L1.5 14.5" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div id="notificationSettings" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.04039 9.36922C5.04039 7.41478 5.81679 5.54039 7.19879 4.15839C8.58078 2.7764 10.4552 2 12.4096 2C14.364 2 16.2384 2.7764 17.6204 4.15839C19.0024 5.54039 19.7788 7.41478 19.7788 9.36922V13.3318L21.6969 17.168C21.7852 17.3445 21.8269 17.5407 21.8181 17.7379C21.8092 17.9352 21.75 18.1268 21.6462 18.2948C21.5425 18.4627 21.3975 18.6013 21.225 18.6974C21.0526 18.7935 20.8584 18.844 20.661 18.8439H16.4879C16.2538 19.7474 15.7262 20.5476 14.9881 21.1188C14.2499 21.6901 13.343 22 12.4096 22C11.4762 22 10.5693 21.6901 9.83116 21.1188C9.09301 20.5476 8.56544 19.7474 8.33127 18.8439H4.15819C3.96078 18.844 3.76663 18.7935 3.5942 18.6974C3.42177 18.6013 3.27677 18.4627 3.17297 18.2948C3.06918 18.1268 3.01004 17.9352 3.00117 17.7379C2.9923 17.5407 3.03399 17.3445 3.12229 17.168L5.04039 13.3318V9.36922ZM10.5863 18.8439C10.7711 19.164 11.0368 19.4297 11.3569 19.6145C11.677 19.7993 12.04 19.8966 12.4096 19.8966C12.7792 19.8966 13.1422 19.7993 13.4623 19.6145C13.7824 19.4297 14.0482 19.164 14.233 18.8439H10.5863ZM12.4096 4.10549C11.0136 4.10549 9.67473 4.66006 8.68759 5.6472C7.70045 6.63434 7.14588 7.97319 7.14588 9.36922V13.3318C7.14586 13.6585 7.06981 13.9807 6.92375 14.2729L5.69204 16.7384H19.1282L17.8965 14.2729C17.7501 13.9807 17.6737 13.6585 17.6733 13.3318V9.36922C17.6733 7.97319 17.1188 6.63434 16.1316 5.6472C15.1445 4.66006 13.8056 4.10549 12.4096 4.10549Z" fill="#737373"/>
              </svg>
              <p class="text-17">Notification</p>
            </div>
            <div class="flex flex-row">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L8 8L1.5 14.5" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div id="accessibilitySettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Accessibility</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="modeSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C9.5 21 7.375 20.125 5.625 18.375C3.875 16.625 3 14.5 3 12C3 9.5 3.875 7.375 5.625 5.625C7.375 3.875 9.5 3 12 3C12.2333 3 12.4627 3.00833 12.688 3.025C12.9127 3.04167 13.1333 3.06667 13.35 3.1C12.6667 3.58333 12.121 4.21233 11.713 4.987C11.3043 5.76233 11.1 6.6 11.1 7.5C11.1 9 11.625 10.275 12.675 11.325C13.725 12.375 15 12.9 16.5 12.9C17.4167 12.9 18.2583 12.6957 19.025 12.287C19.7917 11.879 20.4167 11.3333 20.9 10.65C20.9333 10.8667 20.9583 11.0873 20.975 11.312C20.9917 11.5373 21 11.7667 21 12C21 14.5 20.125 16.625 18.375 18.375C16.625 20.125 14.5 21 12 21ZM12 19C13.4667 19 14.7833 18.596 15.95 17.788C17.1167 16.9793 17.9667 15.925 18.5 14.625C18.1667 14.7083 17.8333 14.775 17.5 14.825C17.1667 14.875 16.8333 14.9 16.5 14.9C14.45 14.9 12.704 14.1793 11.262 12.738C9.82067 11.296 9.1 9.55 9.1 7.5C9.1 7.16667 9.125 6.83333 9.175 6.5C9.225 6.16667 9.29167 5.83333 9.375 5.5C8.075 6.03333 7.021 6.88333 6.213 8.05C5.40433 9.21667 5 10.5333 5 12C5 13.9333 5.68333 15.5833 7.05 16.95C8.41667 18.3167 10.0667 19 12 19Z" fill="#67696B"/>
              </svg>
              <p class="text-17">Dark/Light Mode</p>
            </div>
            <div class="flex flex-row">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L8 8L1.5 14.5" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div id="contrastSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.5C17.52 21.5 22 17.02 22 11.5C22 5.98 17.52 1.5 12 1.5C6.48 1.5 2 5.98 2 11.5C2 17.02 6.48 21.5 12 21.5ZM13 3.57C16.94 4.06 20 7.42 20 11.5C20 15.58 16.95 18.94 13 19.43V3.57Z" fill="#737373"/>
              </svg>
              <p class="text-17">Contrast</p>
            </div>
            <div class="flex flex-row">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L8 8L1.5 14.5" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div id="fontSizeSettings" class="flex flex-row flex-item items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.93772 3C7.16522 3 6.47647 3.4875 6.22147 4.2175L2.05272 16.1275C2.01201 16.2437 1.99459 16.3668 2.00146 16.4898C2.00832 16.6127 2.03934 16.7331 2.09273 16.8441C2.20056 17.0682 2.39301 17.2403 2.62772 17.3225C2.86244 17.4047 3.1202 17.3903 3.34431 17.2825C3.56842 17.1747 3.74051 16.9822 3.82272 16.7475L5.24397 12.6875H10.6315L12.0527 16.7475C12.1349 16.9822 12.307 17.1747 12.5311 17.2825C12.7552 17.3903 13.013 17.4047 13.2477 17.3225C13.4824 17.2403 13.6749 17.0682 13.7827 16.8441C13.8905 16.62 13.9049 16.3622 13.8227 16.1275L9.65397 4.2175C9.52935 3.86172 9.29726 3.55346 8.9898 3.33535C8.68233 3.11724 8.31469 3.00005 7.93772 3ZM9.97522 10.8125L7.93772 4.99L5.90022 10.8125H9.97522ZM16.394 14.5575C16.394 14.2788 16.744 13.625 17.834 13.625H20.0002C19.6327 14.905 18.5277 15.5 17.6252 15.5C17.0627 15.5 16.779 15.3325 16.6352 15.1888C16.5555 15.1045 16.4932 15.0054 16.4518 14.8971C16.4104 14.7888 16.3907 14.6734 16.394 14.5575ZM20.1252 15.5V16.4375C20.1252 16.6861 20.224 16.9246 20.3998 17.1004C20.5756 17.2762 20.8141 17.375 21.0627 17.375C21.3114 17.375 21.5498 17.2762 21.7256 17.1004C21.9015 16.9246 22.0002 16.6861 22.0002 16.4375V12.6875C22.0002 11.2913 21.6502 10.1063 20.909 9.2575C20.1515 8.3925 19.0927 8 17.9377 8C17.2752 8 16.7552 8.0875 16.3052 8.24375C15.8827 8.39 15.5552 8.58625 15.3002 8.73875L15.269 8.7575C15.0555 8.88514 14.9014 9.09236 14.8407 9.33357C14.8106 9.45301 14.8044 9.5772 14.8223 9.69906C14.8403 9.82091 14.882 9.93804 14.9452 10.0438C15.0084 10.1495 15.0918 10.2417 15.1907 10.3152C15.2895 10.3887 15.4019 10.442 15.5213 10.472C15.7625 10.5327 16.018 10.4951 16.2315 10.3675C16.5065 10.2025 16.6877 10.0963 16.919 10.0162C17.1415 9.93875 17.4477 9.875 17.9377 9.875C18.6577 9.875 19.1602 10.1075 19.4977 10.4925C19.7365 10.765 19.9402 11.1713 20.0477 11.75H17.834C16.0065 11.75 14.5115 12.9712 14.519 14.5675C14.5227 15.245 14.7577 15.9625 15.309 16.5138C15.8677 17.0737 16.6652 17.375 17.6252 17.375C18.8752 17.375 19.8127 16.4375 19.8127 15.5H20.1252Z" fill="#67696B"/>
              </svg>
              <p class="text-17">Font Size</p>
            </div>
            <div class="flex flex-row">
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.5L8 8L1.5 14.5" stroke="#0E0E0E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div id="accountSettings" class="w-full mt-6">
        <h2 class="text-light-mode-accent text-secondary mb-3.5">Account</h2>
        <div class="flex flex-col bg-settings-bg rounded-13">
          <div id="logOut" class="flex flex-row items-center justify-between w-full p-3.5">
            <div class="flex flex-row gap-2">
              <svg width="24" height="24" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 6V4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2H5C4.46957 2 3.96086 2.21071 3.58579 2.58579C3.21071 2.96086 3 3.46957 3 4V16C3 16.5304 3.21071 17.0391 3.58579 17.4142C3.96086 17.7893 4.46957 18 5 18H12C12.5304 18 13.0391 17.7893 13.4142 17.4142C13.7893 17.0391 14 16.5304 14 16V14" stroke="#67696B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 10H21L18 7M18 13L21 10" stroke="#67696B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <p class="text-17 text-light-mode-accent">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }
}

async function displayListOfCircles(data, user) {
  let circleListArr = data.UserCircle.map((obj) => {
    let circleName = document.createElement("p");
    circleName.className = "text-center text-secondary";
    circleName.textContent = obj.circle.name;
    return `
      <div id="${obj.circle.id}" userId="${user}" class="circle">
        <div class="flex justify-center">
          <img src="${obj.circle.picture}" class="rounded-full w-100 h-100 object-cover cursor-pointer border-circle border-black"/>
        </div>
        ${circleName.outerHTML}
      </div>`;
  });
  return circleListArr;
}

async function displayCreateAlbum() {
  pageName.textContent = `New Album`;

  leftHeaderButton.innerHTML = `<img src="/lightmode/close_icon.svg" alt="Close Button" id="closeButton">`;
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
        nav.classList.add("hidden");
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
          <div id="dropMore" class="flex-1 mx-auto items-center bg-light-grey w-full h-full border-t border-spacing-2 border-dashed border-grey">
            <form class="hidden">
              <input id="fileUpload" type="file" class="hidden" multiple="false"/>
            </form>
            <div class="flex flex-col justify-center items-center mx-auto">
              <div class="flex justify-center mt-28 md:mt-16 mb-5">
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

  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="albumConfirmationBackButton"/>`;

  pageName.textContent = "Post";

  rightHeaderButton.innerHTML = `<img src="/lightmode/create_button.svg" alt="Create Button" id="createAlbum"/>`;

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
        <img id="circleImage" class="w-62 h-62 rounded-full" src="/placeholder_image.svg"/>
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

async function displayCircle(circleData, user) {
  console.log("User:", user);
  console.log("hello", circleData)
  const backSpan = document.querySelector(".backSpan");
  console.log(backSpan)
  const circleId = backSpan.getAttribute("circleId");
  console.log(circleId)
  const imgElement = document.querySelector("#profileBackButton");
  console.log("back", imgElement);
  if (imgElement) {
    imgElement.classList.remove("hidden");
    imgElement.id = "circleToProfileButton"
  }
  console.log(imgElement);

  if (circleId === null) {
    const imgElement = document.querySelector("#albumToCircleButton");
    if (imgElement) {
      imgElement.id = "circleToProfileButton";
    }
  }


  rightHeaderButton.innerHTML = "";
  pageName.textContent = "";
  let currentUserProfilePicture = null;
  let currentUserUsername = null;
  const memberList = circleData.members.map((obj) => {
    if (obj.user.username === currentLocalUser) {
      currentUserProfilePicture = obj.user.profilePicture;
      currentUserUsername = obj.user.username;
    }
    return `<img src="${obj.user.profilePicture}" class="w-42 h-42 rounded-full object-cover"/>`;
  });
  const albumList = circleData.circle.albums.map((obj) => {
    let albumName = document.createElement("p");
    albumName.className = "text-white text-shadow shadow-black";
    albumName.textContent = obj.name;
    return `
      <div class="w-full h-min relative album" id="${obj.id}">
        <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0].src}"/>
        <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
          ${albumName.outerHTML}
        </div>
        <div class="absolute inset-0 flex items-end justify-end gap-1 p-2">
          <div class="like">
            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.22318 16.2905L9.22174 16.2892C6.62708 13.9364 4.55406 12.0515 3.11801 10.2946C1.69296 8.55118 1 7.05624 1 5.5C1 2.96348 2.97109 1 5.5 1C6.9377 1 8.33413 1.67446 9.24117 2.73128L10 3.61543L10.7588 2.73128C11.6659 1.67446 13.0623 1 14.5 1C17.0289 1 19 2.96348 19 5.5C19 7.05624 18.307 8.55118 16.882 10.2946C15.4459 12.0515 13.3729 13.9364 10.7783 16.2892L10.7768 16.2905L10 16.9977L9.22318 16.2905Z" stroke="white" stroke-width="2"/>
            </svg>
          </div>
          <div class="comment">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 19.125C8.79414 19.125 7.12658 18.6192 5.70821 17.6714C4.28983 16.7237 3.18434 15.3767 2.53154 13.8006C1.87873 12.2246 1.70793 10.4904 2.04073 8.81735C2.37352 7.14426 3.19498 5.60744 4.4012 4.40121C5.60743 3.19498 7.14426 2.37353 8.81735 2.04073C10.4904 1.70793 12.2246 1.87874 13.8006 2.53154C15.3767 3.18435 16.7237 4.28984 17.6714 5.70821C18.6192 7.12658 19.125 8.79414 19.125 10.5C19.125 11.926 18.78 13.2705 18.1667 14.455L19.125 19.125L14.455 18.1667C13.2705 18.78 11.925 19.125 10.5 19.125Z" stroke="#F8F4EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>`;
  });

  let circleName = document.createElement("p");
  circleName.className = "text-center text-20 font-bold";
  circleName.textContent = circleData.circle.name;
  pageContent.innerHTML = `
    <div id="circlePage" class="w-full px-0 mx-0">
      <div class="flex justify-center mt-6 mb-1.5">
        <img src="${circleData.circle.picture}" class="rounded-full w-180 h-180 object-cover"/>
      </div>
      <div class="mb-3">
        <p class="text-center text-20 font-bold">${circleName.outerHTML}</p>
      </div>
      <div class="grid grid-cols-1 place-items-center">
        <label class="inline-flex items-center cursor-pointer">
            <img id="privacyIcon" src="${circleData.circle.isPublic ? "/lightmode/globe_icon.svg" : "/lightmode/lock_icon.svg"}" alt="Lock icon" class="mr-4">
            <span id="privacyLabel" class="text-sm font-medium leading-body text-14 mr-4 w-12">
              ${circleData.circle.isPublic ? "Public" : "Private"}
            </span>
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
    </div>`;

  const albumListTarget = document.querySelector("#albumList");
  albumListTarget.addEventListener("click", async function (event) {
    event.preventDefault();
    const albumDiv = event.target.closest(".album");
    const like = event.target.closest(".like");
    const comment = event.target.closest(".comment");

    if (like) {
      if (like.classList.contains("liked")) {
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#FFFFFF");
      } else {
        like.classList.add("liked");
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
      }
      return;
    }

    if (comment) {
      await displayComments(albumDiv.id, currentUserProfilePicture, currentLocalUser);
      return;
    }

    if (albumDiv) {

      if (albumDiv.hasAttribute("id")) {
        let { success, data, error } = await getAlbum(albumDiv.id);
        if (success && data) {
          console.log("album");
          await displayAlbum(data);
        }
      }
    }
  });
}

async function displayCircleInvites() {
  pageName.textContent = "Circle Invites";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="toActivity">`;
  const { circleInvites } = await getActivities(currentLocalUser);
  let circleInviteList = circleInvites.map((invite) => {
    let circleName = document.createElement("h2");
    circleName.className = "font-medium text-14 leading-tertiary";
    circleName.textContent = invite.circle.name;
    return `
    <div class="flex items-center my-3">
      <div class="flex-none w-58">
        <img class="rounded-input-box w-58 h-58" src="${invite.circle.picture}" alt="${invite.circle.name}'s picture">
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

async function displayAlbum(albumData) {
  const backSpan = document.querySelector(".backSpan");
  backSpan.setAttribute("circleId", `${albumData.circle.id}`);
  const leftButtonImg = document.querySelector("#leftButton img");
  console.log(leftButtonImg)
  leftButtonImg.classList.remove("hidden");
  const profileBackButton = document.querySelector("#profileBackButton");
  console.log("profileback", profileBackButton)

  const albumId = document.querySelector(".album").getAttribute("id");
  console.log("albumId", albumId);
  
  const circleId = backSpan.getAttribute("circleId");
  console.log("circleId", circleId);
  const imgElement = document.querySelector("#circleToProfileButton");
  if ((!circleId) || (albumId)){
    if (profileBackButton) {
      profileBackButton.id = "albumToProfileButton";
    }
  }

  if (imgElement) {
    imgElement.id = "albumToCircleButton";
  }
  
  rightHeaderButton.innerHTML = `<img src="/lightmode/share_icon.svg" alt="Share Button" id="shareAlbum">`;
  pageName.textContent = `${albumData.name}`;

  const memberList = [];
  for (i = 0; i < albumData.circle.UserCircle.length; i++) {
    if (i > 3) {
      const count = albumData.circle.UserCircle.length - 3;
      const andMore = `<div class="w-25 h-25 rounded-full border-2 flex justify-center items-center bg-dark-grey">
        <p class="text-secondary text-white font-bold">+${count}</p>
      </div>`;
      memberList.push(andMore);
      break;
    }
    memberList.push(`<img id="user${i + 1}" src="${albumData.circle.UserCircle[i].user.profilePicture}" class="grid-item rounded-full object-cover">`);
  }

  console.log(memberList);
  const photoList = albumData.photos.map((obj) => {
    return `
    <div id="photo" class="w-full h-min relative photo" albumId="${obj.id}">
      <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.src}"/>
    </div>`;
  });
  let circleName = document.createElement("h2");
  circleName.className = "flex justify-center font-medium text-lg";
  circleName.textContent = albumData.circle.name;
  pageContent.innerHTML = `
    <div id="albumPhotos">
      <div id="memberList" class="grid grid-rows-2 grid-cols-3 mt-8 mx-auto items-center justify-center w-265 gap-2 h-84">
        ${memberList.join("")}
      </div>
      <div class="mt-4">
        ${circleName.outerHTML}
      </div>
      <div class="grid grid-cols-5 place-items-center mt-12 mb-2 mr-0">
        <p class="grid-span-1 text-base font-medium">${albumData.photos.length} Photos</p>
      </div>
      <div id="photoList" class="pb-28 w-full">
        <div class="columns-2 gap-4 space-y-4 grid-flow-row">
          ${photoList.join("")}
        </div>
      </div>
  </div>`;

  // album user display layout
  const user1 = document.querySelector("#user1");
  user1.classList.add("h-82", "w-82", "row-span-2", "col-start-2");

  const user2 = document.querySelector("#user2");
  if (user2) {
    user2.classList.add("h-43", "w-43", "col-start-1", "row-start-1", "justify-self-end");
  }

  const user3 = document.querySelector("#user3");
  if (user3) {
    user3.classList.add(
      "h-40", "w-40", "col-start-3", "row-start-2", "justify-self-start");
  }

  const user4 = document.querySelector("#user4");
  if (user4) {
    user4.classList.add("h-5", "w-5", "col-start-1", "row-start-2", "justify-self-end");
  }

  const albumPhotos = document.querySelector("#albumPhotos");
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

async function displayFriends(username) {
  nav.classList.add("hidden");

  // this is to show all users when the page first loads
  pageName.textContent = "Friends";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="friendsBackButton"/>`;
  rightHeaderButton.innerHTML = "";

  pageContent.innerHTML = `
    <div class="font-light text-11 justify-center text-center text-dark-grey w-full">
      <p>We don’t send notifications when you edit</p>
      <p>your Friends List.</p>
    </div>
    <div id="allFriendsList" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full">
      <div class="relative w-full h-9 mt-8">
        <form onkeydown="return event.key != 'Enter';">
          <input id="searchFriendsBox" class="w-380 px-10 py-2 border-grey border-2 rounded-input-box text-secondary leading-secondary" placeholder="search friends"/>
          <img src="/lightmode/search_icon_grey.svg" alt="search icon" class="absolute left-3 top-search w-25 h-25"/>
        </form>
      </div>
      <div class="shrink-0 mt-10 mb-6 justify-center w-full">
        <h1 id="friendCount" class="font-bold text-20 leading-body"></h1>
        <div id="friendsDiv"></div>
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
    friendsDiv.innerHTML = displayFriendsList(friends).join("");
    if (friends.length === 1) {
      friendCount.innerHTML = `${friends.length} friend`;
    } else if (friends.length > 1) {
      friendCount.innerHTML = `${friends.length} friends`;
    } else {
      friendCount.innerHTML = `No friends found`;
    }
  }

  await initializeSearch();

  searchBox.addEventListener("input", (event) => {
    const searchTerm = searchBox.value.toLowerCase();
    const filteredResults = friendsList.filter((user) =>
      user.username.toLowerCase().includes(searchTerm)
    );
    updateSuggestedFriends(filteredResults);
  });
}

function displayFriendsList(friends) {
  return friends.map((friend) => {
    let displayName = document.createElement("h2");
    let username = document.createElement("h2");
    displayName.className = "font-medium text-14 leading-tertiary";
    username.className = "font-light text-14 text-dark-grey";
    displayName.textContent = friend.displayName ? friend.displayName : friend.username;
    username.textContent = `@${friend.username}`;
    return `
      <div class="flex items-center my-5">
        <div class="flex-none w-58">
          <img class="rounded-full w-58 h-58" src="${friend.profilePicture}" alt="${friend.username}'s profile picture"/>
        </div>
        <div class="ml-8 flex-none w-207">
          ${displayName.outerHTML}
          ${username.outerHTML}
        </div>
        <div class="flex-none w-58">
          <div class="removeFriendIcon">
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 10.5C17.5 7.7375 15.2625 5.5 12.5 5.5C9.7375 5.5 7.5 7.7375 7.5 10.5C7.5 13.2625 9.7375 15.5 12.5 15.5C15.2625 15.5 17.5 13.2625 17.5 10.5ZM2.5 23V24.25C2.5 24.9375 3.0625 25.5 3.75 25.5H21.25C21.9375 25.5 22.5 24.9375 22.5 24.25V23C22.5 19.675 15.8375 18 12.5 18C9.1625 18 2.5 19.675 2.5 23ZM22.5 13H27.5C28.1875 13 28.75 13.5625 28.75 14.25C28.75 14.9375 28.1875 15.5 27.5 15.5H22.5C21.8125 15.5 21.25 14.9375 21.25 14.25C21.25 13.5625 21.8125 13 22.5 13Z" fill="#0E0E0E"/>
            </svg>
          </div>
        </div>
      </div>`;
  });
}

async function displayFriendRequests() {
  pageName.textContent = "Friend Requests";
  leftHeaderButton.innerHTML = `<img src="/lightmode/back_button.svg" alt="Back Button" id="toActivity"/>`;
  const { friendRequests } = await getActivities(currentLocalUser);

  let friendRequestsList = friendRequests.map((request) => {
    let username = document.createElement("h2");
    username.className = "font-medium text-14 leading-tertiary";
    username.textContent = `@${request.requester.username}`;
    const displayName = username.cloneNode(true);
    request.requester.displayName ? (displayName.textContent = request.requester.displayName) : (displayName.textContent = request.requester.username);
    return `
    <div class="flex items-center my-5">
    <div class="flex-none w-58">
      <img class="rounded-full w-58 h-58" src="${request.requester.profilePicture}" alt="${request.requester.username}'s profile picture"/>
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
        <button identifier="${request.requesterName}" sentTo="${request.requesteeName}" name="acceptFriendRequest" class="w-request h-request rounded-input-box bg-light-mode-accent">accept</button>
        <button identifier="${request.requesterName}" sentTo="${request.requesteeName}" name="declineFriendRequest" class="w-request h-request rounded-input-box bg-dark-grey">decline</button>
      </form>
    </div>
  </div>`;
  }).join("");

  pageContent.innerHTML = `<div id="friendRequestsList" class="flex flex-col pb-200">
    ${friendRequestsList}
  </div>`;
  const friendRequestsListPage = document.querySelector("#friendRequestsList");
  friendRequestsListPage.addEventListener("click", async function (event) {
    event.preventDefault();
    const id = event.target.getAttribute("identifier");
    const invitee = event.target.getAttribute("sentTo");
    switch (event.target.name) {
      case "acceptFriendRequest":
        await acceptFriendRequest(id, invitee);
        await displayFriendRequests();
        break;
      case "declineFriendRequest":
        await removeFriendRequest(id, invitee);
        await displayFriendRequests();
        break;
      default:
        break;
    }
  });
}

async function displayPhoto(photoSrc) {
  const albumPhotos = document.querySelector("#albumPhotos");
  const photoDiv = document.createElement("div");
  photoDiv.className = "absolute top-0 left-0 bg-overlay-bg h-screen w-screen flex justify-center items-center mx-auto z-20";
  photoDiv.id = "photoOverlay";
  const personalView = document.createElement("img");
  personalView.src = `${photoSrc}`;
  personalView.id = "image";
  personalView.className = "w-430 object-cover rounded-xl";

  photoDiv.appendChild(personalView);
  albumPhotos.appendChild(photoDiv);
}

async function displayListOfAlbums(data, user, profile = false) {
  console.log("HELLO", data, user);
  const albumList = data.Album.map((obj) => {
    let albumName = document.createElement("p");
    albumName.className = "text-white text-shadow shadow-black";
    albumName.textContent = obj.name;
    let userSpan = document.createElement("span");
    userSpan.className = "user";
    userSpan.setAttribute("username", `${user}`);
    const circleImage = `
    <div class="absolute top-0 right-0 m-2 flex items-start justify-end gap-1 p2">
      <img src="${obj.circle.picture}" class="w-8 rounded-full object-cover"/>
    </div>`;

    return `
    <div class="w-full h-min relative album" id="${obj.id}">
      ${userSpan.outerHTML}
      <img class="w-full max-h-56 h-min rounded-xl object-cover" src="${obj.photos[0].src}"/>
      ${profile ? circleImage : null}
      <div class="m-2 text-secondary font-semibold absolute inset-0 flex items-end justify-start">
        ${albumName.outerHTML}
      </div>
      <div class="absolute inset-0 flex items-end justify-end gap-1 p-2">
        <div class="like">
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.22318 16.2905L9.22174 16.2892C6.62708 13.9364 4.55406 12.0515 3.11801 10.2946C1.69296 8.55118 1 7.05624 1 5.5C1 2.96348 2.97109 1 5.5 1C6.9377 1 8.33413 1.67446 9.24117 2.73128L10 3.61543L10.7588 2.73128C11.6659 1.67446 13.0623 1 14.5 1C17.0289 1 19 2.96348 19 5.5C19 7.05624 18.307 8.55118 16.882 10.2946C15.4459 12.0515 13.3729 13.9364 10.7783 16.2892L10.7768 16.2905L10 16.9977L9.22318 16.2905Z" stroke="white" stroke-width="2"/>
          </svg>
        </div>
        <div class="comment" albumid="${obj.id}">
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 19.125C8.79414 19.125 7.12658 18.6192 5.70821 17.6714C4.28983 16.7237 3.18434 15.3767 2.53154 13.8006C1.87873 12.2246 1.70793 10.4904 2.04073 8.81735C2.37352 7.14426 3.19498 5.60744 4.4012 4.40121C5.60743 3.19498 7.14426 2.37353 8.81735 2.04073C10.4904 1.70793 12.2246 1.87874 13.8006 2.53154C15.3767 3.18435 16.7237 4.28984 17.6714 5.70821C18.6192 7.12658 19.125 8.79414 19.125 10.5C19.125 11.926 18.78 13.2705 18.1667 14.455L19.125 19.125L14.455 18.1667C13.2705 18.78 11.925 19.125 10.5 19.125Z" stroke="#F8F4EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>`;
  });
  return albumList;
}

async function displayComments(albumId, currentUserProfilePicture, currentUserUsername) {
  const fetchPfp = await getCurrentUserProfilePicture()
  if (fetchPfp.data && fetchPfp.success) {
    currentUserProfilePicture = fetchPfp.data
  }
  console.log("THIS", currentUserProfilePicture, currentUserUsername);
  const { success, data } = await getComments(albumId);

  //return early do something on error
  if (!(success && data)) {
    console.log("could not fetch comment data");
    return;
  }
  console.log(data);
  const showCommentsRecursively = (comments) => {
    const arr = comments.map((comment) => {
      const likeDiv = document.createElement("div");
      likeDiv.className = "like h-full";
      likeDiv.innerHTML = `
      <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.22318 16.6155L9.22174 16.6142C6.62708 14.2613 4.55406 12.3765 3.11801 10.6196C1.69296 8.87613 1 7.38119 1 5.82495C1 3.28843 2.97109 1.32495 5.5 1.32495C6.9377 1.32495 8.33413 1.99941 9.24117 3.05623L10 3.94038L10.7588 3.05623C11.6659 1.99941 13.0623 1.32495 14.5 1.32495C17.0289 1.32495 19 3.28843 19 5.82495C19 7.38119 18.307 8.87613 16.882 10.6196C15.4459 12.3765 13.3729 14.2613 10.7783 16.6142L10.7768 16.6155L10 17.3226L9.22318 16.6155Z" stroke="#0E0E0E" stroke-width="2"/>
      </svg>`;
      if (
        comment.likedBy !== null &&
        comment.likedBy.includes(currentUserUsername)
      ) {
        likeDiv.querySelector("svg path").setAttribute("fill", "#FF4646");
        likeDiv.querySelector("svg path").setAttribute("stroke", "#FF4646");
        likeDiv.classList.add("liked");
      }

      const posterH1 = document.createElement("h1");
      posterH1.className = "font-bold text-secondary";
      const poster = comment.user.displayName ? comment.user.displayName : comment.user.username;
      posterH1.textContent = poster;
      posterH1.textContent ? posterH1.textContent : (posterH1.textContent = "Deleted");
      const postMsgContainer = document.createElement("div");
      postMsgContainer.className = "comment-text-container flex-grow";
      const postMsg = document.createElement("p");
      postMsg.className = "text-wrap break-words";
      postMsg.textContent = comment.message ? comment.message : "message removed";
      postMsgContainer.appendChild(postMsg);

      return `<div class="comment relative flex flex-row items-start h-full my-4" id="${comment.id}" user="${comment.user.displayName ? comment.user.displayName : comment.user.username}">
      <div class="flex-none w-58 items-center h-full mr-1 mt-1">
        <img src="${comment.user.profilePicture ? comment.user.profilePicture : "/placeholder_image.svg"}" class="w-47 h-47 rounded-full">
      </div>
      <div class=" flex flex-col w-294">
        <div class="flex flex-row gap-2">
          ${posterH1.outerHTML}
          <p class="text-time text-11">${comment.createdAt}</p>
        </div>
          ${postMsgContainer.outerHTML}
        <div class="flex items-center space-x-2">
          <a class="text-time text-11 underline replyButton w-8">Reply</a>
          ${comment.user.username === currentLocalUser ? `<img src="/lightmode/more_options.svg" alt="more options"/ class="moreOptions w-5 h-5">` : ""}
        </div>
      </div>
      <div class="absolute right-0 top-2 flex flex-1 flex-col items-center">
        ${likeDiv.outerHTML}
        <div class="likeCount">
          <p class="h-3">${comment.likeCount}</p>
        </div>
      </div>
    </div>
    ${comment.replies ? `<div class="parentComment"><div class="childComment border-l border-comment-line pl-2 ml-3">${showCommentsRecursively(comment.replies)}</div></div>` : ""}`;
    });
    return arr.join("");
  };

  const modal = document.querySelector("#modal");
  modal.classList.remove("hidden");
  modal.classList.add("shown");
  const modalContent = document.querySelector("#modalContent");
  modalContent.innerHTML = `
  <div class="flex flex-col max-w-430 max-h-527 justify-center mx-auto text-black">
    <div class="border-b-circle border-comment-divider mb-5">
      <h1 class="font-semibold text-23 text-center mb-2">Comments</p>
    </div>
    <div class="albumComments my-2 max-h-400 overflow-y-scroll">
    ${showCommentsRecursively(data)}
    </div>
    <div class="flex w-full items-end mt-2">
      <div class="relative flex flex-row mr-3">
        <img class="rounded-full h-47 w-47" src="${currentUserProfilePicture}" alt="${currentUserUsername}'s profile picture"/>
      </div>
      <div id="comment" class="relative flex-1 h-full rounded-input-box">
        <div id="replyContent"></div>
        <div class="flex items-center mt-4">
          <button id="submitComment" class="absolute right-0 mr-3 bg-light-mode-accent rounded-input-box p-2">
            <img src="/lightmode/up_arrow_icon.svg" class="h-5 w-5"/>
          </button>
          <input id="commentInput" class="w-full h-47 p-3 rounded-input-box border-2" placeholder="enter a comment">
        </div>
      </div>
    </div>
  </div>`;

  const albumCommentSection = document.querySelector(".albumComments");
  let commentId = null;
  albumCommentSection.addEventListener("click", async function (event) {
    event.preventDefault();
    console.log(event.target.tagName);
    switch (event.target.tagName) {
      case "A":
        if (event.target.className.includes("replyButton")) {
          const comment = document.querySelector("#comment");
          comment.classList.remove("bg-transparent");
          comment.classList.add("border-2", "bg-light-mode-accent");
          commentId = event.target.closest("div.comment").id;
          commentUser = event.target.closest("div.comment").getAttribute("user");
          const commentInput = document.querySelector("#commentInput");
          if (commentInput) {
            commentInput.id = "replyInput";
            commentInput.placeholder = "enter a reply";
          }

          const replyContent = document.querySelector("#replyContent");
          replyContent.innerHTML = `
          <div class="flex justify-between items-center p-3">
            <p class="text-white ml-1">Replying to @${commentUser}</p>
            <button id="closeReply" class="h-4 w-4 mr-2">
              <svg viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 5L19 19M5 19L19 5" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path> </g>
              </svg>
            </button>
          </div>`;

          comment.querySelector("#closeReply").addEventListener("click", () => {
            comment.classList.add("bg-transparent");
            comment.classList.remove("border-2", "bg-light-mode-accent");

            const replyInput = document.querySelector("#replyInput");
            replyInput.id = "commentInput";
            replyInput.placeholder = "enter a comment";

            replyContent.innerHTML = "";
          });

          // await newComment(newCommentInput.value, albumId, commentId)
        }
        break;
      case "IMG":
        if (event.target.className.includes("moreOptions")) {
          commentId = event.target.closest("div.comment").id;
          console.log("COMMENTID", commentId)
          console.log("more");
          const helperObj = { currentUserProfilePicture, albumId, commentId }
          console.log("HELPER OBJ OUTSIDE")
          console.log(helperObj)
          await displayConfirmationPopup("delete comment", helperObj);
        }
      default:
        break;
    }

    const like = event.target.closest(".like");
    if (like) {
      if (like.classList.contains("liked")) {
        commentId = event.target.closest("div.comment").id;
        like.classList.remove("liked");
        like.querySelector("svg path").setAttribute("fill", "none");
        like.querySelector("svg path").setAttribute("stroke", "#000000");
        await likeComment(commentId);
        await displayComments(albumId, currentUserProfilePicture, currentLocalUser);
      } else {
        like.classList.add("liked");
        commentId = event.target.closest("div.comment").id;
        like.querySelector("svg path").setAttribute("fill", "#FF4646");
        like.querySelector("svg path").setAttribute("stroke", "#FF4646");
        await likeComment(commentId);
        return await displayComments(albumId, currentUserProfilePicture, currentLocalUser);
      }
      return;
    }
  });

  const newCommentInput = document.querySelector("#commentInput");
  newCommentInput.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      console.log(newCommentInput.value);
      console.log(newCommentInput);
      console.log(albumId, commentId);
      newCommentInput.id === "replyInput"
        ? await newComment(newCommentInput.value, albumId, commentId)
        : await newComment(newCommentInput.value, albumId);
      await displayComments(albumId, currentUserProfilePicture, currentLocalUser);
    }
  });
  const submitComment = document.querySelector("#submitComment");
  submitComment.addEventListener("click", async function (event) {
    event.preventDefault();
    const enterKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
    newCommentInput.dispatchEvent(enterKeyEvent);
  });
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
  console.log("confirmation popup");
  const confirmationText = document.querySelector("#confirmationText");
  confirmationText.textContent = `${activity}`;
  const confirmationPopup = document.querySelector("#confirmationPopup");
  confirmationPopup.classList.remove("hidden");
  confirmationPopup;

  const confirmEventHandler = async (event) => {
    event.stopImmediatePropagation();
    const cancelButton = event.target.closest("#cancelButton");
    const contextButton = event.target.closest("#contextButton");
    if (cancelButton) {
      confirmationPopup.removeEventListener("click", confirmEventHandler, true)
      confirmationPopup.classList.add("hidden");
    }

    if (contextButton) {
      if (activity === "delete comment") {
        console.log("HELPEROBJECT")
        console.log(helperObj)
        await deleteComment(helperObj.commentId);
        
        confirmationPopup.classList.add("hidden");
        confirmationText.textContent = "";
        confirmationPopup.removeEventListener("click", confirmEventHandler, true)
        await displayComments(
          helperObj.albumId,
          helperObj.currentUserProfilePicture,
          currentLocalUser
        );
      }
    }
  }

  confirmationPopup.addEventListener("click", confirmEventHandler, true);
  
}
