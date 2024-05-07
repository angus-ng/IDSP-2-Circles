async function handleCreateCircle() {
  const circlePhoto = document.querySelector("#circleImage");
  const circleName = document.querySelector("#circleName").value;

  if (circleName) {
    const formData = new FormData();
    formData.append("picturePath", circlePhoto.src);
    formData.append("circleName", circleName);
    console.log("formdata", formData);
    try {
      const response = await fetch("/circle/create", {
        method: "POST",
        body: formData,
      });
      console.log("Circle created successfully:", await response.json());
      return await response.json();
    } catch (error) {
      //throw new Error(error);
    }
  } else {
    //throw new Error("Please put a name for your circle");
  }
}

async function handleSelectFile() {
  const fileInput = document.querySelector("#myInput");
  const file = fileInput.files[0];
  if (!file) {
    return;
  }

  return await uploadFile(file);
}

async function uploadFile(file) {
  // console.log(file);
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await (
      await fetch("/circle/upload", {
        method: "POST",
        body: formData,
      })
    ).json();
    return await response;
  } catch (error) {
    throw new Error(error);
  }
}

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

async function getSessionFromBackend() {
  try {
    const response = await fetch("/auth/getSession");
    const jsonResponse = await response.json();
    return jsonResponse.username;
  } catch (error) {}
}

async function getCircle(circleId) {
  try{
    const response = await fetch(`/circle/${circleId}`)
    responseJson = await response.json()

    console.log(responseJson)
    return responseJson
    
  } catch (err) {

  }
}