import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../config/firebase";
import { BsFillImageFill } from "react-icons/bs";
import Header from "../components/Header";
import Logo from "../images/logo.png";
import Image from "next/image";
import { AiFillInstagram } from "react-icons/ai";
import firebase from "firebase";
import { useRouter } from "next/router";
import Head from "next/head";

function ImageUpload() {
  const [user, loading] = useAuthState(auth);
  const inputRef = useRef(null);
  const imgPickerRef = useRef(null);
  const [imgToPost, setImgtoPost] = useState(null);
  const router = useRouter();

  const addImgtoPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setImgtoPost(readerEvent.target.result);
    };
  };

  const removeImg = () => {
    setImgtoPost(null);
  };

  const sendPost = (e) => {
    e.preventDefault();

    if (!user) return;

    db.collection("posts")
      .add({
        caption: inputRef.current.value,
        name: user?.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userid: user?.uid,
        userphotoURL: user?.photoURL,
      })
      .then((doc) => {
        if (imgToPost) {
          const uploadTask = storage
            .ref(`images/${doc.id}`)
            .putString(imgToPost, "data_url");

          removeImg();

          uploadTask
            .on(
              "state_change",
              null,
              (error) => console.error(error),
              () => {
                storage
                  .ref("images")
                  .child(doc.id)
                  .getDownloadURL()
                  .then((url) => {
                    db.collection("posts").doc(doc.id).set(
                      {
                        image: url,
                      },
                      {
                        merge: true,
                      }
                    );

                    db.collection("users")
                      .doc(user?.uid)
                      .collection("posts")
                      .add({
                        caption: inputRef.current.value,
                        name: user?.displayName,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                        userid: user?.uid,
                        userphotoURL: user?.photoURL,
                        image: url,
                      });
                  });
              }
            )
            .then(() => {
              router.push("/");
            });
        }
      });

    inputRef.current.value = "";
  };

  return (
    <>
      <Header />
      <div className="bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6">
        {imgToPost && (
          <div
            onClick={removeImg}
            className="flex flex-col items-center justify-center filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer"
          >
            <img className="h-60 w-60 object-contain" src={imgToPost} alt="" />
            <p className="text-xs text-red-500 text-center">Remove</p>
          </div>
        )}
        <Head>
          <title>{user?.displayName} Image Upload</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex space-x-4 items-center p-4">
          <img
            className="rounded-full h-20 w-20 "
            src={user?.photoURL}
            layout="fixed"
          />
          <form className="flex flex-1">
            <input
              ref={inputRef}
              className=" rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
              type="text"
              placeholder={`what's on your mind, ${user?.displayName}`}
            />
            <button hidden onClick={sendPost}>
              Submit
            </button>
          </form>
        </div>
        <div className="flex justify-evenly p-3 border-t overflow-x-scroll md:overflow-x-hidden">
          <div
            className="inputIcon"
            onClick={() => imgPickerRef.current.click()}
          >
            <BsFillImageFill className="h-7 text-green-500" />
            <p className="text-xs sm:text-sm lg:text-base">Photo/Video</p>
            <input
              ref={imgPickerRef}
              type="file"
              hidden
              onChange={addImgtoPost}
            />
          </div>
        </div>
        <div className="inputIcon" onClick={sendPost}>
          <AiFillInstagram className="h-7 w-7 text-pink-500" />
          <p className="text-xs sm:text-sm lg:text-base">Upload</p>
        </div>
      </div>
    </>
  );
}

export default ImageUpload;
