import { CgAdd } from "react-icons/cg";

function StoryCardPost() {
  return (
    <div className="relative rounded-3xl bg-black text-gray-100 h-14 w-14 md:h-20 md:w-20 lg:h-56 lg:w-56 cursor-pointer overflow-x p-3 transition duration-200 transform ease-in hover:scale-105 hover:animate-pulse">
      <div className="grid place-items-center md:space-y-1 lg:space-y-4 lg:mt-7">
        <CgAdd className="h-6 md:h-8 lg:h-12 lg:w-12" />
        <h3 className="hidden md:inline-flex text-xs md:font-medium lg:text-2xl">
          Post Story
        </h3>
      </div>
    </div>
  );
}

export default StoryCardPost;
