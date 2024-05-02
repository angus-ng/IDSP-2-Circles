const headerLeftButton = document.querySelector("#leftButton");
const headerRightButton = document.querySelector("#rightButton");


function createNewCircle() {

    headerLeftButton.innerHTML = `
    <i class="fa-solid fa-arrow-left-long"></i>
    `;
    headerRightButton.innerHTML = `
    <p class="mb-4 font-normal text-15 leading-body">Next</p>
    `;

    let circleDiv = document.createElement("div");
    circleDiv.innerHTML = "";
}

// create Cirlcle/Album modal
const modal = document.querySelector("#modal");
modal.addEventListener("click", function (event) {
    event.preventDefault();
    const closeModal = event.target.closest("#closeModalButton");
    const createAlbumModalButton = event.target.closest("#createAlbumModalButton");
    const createCircleModalButton = event.target.closest("#createCircleModalButton");

    if (closeModal) {
        if (modal.classList.contains("shown")) {
            modal.classList.remove("shown");
            modal.classList.add("hidden");
        }
    }

    if (createAlbumModalButton) {
        console.log("create album")
    }

    if (createCircleModalButton) {

        modal.classList.remove("shown");
        modal.classList.add("hidden");
        const pageContent = document.querySelector("#pageContent");
        pageContent.innerHTML = `
        <div id="createNewCircle" class="flex flex-col items-center p-4 bg-light-mode rounded-lg w-full z-10">
            <div class="flex-shrink-0 mt-20 mb-10">
                <img src="/placeholder_image.svg" alt="Placeholder Image">                     
            </div>
        
            <div class="flex-1">
                <form action="" class="flex flex-col">
                    <div class="flex items-center mt-8 mb-14">
                        <label for="circleName" class="font-medium text-h2 mr-6">Name</label>
                        <input
                        type="text"
                        placeholder="add a title to your album..."
                        id="circleName"
                        class="w-full bg-light-mode-bg text-20 items-end border-none"
                        />
                    </div>
                    <div id="divider" class="my-4">
                        <img src="/divider_light.svg" alt="Divider">                          
                    </div>
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
        `
        //This needs to be implemented when SPA creates the html for the privacy toggle
        const privacyCheckbox = document.querySelector("#privacyCheckbox");
        privacyCheckbox.addEventListener("change", function(event) {
            const privacyIcon = document.querySelector("#privacyIcon");
            const privacyLabel = document.querySelector("#privacyLabel");
            if (this.checked) {
                privacyIcon.src = "/globe_icon_light.svg"
                privacyLabel.innerHTML = "Public";
                return;
            }
            privacyIcon.src = "/lock_icon_light.svg";
            privacyLabel.innerHTML = "Private";
        });
        return;
    }
})

const navBar = document.querySelector("footer")
navBar.addEventListener("click", function (event) {
    event.preventDefault();
    const exploreButton = event.target.closest("#explore");
    const searchButton = event.target.closest("#search");
    const newButton = event.target.closest("#new");
    const activityButton = event.target.closest("#activity");
    const profileButton = event.target.closest("#profile");

    if (exploreButton) {
        console.log("explore")
    }
    if (searchButton) {
        console.log("search")
    }
    if (newButton) {
        modal.classList.remove("hidden");
        modal.classList.add("shown");
    }
    if (activityButton) {
        console.log("activity")
    }
    if (profileButton) {
        console.log("profile")
    }
})