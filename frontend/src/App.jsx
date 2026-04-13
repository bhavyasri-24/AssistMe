import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Posts from "./features/posts/pages/Posts.jsx";
import Doubts from "./features/doubts/pages/Doubts.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Profile from "./features/profile/pages/Profile.jsx";
import MyPosts from "./features/activity/pages/MyPosts.jsx";
import MyDoubts from "./features/activity/pages/MyDoubts.jsx";
import MyRooms from "./features/activity/pages/MyRooms.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Posts />} />
          <Route path="/doubts" element={<Doubts />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-doubts"
            element={
              <ProtectedRoute>
                <MyDoubts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-rooms"
            element={
              <ProtectedRoute>
                <MyRooms />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
