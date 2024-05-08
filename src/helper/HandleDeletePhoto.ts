const cloudinary = require("cloudinary").v2

export async function HandleDeletePhoto(url:string) {
    const splitUrl = url.split("/")
    const idWithExtensions = splitUrl[splitUrl.length].split(".")
    const id = idWithExtensions[0]
    cloudinary.uploader.destroy(id, function(result:any) { console.log(result) });
}
