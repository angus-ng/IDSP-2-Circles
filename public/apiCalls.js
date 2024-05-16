const { json } = require("stream/consumers");

async function handleCreateCircle() {
  try {
    const circlePhoto = document.querySelector("#circleImage");
    const circleName = document.querySelector("#circleName").value;

    if (!circleName) {
      return { success: true, data: null, error: "Missing circle name"};
    }
    
    const formData = new FormData();
    formData.append("picturePath", circlePhoto.src);
    formData.append("circleName", circleName);
    formData.append("isPublic", isPrivacyPublic)
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

async function handleSendCircleRequest(requestee, circleId) {
  try {
    const input = {
      requestee: requestee,
      circleId: circleId,
    };
    const response = await fetch("/circle/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    return { success: true, data: null, error };
  }
}

async function handleSelectFile() {
  const fileInput = document.querySelector("#fileUpload");
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
      return { success: true, data: null, error: "Missing album name" };
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
  console.log("GET", username)
  const response = await fetch(`/user/getFriends/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username})
  });
  const responseJson = await response.json();
  return responseJson.data;
}

async function getActivities() {
  const response = await fetch(`/user/getActivities/`);
  const responseJson = await response.json();
  return responseJson.data;
}

async function acceptCircleInvite(id, invitee) {
  try {
    const inviteObj = {
      id: id,
      invitee: invitee,
    };
    const response = await fetch("/circle/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inviteObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function declineCircleInvite(id, invitee) {
  try {
    const inviteObj = {
      id: id,
      invitee: invitee,
    };
    const response = await fetch("/circle/decline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inviteObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function acceptAlbumInvite(id, invitee) {
  try {
    const inviteObj = {
      id: id,
      invitee: invitee,
    };
    const response = await fetch("/album/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inviteObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function acceptFriendRequest(requester, requestee) {
  try {
    const requestObj = {
      requester: requester,
      requestee: requestee,
    };
    const response = await fetch("/user/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse.data;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function removeFriendRequest(user1, user2) {
  try {
    const requestObj = {
      user1: user1,
      user2: user2,
    };
    const response = await fetch("/user/removeRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse.data;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function unfriend(requestee, requester) {
  try {
    const requestObj = {
      requester: requester,
      requestee: requestee,
    };
    const response = await fetch("/user/unfriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse.data;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function getSearchResult(input) {
  try {
    if (input.trim() === "") {
      const response = await fetch(`/user/searchAll`);

      const jsonResponse = await response.json();
      console.log(jsonResponse)
      return jsonResponse;
    }
    const response = await fetch(`/user/search/${input.trim()}/`);

    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return jsonResponse;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function sendFriendRequest(requestee, requester) {
  try {
    const requestObj = {
      requester: requester,
      requestee: requestee,
    };
    const response = await fetch("/user/sendFriendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    });

    const jsonResponse = await response.json();
    return jsonResponse.data;
  } catch (err) {
    return { success: true, data: null, error: err };
  }
}

async function getUser(username) {
  try {
    const response = await fetch(`/user/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username})
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return jsonResponse
  } catch (err) {

  }
}

async function getComments(albumId) {
  try {
    const response = await fetch(`/album/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({albumId})
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return jsonResponse
  } catch (err) {

  }
}

async function newComment(message, albumId, commentId="") {
  try {
    if (!message || !albumId) {
      return;
    }
    const commentObj = {
      message,
      albumId,
      commentId
    }
    const response = await fetch(`/album/comment/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commentObj)
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return jsonResponse
  } catch (err) {

  }
}

async function deleteComment(commentId) {
  try {
    const response = await fetch(`/album/comment/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({commentId})
    })
    const jsonResponse = await response.json();
    console.log(jsonResponse)
    return jsonResponse
  } catch (err) {

  }
}

async function likeComment(commentId) {
  try {
    const response = await fetch(`/album/comment/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({commentId})
    });

    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse
  } catch (err) {

  }
}