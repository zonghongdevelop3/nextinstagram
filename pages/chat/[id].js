import Header from "../../components/Header";
import { db } from "../../config/firebase";
import Image from "next/image";
import { AiOutlineArrowLeft, AiFillHome } from "react-icons/ai";
import Head from "next/head";
import ChatScreenContainer from "../../components/ChatScreenContainer";
import { useRouter } from "next/router";

function ChatScreen({ chat, messages }) {
  console.log(chat.id);
  const router = useRouter();

  const NavtoUserProfile = (e) => {
    router.push(`/userprofile/${router.query.id}`);
  };

  const NavtoChatScreen = (e) => {
    router.push(`/chat`);
  };

  const NavtoHome = (e) => {
    router.push(`/`);
  };

  return (
    <div className="h-screen w-full max-h-screen bg-gray-200 overflow-y-scroll overflow-scroll-hidden">
      <div
        className="flex item-center justify-between p-4 bg-gray-100
    sticky top-0 z-50 lg:p-50 shadow-md"
      >
        <Head>
          <title>Chat with {chat.username}</title>
        </Head>
        <div>
          <AiOutlineArrowLeft className="chaticon" onClick={NavtoChatScreen} />
        </div>
        <div onclick={NavtoUserProfile} className="hover:animate-pulse group">
          <Image
            onclick={NavtoUserProfile}
            className="rounded-full cursor-pointer"
            src={chat?.photoURL}
            width="40"
            height="40"
            layout="fixed"
          />
          <div className=" space-y-6 flex absolute top-16 bg-gray-800 text-gray-100 opacity-0  group-hover:opacity-100 cursor-pointer p-6 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-center hover:animate-pulse filte">
              <h3 onClick={NavtoUserProfile} className=" hover:underline">
                {chat.username} Profile
              </h3>
            </div>
          </div>
        </div>
        <div>
          <AiFillHome className="chaticon" onClick={NavtoUserProfile} />
        </div>
      </div>
      <main>
        <ChatScreenContainer messages={messages} />
      </main>
    </div>
  );
}

export default ChatScreen;

export async function getServerSideProps(context) {
  const ref = db.collection("users").doc(context.query.id);

  // prepare the messages on the server side
  const messagesRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // prepare chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  console.log(chat, messages);

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}
