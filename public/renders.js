function displayLoginPage() {
  pageContent.innerHTML = `
    <div id="loginPage" class="flex flex-col items-center rounded-lg w-full z-10">
      <div class="flex-shrink-0 mt-2 mb-6">
          <img src="/lightmode/logo_with_wordmark.svg" alt="Logo with Wordmark"/>  
      </div>
      <form action="/auth/login">
      <button>
      <img src="/lightmode/login_button.svg" alt="Login Button"/>
      </button>
      </form>
      <form action="/auth/register">
      <button>
      Register ( put a register button here)
      </button>
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
          </div>

      <div class="flex items-center justify-between mt-6 gap-1">
          <p class="text-secondary leading-secondary">Don't have an account?</p>
          <a id="signUp" class="text-secondary leading-secondary text-light-mode-accent text-decoration-line: underline cursor-pointer">Sign up</a>
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
  const modal = document.querySelector("#modal");
  modal.classList.remove("hidden");
  modal.classList.add("shown");
  const closeModalButton = document.querySelector("#closeModalButton");
  closeModalButton.classList.remove("hidden");
  const modalContent = document.querySelector("#modalContent");
  modalContent.innerHTML = `
  <div class="flex flex-row gap-6 justify-center text-light-mode-accent font-medium text-14 text-center">
    <button id="createAlbumModalButton" class="ml-1 flex-col">
        <img src="/lightmode/create_album_icon.svg" alt="New Album Icon">
        <p class="mt-3 text-center">create album</p>
    </button>
    <button id="createCircleModalButton" class="ml-1 flex-col">
        <img src="/lightmode/create_circle_icon.svg" alt="New Circle Icon">
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
    confirmationIcon.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 10.5C17.5 7.7375 15.2625 5.5 12.5 5.5C9.7375 5.5 7.5 7.7375 7.5 10.5C7.5 13.2625 9.7375 15.5 12.5 15.5C15.2625 15.5 17.5 13.2625 17.5 10.5ZM2.5 23V24.25C2.5 24.9375 3.0625 25.5 3.75 25.5H21.25C21.9375 25.5 22.5 24.9375 22.5 24.25V23C22.5 19.675 15.8375 18 12.5 18C9.1625 18 2.5 19.675 2.5 23ZM22.5 13H27.5C28.1875 13 28.75 13.5625 28.75 14.25C28.75 14.9375 28.1875 15.5 27.5 15.5H22.5C21.8125 15.5 21.25 14.9375 21.25 14.25C21.25 13.5625 21.8125 13 22.5 13Z" fill="#0E0E0E"></path>
    </svg>`;
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

    confirmationIcon.innerHTML = `
    <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier"> <path d="M11.5 9.00011L10 12.0001H14L12.5 15.0001M20 12.0001C20 16.4612 14.54 19.6939 12.6414 20.6831C12.4361 20.7901 12.3334 20.8436 12.191 20.8713C12.08 20.8929 11.92 20.8929 11.809 20.8713C11.6666 20.8436 11.5639 20.7901 11.3586 20.6831C9.45996 19.6939 4 16.4612 4 12.0001V8.21772C4 7.4182 4 7.01845 4.13076 6.67482C4.24627 6.37126 4.43398 6.10039 4.67766 5.88564C4.9535 5.64255 5.3278 5.50219 6.0764 5.22146L11.4382 3.21079C11.6461 3.13283 11.75 3.09385 11.857 3.07839C11.9518 3.06469 12.0482 3.06469 12.143 3.07839C12.25 3.09385 12.3539 3.13283 12.5618 3.21079L17.9236 5.22146C18.6722 5.50219 19.0465 5.64255 19.3223 5.88564C19.566 6.10039 19.7537 6.37126 19.8692 6.67482C20 7.01845 20 7.4182 20 8.21772V12.0001Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g>
    </svg>`;
  }

  if (activity === "delete comment") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Once these items are be deleted. This</p>
      <p class="text-14">can not be undone</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 3.55357V4.57143H1.0625C0.780707 4.57143 0.510456 4.67867 0.311199 4.86955C0.111942 5.06044 0 5.31933 0 5.58929C0 5.85924 0.111942 6.11813 0.311199 6.30902C0.510456 6.4999 0.780707 6.60714 1.0625 6.60714H1.4875L2.64208 17.6679C2.69475 18.1699 2.94015 18.6353 3.33069 18.9738C3.72122 19.3123 4.22907 19.4998 4.75575 19.5H12.2442C12.7709 19.4998 13.2788 19.3123 13.6693 18.9738C14.0599 18.6353 14.3052 18.1699 14.3579 17.6679L15.5125 6.60714H15.9375C16.2193 6.60714 16.4895 6.4999 16.6888 6.30902C16.8881 6.11813 17 5.85924 17 5.58929C17 5.31933 16.8881 5.06044 16.6888 4.86955C16.4895 4.67867 16.2193 4.57143 15.9375 4.57143H12.75V3.55357C12.75 2.74371 12.4142 1.96703 11.8164 1.39437C11.2186 0.821715 10.4079 0.5 9.5625 0.5H7.4375C6.59212 0.5 5.78137 0.821715 5.1836 1.39437C4.58582 1.96703 4.25 2.74371 4.25 3.55357ZM7.4375 2.53571C7.15571 2.53571 6.88546 2.64295 6.6862 2.83384C6.48694 3.02472 6.375 3.28362 6.375 3.55357V4.57143H10.625V3.55357C10.625 3.28362 10.5131 3.02472 10.3138 2.83384C10.1145 2.64295 9.84429 2.53571 9.5625 2.53571H7.4375ZM5.7375 7.28571C5.87707 7.27895 6.01666 7.29864 6.14827 7.34364C6.27989 7.38864 6.40095 7.45807 6.50451 7.54795C6.60808 7.63783 6.69212 7.74641 6.75182 7.86745C6.81151 7.9885 6.8457 8.11964 6.85242 8.25336L7.242 15.7176C7.25239 15.9851 7.15236 16.2458 6.96357 16.4432C6.77479 16.6405 6.51244 16.7587 6.23336 16.7721C5.95428 16.7855 5.68093 16.693 5.47251 16.5147C5.2641 16.3364 5.13739 16.0866 5.11983 15.8194L4.73025 8.35514C4.723 8.22154 4.7433 8.08789 4.79001 7.96181C4.83672 7.83574 4.90891 7.71973 5.00246 7.6204C5.09601 7.52108 5.20908 7.44039 5.3352 7.38297C5.46133 7.32554 5.59803 7.29249 5.7375 7.28571ZM11.2625 7.28571C11.402 7.29232 11.5387 7.3252 11.6649 7.38246C11.7911 7.43973 11.9043 7.52026 11.9979 7.61946C12.0916 7.71866 12.164 7.83457 12.2108 7.96057C12.2577 8.08657 12.2782 8.22019 12.2712 8.35379L11.8816 15.8181C11.864 16.0852 11.7373 16.335 11.5289 16.5133C11.3205 16.6916 11.0471 16.7841 10.7681 16.7707C10.489 16.7573 10.2266 16.6392 10.0378 16.4418C9.84906 16.2444 9.74903 15.9838 9.75942 15.7163L10.149 8.252C10.1633 7.98266 10.2886 7.72976 10.4974 7.54885C10.7061 7.36793 10.9813 7.27242 11.2625 7.28571Z" fill="#0E0E0E"/>
    </svg>`;
  }

  if (activity === "delete circle") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Deleting a circle is permanent.</p>
      <p class="text-14">This action can not be undone.</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 3.55357V4.57143H1.0625C0.780707 4.57143 0.510456 4.67867 0.311199 4.86955C0.111942 5.06044 0 5.31933 0 5.58929C0 5.85924 0.111942 6.11813 0.311199 6.30902C0.510456 6.4999 0.780707 6.60714 1.0625 6.60714H1.4875L2.64208 17.6679C2.69475 18.1699 2.94015 18.6353 3.33069 18.9738C3.72122 19.3123 4.22907 19.4998 4.75575 19.5H12.2442C12.7709 19.4998 13.2788 19.3123 13.6693 18.9738C14.0599 18.6353 14.3052 18.1699 14.3579 17.6679L15.5125 6.60714H15.9375C16.2193 6.60714 16.4895 6.4999 16.6888 6.30902C16.8881 6.11813 17 5.85924 17 5.58929C17 5.31933 16.8881 5.06044 16.6888 4.86955C16.4895 4.67867 16.2193 4.57143 15.9375 4.57143H12.75V3.55357C12.75 2.74371 12.4142 1.96703 11.8164 1.39437C11.2186 0.821715 10.4079 0.5 9.5625 0.5H7.4375C6.59212 0.5 5.78137 0.821715 5.1836 1.39437C4.58582 1.96703 4.25 2.74371 4.25 3.55357ZM7.4375 2.53571C7.15571 2.53571 6.88546 2.64295 6.6862 2.83384C6.48694 3.02472 6.375 3.28362 6.375 3.55357V4.57143H10.625V3.55357C10.625 3.28362 10.5131 3.02472 10.3138 2.83384C10.1145 2.64295 9.84429 2.53571 9.5625 2.53571H7.4375ZM5.7375 7.28571C5.87707 7.27895 6.01666 7.29864 6.14827 7.34364C6.27989 7.38864 6.40095 7.45807 6.50451 7.54795C6.60808 7.63783 6.69212 7.74641 6.75182 7.86745C6.81151 7.9885 6.8457 8.11964 6.85242 8.25336L7.242 15.7176C7.25239 15.9851 7.15236 16.2458 6.96357 16.4432C6.77479 16.6405 6.51244 16.7587 6.23336 16.7721C5.95428 16.7855 5.68093 16.693 5.47251 16.5147C5.2641 16.3364 5.13739 16.0866 5.11983 15.8194L4.73025 8.35514C4.723 8.22154 4.7433 8.08789 4.79001 7.96181C4.83672 7.83574 4.90891 7.71973 5.00246 7.6204C5.09601 7.52108 5.20908 7.44039 5.3352 7.38297C5.46133 7.32554 5.59803 7.29249 5.7375 7.28571ZM11.2625 7.28571C11.402 7.29232 11.5387 7.3252 11.6649 7.38246C11.7911 7.43973 11.9043 7.52026 11.9979 7.61946C12.0916 7.71866 12.164 7.83457 12.2108 7.96057C12.2577 8.08657 12.2782 8.22019 12.2712 8.35379L11.8816 15.8181C11.864 16.0852 11.7373 16.335 11.5289 16.5133C11.3205 16.6916 11.0471 16.7841 10.7681 16.7707C10.489 16.7573 10.2266 16.6392 10.0378 16.4418C9.84906 16.2444 9.74903 15.9838 9.75942 15.7163L10.149 8.252C10.1633 7.98266 10.2886 7.72976 10.4974 7.54885C10.7061 7.36793 10.9813 7.27242 11.2625 7.28571Z" fill="#0E0E0E"/>
    </svg>`;
  }

  if (activity === "delete album") {
    confirmationDetails.innerHTML = `
      <p class="text-14">Deleting an album is permanent.</p>
      <p class="text-14">Photos and comments will be removed.</p>
      <p class="text-14">This action can not be undone.</p>`;
    contextButton.textContent = "Delete";
    confirmationIcon.innerHTML = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 3.55357V4.57143H1.0625C0.780707 4.57143 0.510456 4.67867 0.311199 4.86955C0.111942 5.06044 0 5.31933 0 5.58929C0 5.85924 0.111942 6.11813 0.311199 6.30902C0.510456 6.4999 0.780707 6.60714 1.0625 6.60714H1.4875L2.64208 17.6679C2.69475 18.1699 2.94015 18.6353 3.33069 18.9738C3.72122 19.3123 4.22907 19.4998 4.75575 19.5H12.2442C12.7709 19.4998 13.2788 19.3123 13.6693 18.9738C14.0599 18.6353 14.3052 18.1699 14.3579 17.6679L15.5125 6.60714H15.9375C16.2193 6.60714 16.4895 6.4999 16.6888 6.30902C16.8881 6.11813 17 5.85924 17 5.58929C17 5.31933 16.8881 5.06044 16.6888 4.86955C16.4895 4.67867 16.2193 4.57143 15.9375 4.57143H12.75V3.55357C12.75 2.74371 12.4142 1.96703 11.8164 1.39437C11.2186 0.821715 10.4079 0.5 9.5625 0.5H7.4375C6.59212 0.5 5.78137 0.821715 5.1836 1.39437C4.58582 1.96703 4.25 2.74371 4.25 3.55357ZM7.4375 2.53571C7.15571 2.53571 6.88546 2.64295 6.6862 2.83384C6.48694 3.02472 6.375 3.28362 6.375 3.55357V4.57143H10.625V3.55357C10.625 3.28362 10.5131 3.02472 10.3138 2.83384C10.1145 2.64295 9.84429 2.53571 9.5625 2.53571H7.4375ZM5.7375 7.28571C5.87707 7.27895 6.01666 7.29864 6.14827 7.34364C6.27989 7.38864 6.40095 7.45807 6.50451 7.54795C6.60808 7.63783 6.69212 7.74641 6.75182 7.86745C6.81151 7.9885 6.8457 8.11964 6.85242 8.25336L7.242 15.7176C7.25239 15.9851 7.15236 16.2458 6.96357 16.4432C6.77479 16.6405 6.51244 16.7587 6.23336 16.7721C5.95428 16.7855 5.68093 16.693 5.47251 16.5147C5.2641 16.3364 5.13739 16.0866 5.11983 15.8194L4.73025 8.35514C4.723 8.22154 4.7433 8.08789 4.79001 7.96181C4.83672 7.83574 4.90891 7.71973 5.00246 7.6204C5.09601 7.52108 5.20908 7.44039 5.3352 7.38297C5.46133 7.32554 5.59803 7.29249 5.7375 7.28571ZM11.2625 7.28571C11.402 7.29232 11.5387 7.3252 11.6649 7.38246C11.7911 7.43973 11.9043 7.52026 11.9979 7.61946C12.0916 7.71866 12.164 7.83457 12.2108 7.96057C12.2577 8.08657 12.2782 8.22019 12.2712 8.35379L11.8816 15.8181C11.864 16.0852 11.7373 16.335 11.5289 16.5133C11.3205 16.6916 11.0471 16.7841 10.7681 16.7707C10.489 16.7573 10.2266 16.6392 10.0378 16.4418C9.84906 16.2444 9.74903 15.9838 9.75942 15.7163L10.149 8.252C10.1633 7.98266 10.2886 7.72976 10.4974 7.54885C10.7061 7.36793 10.9813 7.27242 11.2625 7.28571Z" fill="#0E0E0E"/>
    </svg>`;
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
      console.log("activity", activity)
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
      const andMore = `<div class="w-8 h-8 rounded-full border-2 border-white border-solid ml-neg12 flex justify-center items-center bg-dark-grey">
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
                  ${friendRequests.length
                      ? friendRequestsPreviews.join("")
                      : noFriendRequests}
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
  console.log(secondaryOrigin)

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

  console.log(navigationHistory, navigationHistory.length)
  
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

  pageContent.innerHTML = `
  <div id="profilePage" class="relative pt-2 pb-16 mb-4 w-full">
    ${currentLocalUser === userData.username ? `<div id="settings" class="absolute top-0 right-0 w-6 h-6 items-center justify-center cursor-pointer"><img src="/lightmode/settings_icon.svg"></div>` : ""}
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
    <div id="addAsFriend" class="flex justify-center">

    </div>
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
    console.log(userData)

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
      <div class="flex justify-center mt-2">
        ${userData.displayName ? userData.displayName : userData.username}
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
    console.log("FEED", data)
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