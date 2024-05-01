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
        const modal = document.querySelector("#modal");
        modal.classList.remove("hidden");
        modal.classList.add("shown");

        if (modal.classList.contains("shown")) {
            const closeModal = event.target.closest("#closeModalButton");

            if (closeModal) {
                modal.classList.remove("shown");
                modal.classList.add("hidden");
            }

        }

    }
    if (activityButton) {
        console.log("activity")
    }
    if (profileButton) {
        console.log("profile")
    }
})