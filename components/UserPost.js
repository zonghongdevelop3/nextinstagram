import Image from "next/image";

function UserPost(userPost) {
  return (
    <div className="xl:ml-10 p-2 group cursor-pointer transition duration-200 ease-in transform sm:hover:scale-105 hover:z-50">
      <Image
        src={userPost.image}
        objectFit="contain"
        width={400}
        height={400}
      />
    </div>
  );
}

export default UserPost;
