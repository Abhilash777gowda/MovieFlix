import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import axios from "axios";
import { Play, Trash2, Info, Plus, LogIn } from "lucide-react";
import MovieModal from "../components/MovieModal";
import { Link } from "react-router-dom";
import API_BASE from "../api";

const Watchlist = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const { user } = UserAuth();

    useEffect(() => {
        if (!user?.email) {
            setLoading(false);
            return;
        }

        setLoading(true);
        axios
            .get(`${API_BASE}/api/user/watchlist/${user.email}`)
            .then((res) => {
                // res.data is the watchlist array
                if (Array.isArray(res.data)) {
                    setMovies(res.data);
                } else {
                    setMovies([]);
                }
            })
            .catch((err) => {
                // 404 = user has no DB record yet (never saved anything before)
                console.log("Watchlist fetch error:", err?.response?.status, err?.message);
                setMovies([]);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const removeMovie = async (movieId) => {
        try {
            const res = await axios.post(`${API_BASE}/api/user/remove-watchlist`, {
                email: user?.email,
                movieId: movieId,
            });
            if (Array.isArray(res.data)) {
                setMovies(res.data);
            }
        } catch (error) {
            console.log("Remove error:", error);
            // Optimistic update fallback
            setMovies((prev) => prev.filter((m) => m.id !== movieId));
        }
    };

    // Not signed in state
    if (!user?.email && !loading) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white gap-6">
                <LogIn size={64} className="text-gray-600" />
                <h2 className="text-3xl font-black uppercase tracking-widest">Sign In Required</h2>
                <p className="text-gray-500 text-center max-w-sm">
                    You need to be signed in to view your watchlist.
                </p>
                <Link
                    to="/"
                    className="bg-[#e50914] text-white px-10 py-3 rounded-md font-black hover:bg-[#b9090b] transition shadow-2xl active:scale-95 uppercase tracking-wider text-sm"
                >
                    Go Home
                </Link>
            </div>
        );
    }

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-[#141414] pt-28 pb-12 px-4 md:px-12">
                <div className="h-12 w-48 bg-white/5 rounded-lg mb-10 animate-pulse" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-video bg-white/5 rounded-md animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-[#141414] pt-24 pb-16 px-4 md:px-12 xl:px-16">
                <div className="max-w-[1920px] mx-auto">
                    {/* Header */}
                    <header className="mb-8 flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
                        <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">
                            My List
                        </h1>
                        <p className="text-gray-500 font-bold text-base sm:text-lg sm:mb-1 uppercase tracking-widest">
                            {movies.length} {movies.length === 1 ? "Title" : "Titles"}
                        </p>
                    </header>

                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {movies.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-[#181818] rounded-md overflow-hidden border border-white/5 shadow-xl"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            src={
                                                item?.backdrop_path || item?.poster_path
                                                    ? `https://image.tmdb.org/t/p/w500/${item.backdrop_path || item.poster_path}`
                                                    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500"
                                            }
                                            alt={item?.title}
                                        />
                                        {/* Dark overlay on hover */}
                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => setSelectedMovie(item)}
                                                className="w-11 h-11 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition active:scale-90 shadow-xl"
                                                title="Play / Info"
                                            >
                                                <Play size={20} fill="black" className="ml-0.5" />
                                            </button>
                                            <button
                                                onClick={() => removeMovie(item.id)}
                                                className="w-11 h-11 rounded-full bg-[#2a2a2a] border-2 border-gray-500 flex items-center justify-center hover:bg-red-600/20 hover:border-red-500 transition active:scale-90"
                                                title="Remove from My List"
                                            >
                                                <Trash2 size={18} className="text-white group-hover:text-red-400 transition" />
                                            </button>
                                            <button
                                                onClick={() => setSelectedMovie(item)}
                                                className="w-11 h-11 rounded-full bg-[#2a2a2a] border-2 border-gray-500 flex items-center justify-center hover:border-white transition active:scale-90"
                                                title="More Info"
                                            >
                                                <Info size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-3 space-y-0.5">
                                        <p className="text-white font-black text-sm truncate">
                                            {item?.title || item?.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-500">
                                            <span className="text-green-500">
                                                {Math.round((item?.vote_average || 0) * 10)}% Match
                                            </span>
                                            <span>•</span>
                                            <span>{item?.release_date?.split("-")[0] || "N/A"}</span>
                                            <span className="ml-auto border border-gray-600 px-1 py-px rounded text-[9px] text-gray-400">
                                                HD
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <Plus size={48} strokeWidth={1} className="text-gray-600" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-300 text-2xl font-black uppercase tracking-widest">
                                    Your List is Empty
                                </p>
                                <p className="text-gray-600 max-w-sm mx-auto font-medium text-sm leading-relaxed">
                                    Browse movies and click the <strong className="text-gray-400">+</strong> button on any title to add it here.
                                </p>
                            </div>
                            <Link
                                to="/"
                                className="bg-[#e50914] text-white px-10 py-3 rounded-md font-black hover:bg-[#b9090b] transition shadow-2xl active:scale-95 uppercase tracking-wider text-sm"
                            >
                                Browse Movies
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Movie Info Modal */}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}
        </>
    );
};

export default Watchlist;
