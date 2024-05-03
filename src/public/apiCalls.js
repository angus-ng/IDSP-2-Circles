async function handleCreateCircle() {
  const circlePhoto = document.querySelector("#circleImage");
  const circleName = document.querySelector("#circleName").value;

  if (circleName) {
    const formData = new FormData();
    formData.append("picturePath", circlePhoto.src);
    formData.append("circleName", circleName);
    console.log("formdata", formData);
    try {
      const res = await fetch("/circle/create", {
        method: "POST",
        body: formData,

      });
      console.log("Circle created successfully:", await res.json());
      return res;
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

  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await (
      await fetch("/circle/upload", {
        method: "POST",
        body: formData,
      })
    ).json();
    return await res;
  } catch (error) {
    throw new Error(error);
  }
}
