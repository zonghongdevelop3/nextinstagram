import StoryCard from "./StoryCard";
import StoryCardPost from "./StoryCardPost";

import { db } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";

function Stories() {
  const [storyData] = useCollection(db.collection("stories"));
  return (
    <div className="flex bg-gray-200 justify-center space-x-3 mx-auto overflow-x-scroll overflow-y-hidden pl-10 sm:pl-1 scrollbar-hide last:pr-2">
      <StoryCardPost />

      {storyData?.docs.map((story) => (
        <StoryCard
          key={story.data().src}
          name={story.data().name}
          src={story.data().src}
          profile={story.data().profile}
        />
      ))}
    </div>
  );
}

export default Stories;
