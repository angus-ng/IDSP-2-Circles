async function handleCreateCircle() {
  try {
    const circlePhoto = document.querySelector("#circleImage");
    const circleName = document.querySelector("#circleName").value;

    if (!circleName) {
      return { success: true, data: null };
    }

    const formData = new FormData();
    formData.append("picturePath", circlePhoto.src);
    formData.append("circleName", circleName);
    const response = await fetch("/circle/create", {
      method: "POST",
      body: formData,
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return { success: true, data: null, error };
  }
}

async function handleSendCircleRequest(requestee) {
  try {
    const circleName = document.querySelector("#circleName").value;
    if (!circleName) {
      return { success: true, data: null };
    }
    console.log("CIRCLENAME", circleName)
    console.log(requestee)
    const input = {
      requestee: requestee,
      circleName: circleName
    }
    // const formData = new FormData();
    // formData.append("requestee", requestee);
    // formData.append("circleName", circleName);
    const response = await fetch("/circle/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input)
    });
    const jsonResponse = await response.json();
    console.log("JSONRESPONSE", jsonResponse)
    return jsonResponse;
  } catch (error) {
    return { success: true, data: null, error };
  }
}

async function handleCreateAlbum() {
  try {
  } catch (error) {}
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
  try {
    const response = await fetch(`/circle/${circleId}`);
    responseJson = await response.json();

    console.log(responseJson);
    return responseJson;
  } catch (err) {}
}

async function getAlbum(albumId) {
  try {
    const response = await fetch(`/album/${albumId}`);
    const responseJson = await response.json();

    return responseJson;
  } catch (err) {}
}

async function handleCreateAlbum(albumObj) {
  try {
    if (!albumObj.name) {
      return { success: true, data: null };
    }
    console.log(albumObj);
    let response = await fetch("/album/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(albumObj),
    });

    const jsonResponse = await response.json();

    return jsonResponse;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function getFriends(username) {
  const response = await fetch(`/user/getFriends/${username}`);
  const responseJson = await response.json();
  return responseJson.data;
}
