import Logo from "../images/logo.png";
import Image from "next/image";
import Header from "../components/Header";
import { useState } from "react";
import { auth, db } from "../config/firebase";
import { useRouter } from "next/router";

function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const register = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;

        const usersRef = db.collection("users");
        usersRef.doc(uid).set({
          uid: response.user.uid,
          email: email,
          username: username,
          likeCount: 0,
          shareCount: 0,
          postCount: 0,
          bios: "Please Update Your Bios",
          photoURL:
            "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
        });
      })
      .then((authUser) => {
        const Updateuser = auth.currentUser;
        Updateuser.updateProfile({
          displayName: username,
          photoURL:
            "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg",
        });
      })
      .catch((error) => alert(error.message))
      .then((auth) => {
        //create user and logged in, redirect to homepage
        router.push("/");
      });
  };

  return (
    <>
      <Header />
      <div className="bg-gray-100 h-screen grid place-items-center ">
        <div className=" bg-gray-200 w-11/12 h-1/2 flex flex-col items-center justify-center shadow-2xl">
          <Image
            src={Logo}
            width={80}
            height={80}
            layout="fixed"
            objectFit="contain"
          />
          <form className="flex flex-col w-full space-y-2">
            <input
              placeholder="username"
              className="p-2 h-12 outline-none"
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              placeholder="email"
              className="p-2 h-12 outline-none"
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              placeholder="password"
              className="p-2 h-12 outline-none"
              onChange={(event) => setPassword(event.target.value)}
            />
          </form>
          <button
            onClick={register}
            type="submit"
            className="p-4 outline-none bg-gray-300 w-full shadow-md mt-2 hover:bg-gray-600 hover:text-gray-100 hover:animate-pulse"
          >
            Register
          </button>
          <div className="mt-4">
            <p className="">
              Already Have Account? Please
              <span
                onClick={() => router.push("/login")}
                className="hover:underline cursor-pointer ml-1"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default register;
