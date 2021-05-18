import Logo from "../images/logo.png";
import Image from "next/image";
import Header from "../components/Header";
import { useState } from "react";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";

function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        //login success, redirect to homepage
        router.push("/");
      })
      .catch((e) => alert(e.message));
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
            onClick={login}
            type="submit"
            className="p-4 outline-none bg-gray-300 w-full shadow-md mt-2 hover:bg-gray-600 hover:animate-pulse hover:text-gray-100"
          >
            Login
          </button>
          <div className="mt-4">
            <p className="">
              Dont Have Account? Please
              <span
                onClick={() => router.push("/register")}
                className="hover:underline cursor-pointer ml-1"
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default login;
