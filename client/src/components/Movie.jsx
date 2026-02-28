import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Heart, Plus, Check, Play, Info } from "lucide-react";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import MovieModal from "./MovieModal";
import API_BASE from "../api";

const Movie = ({ item }) => {
    const [like, setLike] = useState(false);
    const [saved, setSaved] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { user } = UserAuth();

    useEffect(() => {
        if (!user?.email) return;
        axios.get(`${API_BASE}/api/user/likes/${user.email}`).then((res) => {
            if (Array.isArray(res.data) && res.data.includes(item.id)) setLike(true);
        }).catch(() => { });
        axios.get(`${API_BASE}/api/user/watchlist/${user.email}`).then((res) => {
            if (Array.isArray(res.data) && res.data.some((m) => m.id === item.id)) setSaved(true);
        }).catch(() => { });
    }, [user, item.id]);

    const toggleLike = async (e) => {
        e.stopPropagation();
        if (!user?.email) return alert("Please sign in to like movies");
        const next = !like; setLike(next);
        try {
            await axios.post(`${API_BASE}/api/user/toggle-like`, { email: user.email, movieId: item.id });
        } catch { setLike(!next); }
    };

    const toggleSave = async (e) => {
        e.stopPropagation();
        if (!user?.email) return alert("Please sign in to save movies");
        if (saved) {
            setSaved(false);
            try { await axios.post(`${API_BASE}/api/user/remove-watchlist`, { email: user.email, movieId: item.id }); }
            catch { setSaved(true); }
        } else {
            setSaved(true);
            try {
                const cleanMovie = {
                    id: item.id, title: item.title || item.name || "", name: item.name || "",
                    overview: item.overview || "", backdrop_path: item.backdrop_path || "",
                    poster_path: item.poster_path || "", vote_average: item.vote_average || 0,
                    release_date: item.release_date || item.first_air_date || "",
                    adult: item.adult || false, media_type: item.media_type || "movie",
                };
                await axios.post(`${API_BASE}/api/user/add-watchlist`, { email: user.email, movie: cleanMovie });
            } catch { setSaved(false); }
        }
    };

    const img = item?.poster_path || item?.backdrop_path;
    const imgUrl = img
        ? `https://image.tmdb.org/t/p/w500/${img}`
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500";

    // Controls are always shown on touch devices; hover-revealed on desktop
    // We use the CSS class "touch-overlay" which is always-visible on touch screens
    const overlayVisible = hovered;

    return (
        <>
            {/* Card — min width slightly smaller for phones */}
            <div
                className="relative flex-shrink-0 cursor-pointer group card-item"
                style={{ width: "clamp(140px, 38vw, 280px)" }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setShowModal(true)}
            >
                {/* ── Thumbnail ── */}
                <div
                    className="relative overflow-hidden rounded-md"
                    style={{
                        aspectRatio: "2/3",
                        transform: hovered ? "scale(1.08)" : "scale(1)",
                        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.8)" : "0 2px 8px rgba(0,0,0,0.4)",
                        zIndex: hovered ? 20 : 1,
                    }}
                >
                    <img
                        className="w-full h-full object-cover"
                        src={imgUrl}
                        alt={item?.title || item?.name}
                        loading="lazy"
                    />

                    {/* Overlay — always visible on touch, hover-only on desktop */}
                    <div
                        className="absolute inset-0 flex flex-col justify-end p-2 touch-overlay"
                        style={{
                            background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 55%, transparent 100%)",
                            opacity: overlayVisible ? 1 : 0,
                            transition: "opacity 0.3s ease",
                            pointerEvents: overlayVisible ? "auto" : "none",
                        }}
                    >
                        {/* Title */}
                        <p className="text-white font-black text-xs leading-tight line-clamp-1 mb-1.5">
                            {item?.title || item?.name}
                        </p>

                        {/* Action row */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {/* Play */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                                className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:scale-110 transition active:scale-95 flex-shrink-0"
                                title="Play"
                            >
                                <Play size={12} fill="black" className="ml-0.5" />
                            </button>

                            {/* Add to list */}
                            <button
                                onClick={toggleSave}
                                className="w-7 h-7 rounded-full border border-gray-400 bg-black/50 flex items-center justify-center hover:border-white hover:scale-110 transition active:scale-95 text-white flex-shrink-0"
                                title={saved ? "Remove from List" : "Add to List"}
                            >
                                {saved ? <Check size={12} className="text-green-400" /> : <Plus size={12} />}
                            </button>

                            {/* Like */}
                            <button
                                onClick={toggleLike}
                                className="w-7 h-7 rounded-full border border-gray-400 bg-black/50 flex items-center justify-center hover:border-white hover:scale-110 transition active:scale-95 text-white flex-shrink-0"
                                title="Like"
                            >
                                <Heart size={12} className={like ? "fill-red-500 text-red-500" : ""} />
                            </button>

                            {/* Info */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                                className="w-7 h-7 rounded-full border border-gray-400 bg-black/50 flex items-center justify-center hover:border-white hover:scale-110 transition active:scale-95 text-white ml-auto flex-shrink-0"
                                title="More Info"
                            >
                                <Info size={12} />
                            </button>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold">
                            <span className="text-green-400">{Math.round((item?.vote_average || 0) * 10)}%</span>
                            <span className="border border-gray-600 px-1 rounded text-gray-400">
                                {item?.adult ? "18+" : "PG"}
                            </span>
                            <span className="text-gray-500">{item?.release_date?.split("-")[0] || ""}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && ReactDOM.createPortal(
                <MovieModal movie={item} onClose={() => setShowModal(false)} />,
                document.body
            )}
        </>
    );
};

export default Movie;
