import Posts from "./Posts";
import Stories from "./Stories";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../config/firebase";

function Feeds() {
  const [posts] = useCollection(
    db.collection("posts").orderBy("timestamp", "desc")
  );

  return (
    <div>
      <div>
        <Stories />
        {posts?.docs.map((post) => (
          <Posts
            key={post.id}
            postId={post.id}
            name={post.data().name}
            userphotoURL={post.data().userphotoURL}
            image={post.data().image}
            caption={post.data().caption}
            timestamp={post.data().timestamp}
            userId={post.data().userid}
          />
        ))}
      </div>
    </div>
  );
}

export default Feeds;
