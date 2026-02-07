import { createImageUpload } from "novel";
import { toast } from "sonner";


const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    return new Promise((resolve, reject) => {
        const toastId = toast.loading("Uploading image...");

        fetch("https://api.imgbb.com/1/upload?key=d08120f6a6e1af75c0d2755245d6dee1", {
            method: "POST",
            body: formData,
        })
            .then(async (res) => {
                if (res.status === 200) {
                    const data = await res.json();
                    if (data.success) {
                        const url = data.data.url;
                        const image = new Image();
                        image.src = url;
                        image.onload = () => {
                            resolve(url);
                            toast.success("Image uploaded successfully", { id: toastId });
                        };
                    } else {
                        throw new Error(data.error?.message || "Error uploading image to ImgBB");
                    }
                } else {
                    throw new Error("Error uploading image. Please try again.");
                }
            })
            .catch((e) => {
                reject(e);
                toast.error(e.message || "Something went wrong", { id: toastId });
            });
    });
};

export const uploadFn = createImageUpload({
    onUpload,
    validateFn: (file) => {
        if (!file.type.includes("image/")) {
            toast.error("File type not supported.");
            return false;
        }
        if (file.size / 1024 / 1024 > 20) {
            toast.error("File size too big (max 20MB).");
            return false;
        }
        return true;
    },
});
