const cloudinary = require("cloudinary").v2;

export async function handleUpload(file: string) {
    try {
        const res = await cloudinary.uploader.upload(file, {
          resource_type: "auto",
        });
        return res;    
    } catch (error:any) {
        throw new Error(error)
    }
}