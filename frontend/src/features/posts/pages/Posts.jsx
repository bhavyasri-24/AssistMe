import { getPosts } from "../services/postService.js";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard.jsx";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((res) => setPosts(res.data));
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-5 text-2xl">Posts</h1>
      {posts.map((post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}
