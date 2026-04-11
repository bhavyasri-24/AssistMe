import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Posts from "./features/posts/pages/Posts.jsx";
import Doubts from "./features/doubts/pages/Doubts.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Posts />} />
          <Route path="/doubts" element={<Doubts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
