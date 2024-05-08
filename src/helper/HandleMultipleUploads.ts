const cloudinary = require("cloudinary").v2;

export async function handleMultipleUpload(fileList: string[]) {
    try {
        const urlList = fileList.forEach(async (file) => {
            const res = await cloudinary.uploader.upload(file, {
                resource_type: "auto",
            });
            return res;    
        })
        return urlList
    } catch (error:any) {
        throw new Error(error)
    }
}