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
        console.log("create circle")
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