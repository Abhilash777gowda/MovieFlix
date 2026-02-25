import React, { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, X, Sun, Moon, Home, Tv, Film, Flame, BookMarked, LogOut, LogIn } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useTheme } from "../context/ThemeContext";

/* ─── Navigation link definitions ─────────────────────────── */
const NAV_LINKS = [
    { label: "Home", path: "/", icon: Home },
    { label: "TV Shows", path: "/tv-shows", icon: Tv },
    { label: "Movies", path: "/movies", icon: Film },
    { label: "New & Popular", path: "/new-popular", icon: Flame },
];

/* ─── Navbar ───────────────────────────────────────────────── */
const Navbar = () => {
    const { user, logOut, googleSignIn } = UserAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [query, setQuery] = useState("");
    const searchRef = useRef(null);
    const menuRef = useRef(null);

    /* ── Scroll detection ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── Close menu / search on route change ── */
    useEffect(() => {
        setMenuOpen(false);
        if (location.pathname !== "/search") setSearchOpen(false);
    }, [location.pathname]);

    /* ── Focus search input when it opens ── */
    useEffect(() => {
        if (searchOpen) {
            setTimeout(() => searchRef.current?.focus(), 80);
        } else {
            setQuery("");
        }
    }, [searchOpen]);

    /* ── Close mobile menu on outside click ── */
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    /* ── Helpers ── */
    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    const handleQuery = (e) => {
        const val = e.target.value;
        setQuery(val);
        navigate(
            val.trim() ? `/search?q=${encodeURIComponent(val.trim())}` : "/search",
            { replace: location.pathname === "/search" }
        );
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        else navigate("/search");
        setMenuOpen(false);
    };

    const openSearch = () => {
        setSearchOpen(true);
        navigate("/search");
    };

    const handleLogout = async () => { try { await logOut(); navigate("/"); } catch (err) { console.log(err); } };
    const handleLogin = async () => { try { await googleSignIn(); } catch (err) { console.log(err); } };

    /* ── Navbar background ── */
    const navBg = scrolled
        ? "shadow-2xl"
        : "";

    const navStyle = {
        backdropFilter: scrolled ? "blur(12px)" : "none",
        backgroundColor: scrolled
            ? (theme === "dark" ? "rgba(20,20,20,0.97)" : "rgba(255,255,255,0.97)")
            : "transparent",
        backgroundImage: scrolled ? "none" : "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease",
    };

    return (
        <nav
            ref={menuRef}
            className={`fixed top-0 left-0 right-0 z-[200] w-full ${navBg}`}
            style={navStyle}
        >
            {/* ══════════════════ MAIN BAR ══════════════════ */}
            <div className="flex items-center justify-between h-14 md:h-16 px-3 sm:px-5 md:px-8 lg:px-12 gap-2">

                {/* ── LEFT: Logo ── */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex-shrink-0 select-none"
                    style={{ textDecoration: "none" }}
                >
                    <span
                        className="font-[900] tracking-[-0.06em] leading-none"
                        style={{
                            color: "#e50914",
                            fontSize: "clamp(1.1rem, 3.5vw, 1.6rem)",
                            textShadow: "0 2px 12px rgba(229,9,20,0.35)",
                        }}
                    >
                        MOVIEFLIX
                    </span>
                </Link>

                {/* ── CENTRE: Desktop nav links ── */}
                <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-1 min-w-0 ml-6 xl:ml-10">
                    {NAV_LINKS.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`
                                relative px-2.5 xl:px-3 py-1.5 rounded text-sm font-semibold
                                transition-all duration-200 whitespace-nowrap
                                ${isActive(path)
                                    ? "text-white bg-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            {label}
                            {isActive(path) && (
                                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#e50914] rounded-full" />
                            )}
                        </Link>
                    ))}
                    {user?.email && (
                        <Link
                            to="/watchlist"
                            className={`
                                relative px-2.5 xl:px-3 py-1.5 rounded text-sm font-semibold
                                transition-all duration-200 whitespace-nowrap
                                ${isActive("/watchlist")
                                    ? "text-white bg-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }
                            `}
                        >
                            My List
                            {isActive("/watchlist") && (
                                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#e50914] rounded-full" />
                            )}
                        </Link>
                    )}
                </div>

                {/* ── RIGHT: Actions ── */}
                <div className="flex items-center gap-1 md:gap-2 lg:gap-3 flex-shrink-0">

                    {/* ─ Search (hidden on mobile — use drawer search instead) ─ */}
                    {searchOpen ? (
                        <form
                            onSubmit={handleSearchSubmit}
                            className="hidden md:flex items-center rounded-sm border overflow-hidden"
                            style={{
                                borderColor: "rgba(255,255,255,0.35)",
                                backgroundColor: "rgba(0,0,0,0.75)",
                                width: "clamp(160px, 28vw, 300px)",
                            }}
                        >
                            <button type="submit" className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white">
                                <Search size={17} />
                            </button>
                            <input
                                ref={searchRef}
                                type="text"
                                value={query}
                                onChange={handleQuery}
                                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                                placeholder="Search titles…"
                                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1 pr-1"
                                style={{ minWidth: 0 }}
                            />
                            <button
                                type="button"
                                onClick={() => setSearchOpen(false)}
                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={openSearch}
                            className="hidden md:flex w-9 h-9 items-center justify-center text-gray-300 hover:text-white transition rounded-full hover:bg-white/10"
                            title="Search"
                        >
                            <Search size={19} />
                        </button>
                    )}

                    {/* ─ Theme toggle (desktop only — in menu on mobile) ─ */}
                    <button
                        onClick={toggleTheme}
                        title={theme === "dark" ? "Light mode" : "Dark mode"}
                        className="flex w-9 h-9 items-center justify-center rounded-full border transition-all hover:border-white/40"
                        style={{
                            borderColor: "rgba(255,255,255,0.12)",
                            backgroundColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
                            color: theme === "light" ? "#374151" : "#d1d5db",
                        }}
                    >
                        {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                    </button>

                    {/* ─ Notifications ─ */}
                    <NotificationPanel />

                    {/* ─ User avatar / Sign-in (desktop) ─ */}
                    {user?.email ? (
                        <div className="hidden md:flex items-center gap-2">
                            <img
                                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                alt="avatar"
                                className="w-8 h-8 rounded-md object-cover border border-white/20 flex-shrink-0"
                            />
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 hover:bg-red-600 px-3 py-1.5 rounded text-xs font-black transition border border-white/10 uppercase tracking-wider text-white whitespace-nowrap"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="hidden md:flex bg-[#e50914] hover:bg-[#b9090b] px-4 py-1.5 rounded text-white text-sm font-black transition shadow-lg active:scale-95 uppercase tracking-wider whitespace-nowrap"
                        >
                            Sign In
                        </button>
                    )}

                    {/* ─ Hamburger (mobile / tablet) ─ */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ══════════════════ MOBILE SLIDE-DOWN MENU ══════════════════ */}
            <div
                className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: menuOpen ? "600px" : "0px",
                    opacity: menuOpen ? 1 : 0,
                }}
            >
                <div
                    className="border-t border-white/10 px-4 pb-4 pt-2 flex flex-col"
                    style={{
                        backgroundColor: theme === "dark"
                            ? "rgba(15,15,15,0.98)"
                            : "rgba(248,248,248,0.98)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    {/* Mobile search bar */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 mt-1 mb-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                        <Search size={15} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={handleQuery}
                            placeholder="Search movies, TV shows…"
                            className="bg-transparent text-white text-sm placeholder-gray-500 outline-none flex-1"
                        />
                        {query && (
                            <button type="button" onClick={() => setQuery("")} className="text-gray-500 hover:text-white">
                                <X size={13} />
                            </button>
                        )}
                    </form>

                    {/* Nav links */}
                    <div className="flex flex-col">
                        {NAV_LINKS.map(({ label, path, icon: Icon }) => (
                            <Link
                                key={path}
                                to={path}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 px-2 py-3 rounded-lg mb-0.5 font-semibold text-sm transition-all
                                    ${isActive(path)
                                        ? "text-[#e50914] bg-[#e50914]/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                <Icon size={17} className="flex-shrink-0" />
                                {label}
                            </Link>
                        ))}

                        {user?.email && (
                            <Link
                                to="/watchlist"
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-3 px-2 py-3 rounded-lg mb-0.5 font-semibold text-sm transition-all
                                    ${isActive("/watchlist")
                                        ? "text-[#e50914] bg-[#e50914]/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                <BookMarked size={17} className="flex-shrink-0" />
                                My List
                            </Link>
                        )}
                    </div>


                    {/* Auth */}
                    <div className="h-px bg-white/10 my-2" />

                    {user?.email ? (
                        <div className="flex items-center gap-3 px-2 py-2">
                            <img
                                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                alt="avatar"
                                className="w-9 h-9 rounded-lg object-cover border border-white/20 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">{user.displayName || "User"}</p>
                                <p className="text-gray-500 text-xs truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={() => { handleLogout(); setMenuOpen(false); }}
                                className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 border border-red-600/40 px-3 py-1.5 rounded text-red-400 hover:text-white text-xs font-black transition uppercase tracking-wider"
                            >
                                <LogOut size={13} />
                                Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { handleLogin(); setMenuOpen(false); }}
                            className="flex items-center justify-center gap-2 mt-1 bg-[#e50914] hover:bg-[#b9090b] text-white py-3 px-4 rounded-lg font-black text-sm uppercase tracking-wider transition active:scale-95"
                        >
                            <LogIn size={16} />
                            Sign In with Google
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
