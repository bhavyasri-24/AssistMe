import { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import logo from "../assets/logo.png";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutGrid,
  LogIn,
  Menu,
  MessageCircleQuestionMark,
  MessageSquareText,
  PanelsTopLeft,
  PenLine,
  UserPlus,
  Users,
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
  const openAuthModal = (mode) => {
    const search = new URLSearchParams(location.search);
    search.set("auth", mode);
    navigate(`${location.pathname}?${search.toString()}`);
    closeSidebarAfterNavigation();
  };

  const handleProtectedNavigation = (path) => {
    if (!user) {
      const search = new URLSearchParams(location.search);
      search.set("auth", "login");
      search.set("redirect", path);
      navigate(`/?${search.toString()}`);
      closeSidebarAfterNavigation();
      return;
    }

    setShowProfileMenu(false);
    navigate(path);
    closeSidebarAfterNavigation();
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
      const clickedOutsideSidebar =
        asideRef.current && !asideRef.current.contains(event.target);
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
    navigate("/");
  };

  const handleLogoutAllDevices = async () => {
    await logoutAllDevices();
    closeMobileSidebar();
    navigate("/");
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
            <img
              src={logo}
              alt="AssistMe logo"
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-lg font-semibold tracking-tight text-zinc-950">
              AssistMe
            </span>
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
          const clickInsideProfileMenu = event.target.closest(
            "[data-profile-menu]",
          );
          const clickProfileTrigger = event.target.closest(
            "[data-profile-trigger]",
          );
          if (
            showProfileMenu &&
            !clickInsideProfileMenu &&
            !clickProfileTrigger
          ) {
            setShowProfileMenu(false);
          }

          if (!isCollapsed) return;
          if (event.target.closest("[data-collapse-toggle]")) return;
          if (event.target.closest("[data-direct-nav]")) return;
          if (event.target.closest("[data-no-expand]")) return;
          setIsDesktopCollapsed(false);
        }}
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col justify-between border-r border-zinc-300 bg-zinc-50 p-4 shadow-sm transition-all duration-300 ease-in-out md:translate-x-0 ${
          isCollapsed ? "md:w-20" : "md:w-72"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          type="button"
          data-collapse-toggle
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-sm hover:bg-zinc-100 md:flex"
          onClick={() => setIsDesktopCollapsed((prev) => !prev)}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>

        <div className="space-y-8">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"}`}
          >
            {isCollapsed ? (
              <Link to="/" className="mx-auto" onClick={closeMobileSidebar}>
                <img
                  src={logo}
                  alt="AssistMe logo"
                  className="h-8 w-8 rounded-md object-cover"
                />
              </Link>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-2 text-xl font-semibold tracking-tight text-zinc-950"
                onClick={closeMobileSidebar}
              >
                <img
                  src={logo}
                  alt="AssistMe logo"
                  className="h-8 w-8 rounded-md object-cover"
                />
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
              className={({ isActive }) =>
                `${renderLinkClass({ isActive })} group relative`
              }
              onClick={() => {
                setShowProfileMenu(false);
                closeSidebarAfterNavigation();
              }}
              title="Posts"
              data-direct-nav
            >
              <LayoutGrid size={18} className="shrink-0" />{" "}
              {!isCollapsed && <span className="whitespace-nowrap">Posts</span>}
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Posts
                </span>
              )}
            </NavLink>
            <NavLink
              to="/doubts"
              className={({ isActive }) =>
                `${renderLinkClass({ isActive })} group relative`
              }
              onClick={() => {
                setShowProfileMenu(false);
                closeSidebarAfterNavigation();
              }}
              title="Doubts"
              data-direct-nav
            >
              <MessageSquareText size={18} className="shrink-0" />{" "}
              {!isCollapsed && (
                <span className="whitespace-nowrap">Doubts</span>
              )}
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  Doubts
                </span>
              )}
            </NavLink>

            <button
              className={`${baseLinkClass} group relative w-full ${
                isCollapsed
                  ? "mx-auto h-10 w-10 justify-center px-0"
                  : "justify-between"
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
                <PanelsTopLeft size={18} className="shrink-0" />{" "}
                {!isCollapsed && (
                  <span className="whitespace-nowrap">My activity</span>
                )}
              </span>
              {isCollapsed && (
                <span className="pointer-events-none absolute left-12 top-1/2 z-50 -translate-y-1/2 rounded-md border border-zinc-300 bg-zinc-200 px-2 py-1 text-xs text-zinc-900 opacity-0 transition-opacity duration-150 group-hover:opacity-100 cursor-pointer">
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
                  onClick={(event) => {
                    event.preventDefault();
                    handleProtectedNavigation("/my-posts");
                  }}
                >
                  <PenLine size={17} className="shrink-0" />{" "}
                  <span className="whitespace-nowrap">My posts</span>
                </NavLink>
                <NavLink
                  to="/my-doubts"
                  className={renderLinkClass}
                  onClick={(event) => {
                    event.preventDefault();
                    handleProtectedNavigation("/my-doubts");
                  }}
                >
                  <MessageCircleQuestionMark size={17} className="shrink-0" />{" "}
                  <span className="whitespace-nowrap">My doubts</span>
                </NavLink>
                <NavLink
                  to="/my-rooms"
                  className={renderLinkClass}
                  onClick={(event) => {
                    event.preventDefault();
                    handleProtectedNavigation("/my-rooms");
                  }}
                >
                  <Users size={17} className="shrink-0" />{" "}
                  <span className="whitespace-nowrap">My rooms</span>
                </NavLink>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="relative">
          {!user ? (
            <div className="space-y-2 border-b border-zinc-300 pb-3">
              {/* Login */}
              <button
                data-no-expand
                className={`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium w-full transition-colors
        ${
          isCollapsed
            ? "justify-center w-10 h-10 mx-auto hover:bg-zinc-100"
            : "justify-start bg-zinc-900 text-white hover:bg-zinc-800"
        }`}
                onClick={() => openAuthModal("login")}
              >
                <LogIn size={18} />
                {!isCollapsed && <span>Login</span>}
              </button>

              {/* Signup */}
              <button
                data-no-expand
                className={`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium w-full transition-colors
        ${
          isCollapsed
            ? "justify-center w-10 h-10 mx-auto hover:bg-zinc-100"
            : "justify-start bg-white text-zinc-900 hover:bg-zinc-100"
        }`}
                onClick={() => openAuthModal("signup")}
              >
                <UserPlus size={18} />
                {!isCollapsed && <span>Signup</span>}
              </button>
            </div>
          ) : (
            <>
              {/* Profile Button */}
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
                <span className="flex items-center gap-2 cursor-pointer">
                  <Avatar
                    round
                    size="36"
                    name={user.username}
                    src={user.avatar}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium text-zinc-900">
                      {user.username}
                    </span>
                  )}
                </span>
                {!isCollapsed && <ChevronsUpDown size={16} />}
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute bottom-14 left-0 w-full rounded-md border bg-white p-1 shadow-md">
                  <button
                    className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-100"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>

                  <button
                    className="mt-1 w-full px-3 py-2 text-left text-sm font-bold hover:bg-zinc-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>

                  <button
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={handleLogoutAllDevices}
                  >
                    Logout all devices
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
