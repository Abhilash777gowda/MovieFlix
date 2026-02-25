import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Film, Check, ExternalLink } from "lucide-react";
import axios from "axios";
import MovieModal from "./MovieModal";

const API_KEY = "92b44f51a2134bda7e85c0ff1a41de6b";
const STORAGE_KEY = "movieflix_seen_notifications";

const getSeenIds = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveSeenIds = (ids) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
};

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [seenIds, setSeenIds] = useState(getSeenIds);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const panelRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Fetch Now Playing + Upcoming
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [nowPlaying, upcoming] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`),
                    axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`),
                ]);

                const now = (nowPlaying.data.results || [])
                    .filter((m) => m.poster_path || m.backdrop_path)
                    .slice(0, 10)
                    .map((m) => ({ ...m, _type: "Now Playing" }));

                const up = (upcoming.data.results || [])
                    .filter((m) => m.poster_path || m.backdrop_path)
                    .slice(0, 10)
                    .map((m) => ({ ...m, _type: "Coming Soon" }));

                // Deduplicate by id
                const seen = new Set();
                const combined = [...now, ...up].filter((m) => {
                    if (seen.has(m.id)) return false;
                    seen.add(m.id);
                    return true;
                });

                setNotifications(combined);
            } catch {
                // fail silently
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const unread = notifications.filter((n) => !seenIds.includes(n.id));
    const unreadCount = unread.length;

    const markAllRead = () => {
        const allIds = notifications.map((n) => n.id);
        const merged = [...new Set([...seenIds, ...allIds])];
        saveSeenIds(merged);
        setSeenIds(merged);
    };

    const markOneRead = (id) => {
        const merged = [...new Set([...seenIds, id])];
        saveSeenIds(merged);
        setSeenIds(merged);
    };

    const isNew = (id) => !seenIds.includes(id);

    const handleSelectMovie = (movie) => {
        markOneRead(movie.id);
        setOpen(false);
        setSelectedMovie(movie);
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* ── Bell Button ── */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="relative flex items-center justify-center w-9 h-9 text-gray-400 hover:text-white transition"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e50914] text-white text-[9px] font-black flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* ── Dropdown Panel ── */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[200] overflow-hidden"
                    style={{ maxHeight: "480px", display: "flex", flexDirection: "column" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                        <div className="flex items-center gap-2">
                            <Bell size={16} className="text-[#e50914]" />
                            <span className="font-black text-sm text-white">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="px-1.5 py-0.5 rounded-full bg-[#e50914] text-white text-[9px] font-black">{unreadCount} new</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-gray-500 hover:text-white transition font-semibold flex items-center gap-1">
                                    <Check size={12} /> Mark all read
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-white transition">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "none" }}>
                        {loading ? (
                            <div className="p-4 space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex gap-3 animate-pulse">
                                        <div className="w-14 h-10 bg-white/5 rounded flex-shrink-0" />
                                        <div className="flex-1 space-y-1.5">
                                            <div className="h-3 bg-white/5 rounded w-3/4" />
                                            <div className="h-2 bg-white/5 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-600 gap-2">
                                <Bell size={32} strokeWidth={1} />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            <div>
                                {/* Unread section */}
                                {unread.length > 0 && (
                                    <div>
                                        <p className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-600">New Arrivals</p>
                                        {unread.map((movie) => (
                                            <NotifCard key={movie.id} movie={movie} isNew onDismiss={() => markOneRead(movie.id)} onClick={() => handleSelectMovie(movie)} />
                                        ))}
                                    </div>
                                )}

                                {/* Read section */}
                                {notifications.filter((n) => seenIds.includes(n.id)).length > 0 && (
                                    <div>
                                        <p className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-600">Earlier</p>
                                        {notifications.filter((n) => seenIds.includes(n.id)).map((movie) => (
                                            <NotifCard key={movie.id} movie={movie} isNew={false} onDismiss={() => { }} onClick={() => handleSelectMovie(movie)} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/8 px-4 py-2.5">
                        <a
                            href="/new-popular"
                            className="text-xs text-[#e50914] hover:underline font-bold flex items-center gap-1"
                            onClick={() => setOpen(false)}
                        >
                            <ExternalLink size={11} /> View all new & popular
                        </a>
                    </div>
                </div>
            )}

            {/* Movie Modal */}
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
        </div>
    );
};

const NotifCard = ({ movie, isNew, onDismiss, onClick }) => {
    const imgUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w92/${movie.poster_path}`
        : movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`
            : null;

    const releaseYear = movie.release_date?.split("-")[0];

    return (
        <div
            className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition relative group cursor-pointer"
            style={{ backgroundColor: isNew ? "rgba(229,9,20,0.04)" : "transparent" }}
            onClick={onClick}
        >
            {/* Blue dot for unread */}
            {isNew && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#e50914]" />
            )}

            {/* Poster */}
            <div className="w-12 h-16 rounded-md overflow-hidden bg-[#2a2a2a] flex-shrink-0">
                {imgUrl ? (
                    <img src={imgUrl} alt={movie.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Film size={20} className="text-gray-600" />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${movie._type === "Now Playing"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                        }`}>
                        {movie._type}
                    </span>
                </div>
                <p className="text-sm font-black text-white line-clamp-1">{movie.title}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                    {releaseYear} · ⭐ {movie.vote_average?.toFixed(1)}
                </p>
                <p className="text-[10px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                    {movie.overview?.slice(0, 90)}{movie.overview?.length > 90 ? "…" : ""}
                </p>
            </div>

            {/* Dismiss */}
            {isNew && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDismiss(); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-white transition flex-shrink-0 mt-0.5"
                    title="Mark as read"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
};

export default NotificationPanel;
