import Image from "next/image";
import Logo from "../images/logo.png";
import { AiOutlineMenu } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import { BsFillChatDotsFill } from "react-icons/bs";
import { CgAddR } from "react-icons/cg";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { GoPerson } from "react-icons/go";

function Header() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  const navtoLogin = (e) => {
    router.push("/login");
  };

  const navtoHome = (e) => {
    router.push("/");
  };

  const NavtoUserProfile = (e) => {
    router.push(`/userprofile/${user?.uid}`);
  };

  const NavtoImgUpload = (e) => {
    router.push("/imageupload");
  };

  const NavtoChat = (e) => {
    router.push("/chat");
  };

  return (
    <div
      className="p-2 bg-gray-100
    sticky top-0 z-50  lg:p-50 shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex pl-4 group">
          <Image
            src={Logo}
            width={80}
            height={80}
            layout="fixed"
            objectFit="contain"
          />
          <div className=" space-y-6 absolute top-14 bg-gray-800 text-gray-100 opacity-0  group-hover:opacity-100 cursor-pointer p-6 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-center hover:animate-pulse filte">
              <h3 onClick={navtoHome} className=" hover:underline">
                Homepage
              </h3>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 pr-10">
          <div className="space-x-4">
            <CgAddR className="icon" onClick={NavtoImgUpload} />
            <MdFavoriteBorder className="icon" />
            <BsFillChatDotsFill className="icon" onClick={NavtoChat} />
          </div>
          <div className="hidden md:flex flex-col items-center relative p-4 group">
            {user ? (
              <Image
                className="rounded-full cursor-pointer :"
                src={user?.photoURL}
                width="40"
                height="40"
                layout="fixed"
              />
            ) : (
              <GoPerson className="icon" />
            )}

            <div className=" space-y-6 absolute top-14 bg-gray-800 text-gray-100 opacity-0  group-hover:opacity-100 cursor-pointer p-6 shadow-2xl rounded-2xl">
              {user && (
                <div className="flex items-center justify-center hover:animate-pulse filte">
                  <h3 onClick={NavtoUserProfile} className=" hover:underline">
                    Profile
                  </h3>
                </div>
              )}
              <div className="flex items-center justify-center hover:animate-pulse filte">
                {user ? (
                  <h3
                    onClick={() => auth.signOut()}
                    className=" hover:underline"
                  >
                    Logout
                  </h3>
                ) : (
                  <h3 onClick={navtoLogin} className=" hover:underline">
                    Login
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
        <AiOutlineMenu className="h-8 w-8 inline-flex md:hidden" />
      </div>
    </div>
  );
}

export default Header;
