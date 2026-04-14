import Navbar from "../components/Navbar.jsx";
import { Outlet } from "react-router-dom";
import AuthModal from "../features/auth/components/AuthModal.jsx";
import CreateButton from "../components/CreateButton.jsx";
import wallpaper from "../assets/wallpaper.jpg";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen text-zinc-900">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
        }}
      />
      <Navbar />
      <div className="px-4 pb-6 pt-16 md:pl-28 md:pr-8 md:pt-8">
        <Outlet />
      </div>
      <AuthModal />
      <CreateButton /> 
    </div>
  );
}
