import { useEffect, useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import PostCard from "../../posts/components/PostCard";
import { getPosts } from "../../posts/services/postService";

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((res) => setPosts(res.data));
  }, []);

  const myPosts = useMemo(
    () =>
      posts.filter((post) => {
        const ownerId = post?.user?._id || post?.user?.id || post?.user;
        return String(ownerId) === String(user?.id);
      }),
    [posts, user?.id],
  );

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900">My posts</h1>
      <div className="space-y-4">
        {myPosts.length ? (
          myPosts.map((post) => <PostCard key={post._id} {...post} />)
        ) : (
          <p className="rounded-lg border border-zinc-300 bg-white p-4 text-zinc-700">No posts yet.</p>
        )}
      </div>
    </section>
  );
}
