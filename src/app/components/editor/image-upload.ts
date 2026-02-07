import { createImageUpload } from "novel";
import { toast } from "sonner";


const onUpload = (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const promise = fetch("https://api.imgbb.com/1/upload?key=d08120f6a6e1af75c0d2755245d6dee1", {
        method: "POST",
        body: formData,
    });

    return new Promise((resolve, reject) => {
        toast.promise(
            promise.then(async (res) => {
                if (res.status === 200) {
                    const data = await res.json();
                    if (data.success) {
                        const url = data.data.url;
                        // preload the image
                        const image = new Image();
                        image.src = url;
                        image.onload = () => {
                            resolve(url);
                        };
                    } else {
                        throw new Error(data.error?.message || "Error uploading image to ImgBB");
                    }
                } else {
                    throw new Error("Error uploading image. Please try again.");
                }
            }),
            {
                loading: "Uploading image...",
                success: "Image uploaded successfully.",
                error: (e) => {
                    reject(e);
                    return e.message;
                },
            },
        );
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
