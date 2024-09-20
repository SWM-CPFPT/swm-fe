import { useState, useEffect } from "react"
import { storage } from "./firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export default function Testfirebase() {

    const [imageUpload, setImageUpload] = useState(null);
    const [image, setImage] = useState([])

    const imageListRef = ref(storage, "images/")
    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            alert("Image Uploaded");
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
                setImage(url)
            })
        })
    };


    return (
        <>
            <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
            <button onClick={uploadImage}>Upload Image</button>
            <img src={image} alt="" />
        </>
    )
}

