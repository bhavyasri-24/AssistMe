import Navbar from "../components/Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <Navbar />
      <div className="px-4 pb-6 pt-16 md:pl-28 md:pr-8 md:pt-8">
        <Outlet />
      </div>
    </div>
  );
}
