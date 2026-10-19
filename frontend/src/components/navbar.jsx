import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import FinTrackLogo from "./FinTrackLogo";
import { useState } from "react";
import ClickSound from "../assets/click.mp3";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import profile from "../assets/profile.png";
import api from "../services/api";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const name = useSelector((state) => state.auth.name);
  const role = useSelector((state) => state.auth.role);

  const [menuOpen, setMenuOpen] = useState(false);

  // User and admin have different protected routes.
  const dashboardLink =
    isAuthenticated && role === "admin"
      ? { to: "/admin", label: "Admin Panel" }
      : { to: "/dashboard", label: "Dashboard" };

  const links = [
    { to: "/", label: "Home" },
    dashboardLink,
    { to: "/contact", label: "Contact" },
  ];

  const authActive =
    location.pathname === "/login" || location.pathname === "/register";

  const linkClass = (active) =>
    `inline-flex items-center rounded-3xl border-y-2 px-4 py-2 text-base font-medium text-white transition-all hover:bg-white/5 hover:text-white/90 ${
      active ? "border-red-600" : "border-transparent"
    }`;

  async function handleLogOut() {
    try {
      await api.post("/activity/add", { type: "logout" });
    } catch (error) {
      console.log("Logout activity error:", error);
    }

    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  }

  function handleClick() {
    const audio = new Audio(ClickSound);
    audio.play().catch((error) => {
      console.log("Click sound error:", error);
    });
  }

  const logoutBtn = (
    <button
      type="button"
      onClick={() => {
        handleLogOut();
        handleClick();
      }}
      className="mr-1 flex cursor-pointer items-center text-xs text-white sm:mr-2 sm:text-base"
    >
      <span className="rounded-full border-y-2 border-red-600 px-2 py-1 font-medium hover:bg-white/5 hover:text-black dark:hover:text-white/90 sm:px-4 sm:py-2">
        Logout
      </span>
    </button>
  );

  const userBadge = (
    <span className="flex items-center font-medium text-white hover:text-white/90">
      <span className="mr-2 flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-x-2 border-red-500">
        <img
          src={profile}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </span>
      <span className="max-w-[10rem] truncate">{name}</span>
    </span>
  );

  // Shared desktop and mobile navigation links.
  const renderNavLink = (link, mobile = false) => (
    <NavLink
      key={link.to}
      to={link.to}
      end
      onClick={() => {
        if (mobile) setMenuOpen(false);
      }}
      className={({ isActive }) =>
        `${linkClass(isActive)} ${mobile ? "block justify-center text-center" : ""}`
      }
      style={({ isActive }) => ({
        borderColor: isActive ? "#dc2626" : "transparent",
      })}
    >
      <span className="inline-block hover:scale-105">{link.label}</span>
    </NavLink>
  );

  return (
    <header className="fixed left-0 top-0 z-40 w-full border-2 border-green-600 bg-black">
      <div className="flex h-14 items-center justify-between gap-2 px-2 sm:px-4">
        {/* Logo and profile */}
        <div className="flex min-w-0 items-center gap-6">
          <FinTrackLogo
            onClick={() => navigate("/")}
            className="h-9 cursor-pointer text-white sm:h-13"
          />

          {isAuthenticated && (
            <div className="hidden lg:block">{userBadge}</div>
          )}
        </div>

        {/* Desktop menu */}
        <div className="hidden items-center gap-4 md:flex lg:gap-8">
          <ul className="flex items-center gap-4 lg:gap-8">
            {links.map((link) => (
              <li key={link.to}>{renderNavLink(link)}</li>
            ))}
          </ul>

          {isAuthenticated ? (
            logoutBtn
          ) : (
            <div
              className={`mr-1 flex h-fit items-center justify-center gap-0.5 rounded-3xl text-base hover:bg-white/5 hover:text-white/90 sm:mr-2 sm:gap-1 ${
                authActive
                  ? "border-y-2 border-red-600 px-1 py-1 font-medium text-white sm:px-2"
                  : "text-white"
              }`}
            >
              <Link to="/register">
                <span className="inline-block font-semibold hover:scale-105">
                  Register
                </span>
              </Link>

              <span>/</span>

              <Link to="/login">
                <span className="inline-block font-semibold hover:scale-105">
                  Login
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-black px-4 pb-4 pt-3 md:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.to}>{renderNavLink(link, true)}</li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            {isAuthenticated ? (
              <>
                {userBadge}
                {logoutBtn}
              </>
            ) : (
              <div className="flex w-full gap-3">
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border-y-2 border-red-600 py-2 text-center font-bold text-white hover:bg-white/5"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border-y-2 border-red-600 py-2 text-center font-bold text-white hover:bg-white/5"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
