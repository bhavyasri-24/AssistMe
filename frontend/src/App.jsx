import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";

import Posts from "./features/posts/pages/Posts.jsx";
import PostDetails from "./features/posts/pages/PostDetails.jsx";
import Doubts from "./features/doubts/pages/Doubts.jsx";

import Profile from "./features/profile/pages/Profile.jsx";

import MyPosts from "./features/activity/pages/MyPosts.jsx";
import MyDoubts from "./features/activity/pages/MyDoubts.jsx";
import MyRooms from "./features/activity/pages/MyRooms.jsx";

import CreatePost from "./features/posts/pages/CreatePost.jsx";
import CreateDoubt from "./features/doubts/pages/CreateDoubt.jsx";

import Room from "./features/rooms/pages/Room.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/posts" replace />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/doubts" element={<Doubts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-doubt" element={<CreateDoubt />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/my-doubts" element={<MyDoubts />} />
            <Route path="/my-rooms" element={<MyRooms />} />

            <Route path="/my-posts/:id/edit" element={<CreatePost />} />
            <Route path="/my-doubts/:id/edit" element={<CreateDoubt />} />

            <Route path="/room/:id" element={<Room />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
