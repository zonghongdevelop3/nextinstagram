import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AiOutlineInstagram,
  AiFillCloseCircle,
  AiFillInstagram,
} from "react-icons/ai";
import { MdModeEdit, MdUpdate } from "react-icons/md";
import { auth, db, storage } from "../config/firebase";
import { BsFillImageFill } from "react-icons/bs";
import { GrUpdate } from "react-icons/gr";

function UserBios({ userbios }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [editProfile, setEditProfile] = useState(false);

  const [progress, setProgress] = useState(0);
  const [profilemage, setProfileImage] = useState(null);
  const imgPickerRef = useRef(null);
  const [input, setInput] = useState("");

  const navtoPost = () => {
    if (userbios.email === user?.email) {
      router.push("/imageupload");
    } else {
      alert("Your Are not the Auth user");
      router.push("/");
    }
  };

  const togleEdit = () => {
    if (userbios.username !== user?.displayName) {
      setEditProfile(false);
      alert("Your Are not the Auth user");
      router.push("/");
    } else {
      setEditProfile(true);
    }

    if (editProfile === true) {
      setEditProfile(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUploadProfileimage = () => {
    if (user) {
      const uploadTask = storage
        .ref(`profilemage/${profilemage.name}`)
        .put(profilemage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          //progress function...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          // Error Function ...
          console.log(error);
          alert(error.message);
        },
        () => {
          //complete function
          storage
            .ref("profilemage")
            .child(profilemage.name)
            .getDownloadURL()
            .then((url) => {
              const Updateuser = auth.currentUser;
              db.collection("users").doc(user.uid).set(
                {
                  photoURL: url,
                },
                { merge: true }
              );
              Updateuser.updateProfile({
                photoURL: url,
              });
            })
            .catch((error) => alert(error.message));
          setProgress(0);
          setProfileImage(null);
          setEditProfile(false);
        }
      );
    } else {
      alert("You are not Authorise user");
    }
  };
  const UpdateUserBios = (e) => {
    e.preventDefault();

    if (!input) {
      setEditProfile(false);
      return false;
    }

    db.collection("users")
      .doc(user?.uid)
      .set(
        {
          bios: input,
        },
        { merge: true }
      )
      .then(() => {
        setInput("");
        setEditProfile(false);
      })
      .then(() => {
        router.reload();
      });
  };

  return (
    <div className="flex flex-col p-4 sm:flex-row bg-[#fafafa] shadow-2xl">
      <div className="flex items-center justify-center">
        {!editProfile ? (
          <Image
            className="rounded-full cursor-pointer"
            src={userbios?.photoURL}
            width="400"
            height="400"
            layout="fixed"
            objectFit="cover"
          />
        ) : (
          <div className="bg-gray-200 shadow-2xl p-0 lg:p-9 w-full h-full flex flex-col items-center justify-center">
            <div class="">
              <h3 className="font-medium">Update Profile Pic</h3>
            </div>
            <div className="">
              <center>
                <progress value={progress} max="100" />
              </center>
              <div
                className="inputIcon"
                onClick={() => imgPickerRef.current.click()}
              >
                <BsFillImageFill className="h-7 text-green-500" />
                <p className="text-xs sm:text-sm lg:text-base">Photo</p>
                <input
                  ref={imgPickerRef}
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleChange}
                />
              </div>
              <div className={`inputIcon ${profilemage ? "bg-blue-300" : ""}`}>
                {profilemage && (
                  <button onClick={handleUploadProfileimage} className="">
                    Update Profile Image
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center sm:pl-12">
        <div className="flex space-x-2 lg:space-x-6 lg:items-baseline sm:mt-24">
          <h1 className="text-2xl lg:text-6xl lg:pl-12 font-bold">
            {userbios.username}
          </h1>
          <div className="flex space-x-4 lg:space-x-6 ">
            <AiOutlineInstagram
              onClick={navtoPost}
              className="h-8 w-8 text-pink-400 cursor-pointer hover:bg-gray-300 rounded-full"
            />
            {!editProfile ? (
              <MdModeEdit
                onClick={togleEdit}
                className="h-8 w-8 text-blue-400 cursor-pointer  hover:bg-gray-300 rounded-full"
              />
            ) : (
              <AiFillCloseCircle
                onClick={togleEdit}
                className="h-8 w-8 text-red-400 cursor-pointer  hover:bg-gray-300 rounded-full"
              />
            )}
          </div>
        </div>
        <div className="flex flex-row space-x-3 lg:mt-10">
          <div className="flex space-x-2 p-2">
            <p>{userbios.postCount}</p>
            <p className="font-medium">Post</p>
          </div>
          <div className="flex space-x-2 p-2">
            <p>{userbios.likeCount}</p>
            <p className="font-medium">Likes</p>
          </div>
          <div className="flex space-x-2 p-2">
            <p>{userbios.shareCount}</p>
            <p className="font-medium">Shares</p>
          </div>
        </div>
        <div className=" p-2 ml-12 w-full h-auto">
          {!editProfile ? (
            <p className="text-xl">{userbios.bios}</p>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <input
                className="p-2 h-12 w-full placeholder-gray-700  outline-none bg-gray-300 shadow-2xl"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Update Bios ${userbios.bios}`}
              />
              <MdUpdate
                className="h-12 w-12 text-purple-400 cursor-pointer "
                type="submit"
                onClick={UpdateUserBios}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserBios;
