async function handleCreateCircle() {
  const circlePhoto = document.querySelector("#circleImage");
  const circleName = document.querySelector("#circleName").value;
  const file = fileInput.files[0];

  if (circleName) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const formData = new FormData();
      formData.append("file", circlePhoto.src);
      formData.append("circleName", circleName);
      try {
        const res = await fetch("/circle/create", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Circle created successfully:", await res.json());
        return res;
      } catch (error) {
        throw new Error(error);
      }
    };
    reader.readAsDataURL(file);
  } else {
    throw new Error("Please put a name for your circle");
  }
}

async function handleSelectFile() {
  const fileInput = document.querySelector("#myInput");
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = async function (event) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/circle/upload", {
        method: "POST",
        body: formData,
      });
      console.log(res);
      //console.log("File uploaded successfully:", (await res.json()).data);
      //console.log(await res.json(), "hello");
      return res;
    } catch (error) {
      throw new Error(error);
    }
  };
  reader.readAsDataURL(file);
}
