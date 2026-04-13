import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import logo from "../assets/logo.png";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutGrid,
  Menu,
  MessageSquareText,
  PanelsTopLeft,
  PenLine,
  UserCircle2,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout, logoutAllDevices } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const asideRef = useRef(null);
  const isCollapsed = isDesktopView && isDesktopCollapsed;

  const isActivityRoute = location.pathname.startsWith("/my-");

  const closeMobileSidebar = () => setIsSidebarOpen(false);
  const closeSidebarAfterNavigation = () => {
    if (isDesktopView) {
      setIsDesktopCollapsed(true);
      return;
    }
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const syncViewport = () => setIsDesktopView(window.innerWidth >= 768);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "5rem" : "18rem",
    );
  }, [isCollapsed]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedOutsideSidebar = asideRef.current && !asideRef.current.contains(event.target);
      if (!clickedOutsideSidebar) return;

      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }

      if (showProfileMenu) {
        setShowProfileMenu(false);
      }

      if (isDesktopView && !isDesktopCollapsed) {
        setIsDesktopCollapsed(true);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isDesktopCollapsed, isDesktopView, isSidebarOpen, showProfileMenu]);

  const handleLogout = async () => {
    await logout();
    closeMobileSidebar();
    navigate("/login");
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    closeMobileSidebar();
    navigate("/login");
  };

  const baseLinkClass =
    "flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950";

  const renderLinkClass = ({ isActive }) =>
    `${baseLinkClass} ${isCollapsed ? "mx-auto h-10 w-10 justify-center px-0" : "w-full justify-start"} ${
      isActive ? "bg-zinc-200 text-zinc-950" : ""
    }`;

  return (
    <>
      {!isSidebarOpen && (
        <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-zinc-300 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <img src={logo} alt="AssistMe logo" className="h-7 w-7 rounded-md object-cover" />
            <span className="text-lg font-semibold tracking-tight text-zinc-950">AssistMe</span>
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white p-2 text-zinc-900 shadow-sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        ref={asideRef}
        onClick={(event) => {
          const clickInsideProfileMenu = event.target.closest("[data-profile-menu]");
          const clickProfileTrigger = event.target.closest("[data-profile-trigger]");
          if (showProfileMenu && !clickInsideProfileMenu && !clickProfileTrigger) {
            setShowProfileMenu(false);
          }0

          if (!isCollapsed) return;
          if (event.target.closest("[data-collapse-toggle]")) return;
          if (event.target.closest("[data-direct-nav]")) return;
          setIsDesktopCollapsed(false);
        }}
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col justify-between border-r border-zinc-300 bg-zinc-50 p-4 shadow-sm transition-all duration-300 ease-in-out md:translate-x-0 ${
          isCollapsed ? "md:w-20" : "md:w-72"
        } ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          data-collapse-toggle
          className="absolute -right-3 top-4 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm hover:bg-zinc-100 md:flex"
          onClick={() => setIsDesktopCollapsed((prev) => !prev)}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className="space-y-8">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {isCollapsed ? (
              <Link
                to="/"
                className="mx-auto"
                onClick={closeMobileSidebar}
              >
                <img src={logo} alt="AssistMe logo" className="h-8 w-8 rounded-md object-cover" />
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-950"
                onClick={closeMobileSidebar}
              >
                <img src={logo} alt="AssistMe logo" className="h-8 w-8 rounded-md object-cover" />
                AssistMe
              </Link>
            )}
            <button
              className="rounded-md p-1 text-zinc-700 hover:bg-zinc-200 md:hidden"
              onClick={closeMobileSidebar}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `${renderLinkClass({ isActive })} group relative`}
              onClick={() => {
                setShowProfileMenu(false);
                closeSidebarAfterNavigation();
              }}
              title="Posts"
              data-direct-nav
            >
              <LayoutGrid size={18} className="shrink-0" /> {!isCollapsed && <span className="whitespace-nowrap">Posts</span>}
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Posts
                </span>
              )}
            </NavLink>
            <NavLink
              to="/doubts"
              className={({ isActive }) => `${renderLinkClass({ isActive })} group relative`}
              onClick={() => {
                setShowProfileMenu(false);
                closeSidebarAfterNavigation();
              }}
              title="Doubts"
              data-direct-nav
            >
              <MessageSquareText size={18} className="shrink-0" /> {!isCollapsed && <span className="whitespace-nowrap">Doubts</span>}
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Doubts
                </span>
              )}
            </NavLink>

            <button
              className={`${baseLinkClass} group relative w-full ${
                isCollapsed ? "mx-auto h-10 w-10 justify-center px-0" : "justify-between"
              } ${isActivityRoute ? "bg-zinc-200 text-zinc-950" : ""}`}
              onClick={() => {
                if (isCollapsed) {
                  setIsDesktopCollapsed(false);
                  return;
                }
                setShowActivity((prev) => !prev);
              }}
              title="My activity"
            >
              <span className="flex items-center gap-2">
                <PanelsTopLeft size={18} className="shrink-0" /> {!isCollapsed && <span className="whitespace-nowrap">My activity</span>}
              </span>
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  My activity
                </span>
              )}
              {!isCollapsed && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showActivity ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {showActivity && !isCollapsed && (
              <div className="ml-2 space-y-1 border-l border-zinc-300 pl-3">
                <NavLink
                  to="/my-posts"
                  className={renderLinkClass}
                  onClick={() => {
                    setShowProfileMenu(false);
                    closeSidebarAfterNavigation();
                  }}
                >
                  <PenLine size={17} className="shrink-0" /> <span className="whitespace-nowrap">My posts</span>
                </NavLink>
                <NavLink
                  to="/my-doubts"
                  className={renderLinkClass}
                  onClick={() => {
                    setShowProfileMenu(false);
                    closeSidebarAfterNavigation();
                  }}
                >
                  <MessageSquareText size={17} className="shrink-0" /> <span className="whitespace-nowrap">My doubts</span>
                </NavLink>
                <NavLink
                  to="/my-rooms"
                  className={renderLinkClass}
                  onClick={() => {
                    setShowProfileMenu(false);
                    closeSidebarAfterNavigation();
                  }}
                >
                  <UserCircle2 size={17} className="shrink-0" /> <span className="whitespace-nowrap">My rooms</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        <div className="relative border-t border-zinc-300 pt-3">
          {user ? (
            <>
              <button
                data-profile-trigger
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left hover:bg-zinc-100"
                onClick={() => {
                  if (isCollapsed) {
                    setIsDesktopCollapsed(false);
                    return;
                  }
                  setShowProfileMenu((prev) => !prev);
                }}
              >
                <span className="flex items-center gap-2">
                  <Avatar
                    round
                    size="36"
                    name={user.username}
                    src={user.avatar}
                    textSizeRatio={2}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium text-zinc-900">{user.username}</span>
                  )}
                </span>
                {!isCollapsed && <ChevronsUpDown size={16} className="text-zinc-700" />
                }
              </button>

              {showProfileMenu && (
                <div
                  data-profile-menu
                  className="absolute bottom-14 left-0 w-full rounded-md border border-zinc-300 bg-white p-1 shadow-md"
                >
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100"
                    onClick={() => {
                      setShowProfileMenu(false);
                      closeSidebarAfterNavigation();
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="mt-1 w-full rounded-md bg-zinc-100 px-3 py-2 text-left text-sm font-bold text-zinc-900 hover:bg-zinc-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  <button
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={handleLogoutAllDevices}
                  >
                    Logout all devices
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-2">
              <button
                className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-900"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
