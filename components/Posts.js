import Image from "next/image";
import { GrFavorite } from "react-icons/gr";
import { BsFillChatFill } from "react-icons/bs";
import { RiSendPlaneLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

function Posts({
  postId,
  name,
  image,
  caption,
  userphotoURL,
  userId,
  timestamp,
}) {
  const [user, loading] = useAuthState(auth);
  const [reqComment, setReqcomment] = useState("false");

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const router = useRouter();

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      comment: comment,
      username: user?.displayName,
      userPhotoURL: user?.photoURL,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const NavtoUserProfile = (e) => {
    router.push(`/userprofile/${userId}`);
  };
  return (
    <div key={postId} className="flex flex-col w-full p-4 bg-gray-200">
      <div className="p-5 bg-white mt-5 rounded-t-2xl shadow-xl">
        <div className="flex items-center">
          <Image
            className="rounded-full cursor-pointer"
            src={userphotoURL}
            width="40"
            height="40"
            layout="fixed"
            onClick={NavtoUserProfile}
          />
          <div className="pl-2">
            <p className=" font-medium">{name}</p>
            <p p className=" text-xs text-gray-400">
              {new Date(timestamp?.seconds * 1000).toUTCString()}
            </p>
          </div>
        </div>
        <div className="relative h-56 md:h-96 max-h-96 mt-1 sm:mt-0 bg-white">
          {image && <Image src={image} objectFit="contain" layout="fill" />}
        </div>
        <div className="flex p-4 item-center bg-white shadow-md text-gray-400 border-r-t">
          <div className="inputIcon rounded-none rounded-bl-2xl justify-center">
            <GrFavorite className="h-4" />
            <p className="text-xs sm:text-base">Like</p>
          </div>
          <div className="inputIcon rounded-none justify-center">
            <BsFillChatFill className="h-4" />
            <p className="text-xs sm:text-base">Comment</p>
          </div>
          <div className="inputIcon rounded-none rounded-br-2xl justify-center">
            <RiSendPlaneLine className="h-4" />
            <p className="text-xs sm:text-base">Share</p>
          </div>
        </div>
        <div className="flex p-4 item-center bg-white  text-gray-800 border-r-t space-x-2">
          <p className=" font-bold">{name}</p>:<p className="">{caption}</p>
        </div>

        <div className="flex flex-col p-4 item-center bg-white  text-gray-800 border-r-t">
          {comments.map((comments) => (
            <div className="flex items-center">
              <Image
                className="rounded-full cursor-pointer"
                src={comments.userPhotoURL}
                width="16"
                height="16"
                layout="fixed"
              />
              <p className="text-gray-800 font-bold pl-1">
                {comments.username}
              </p>
              <p className="text-gray-800 text-base pl-2">{comments.comment}</p>
              <p className="text-gray-300 text-xs pl-1">
                {new Date(comments.timestamp?.seconds * 1000).toUTCString()}
              </p>
            </div>
          ))}
        </div>
        {user && (
          <div className="flex">
            <input
              className="p-2 h-10 outline-none w-full"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="inputIcon rounded-none rounded-br-2xl justify-center">
              <button
                className="p-2 rounded-2xl w-16 text-blue-500 font-mono text-lg"
                disabled={!comment}
                type="submit"
                onClick={postComment}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;
