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