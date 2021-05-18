import Image from "next/image";
import { useRouter } from "next/router";
import { RiSendPlaneLine } from "react-icons/ri";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

function Chatlist({ id, username, photoURL }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const NavtoUserProfile = (e) => {
    router.push(`/userprofile/${id}`);
  };

  const NavtoChatScreen = (e) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="bg-white h-full w-screen py-3 group cursor-pointer">
      <div className="flex h-40 p-10 items-center justify-between group-hover:bg-gray-200 ">
        <div onClick={NavtoUserProfile} className="flex space-x-4 items-center">
          <Image
            className="rounded-full cursor-pointer hover:animate-pulse"
            src={photoURL}
            width="100"
            height="100"
            layout="fixed"
            objectFit="cover"
          />
          <h1 className="font-medium text-base  md:text-2xl">{username}</h1>
        </div>
        <div onClick={NavtoChatScreen}>
          <RiSendPlaneLine className="h-8 w-8 text-blue-300 group-hover:text-pink-300" />
        </div>
      </div>
    </div>
  );
}

export default Chatlist;
