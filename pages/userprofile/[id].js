import { db } from "../../config/firebase";
import Head from "next/head";
import Header from "../../components/Header";
import UserBios from "../../components/UserBios";
import UserPost from "../../components/UserPost";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function Userprofile({ bio, userPost }) {
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (router.query.id) {
      db.collection("users")
        .doc(router.query.id)
        .collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setPosts(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [router.query.id]);

  return (
    <div className="w-screen h-full">
      <Head>
        <title>{bio?.username} Profile</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>
        <UserBios userbios={bio} />
        <div className="px-5 my-10 sm:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex flex-wrap items-center justify-center">
          {posts?.map((posts) => (
            <UserPost image={posts.image} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Userprofile;

export async function getServerSideProps(context) {
  const ref = await db.collection("users").doc(context.query.id);

  const bioRes = await ref.get();

  const userPostRes = await ref
    .collection("posts")
    .orderBy("timestamp", "asc")
    .get();

  const bio = {
    id: bioRes.id,
    ...bioRes.data(),
  };

  const userPost = userPostRes.docs.map((post) => ({
    id: post.id,
    ...post.data(),
    timestamp: null,
  }));

  console.log(userPost);

  return {
    props: {
      bio: bio,
      userPost: userPost,
    },
  };
}
