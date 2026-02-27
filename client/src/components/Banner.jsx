import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import requests from "../requests";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import MovieModal from "./MovieModal";

const INTERVAL_MS = 5000; // rotate every 5s (felt smoother than 3s)

const Banner = ({ requestURL }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [fading, setFading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const timerRef = useRef(null);
    const url = requestURL || requests.requestPopular;

    useEffect(() => {
        setLoading(true);
        axios
            .get(url)
            .then((res) => {
                const filtered = (res.data.results || []).filter((m) => m.backdrop_path);
                setMovies(filtered.slice(0, 10)); // keep top 10
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [url]);

    // Auto-rotate
    useEffect(() => {
        if (movies.length < 2) return;
        timerRef.current = setInterval(() => {
            goTo((prev) => (prev + 1) % movies.length);
        }, INTERVAL_MS);
        return () => clearInterval(timerRef.current);
    }, [movies]);

    // Reset image load state when slide changes
    useEffect(() => {
        setImageLoaded(false);
    }, [index]);

    const goTo = (getNext) => {
        setFading(true);
        setPrevIndex(index);
        setTimeout(() => {
            setIndex((prev) => {
                const next = typeof getNext === "function" ? getNext(prev) : getNext;
                return next;
            });
            setFading(false);
            setPrevIndex(null);
        }, 600);
    };

    const navigate = (dir) => {
        clearInterval(timerRef.current);
        goTo((prev) => (prev + dir + movies.length) % movies.length);
        // restart timer
        timerRef.current = setInterval(() => {
            goTo((prev) => (prev + 1) % movies.length);
        }, INTERVAL_MS);
    };

    const truncate = (str, num) =>
        str?.length > num ? str.slice(0, num) + "..." : str;

    if (loading) {
        return (
            <div style={{ height: "90vh", minHeight: "500px" }} className="w-full bg-black">
                <div className="w-full h-full animate-pulse bg-gradient-to-b from-gray-900 to-[#141414]" />
            </div>
        );
    }

    if (!movies.length) return null;

    const movie = movies[index];
    const prevMovie = prevIndex !== null ? movies[prevIndex] : null;

    return (
        <>
            <div
                className="w-full relative overflow-hidden mt-14 md:mt-16"
                style={{
                    height: "clamp(340px, 56vw, 90vh)",
                    minHeight: "320px",
                }}
            >
                {/* ─── Previous Slide (fades out) ─── */}
                {prevMovie && (
                    <div
                        key={`prev-${prevIndex}`}
                        className="absolute inset-0"
                        style={{ zIndex: 1, animation: "fadeOut 0.6s ease-in-out forwards" }}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/original/${prevMovie.backdrop_path}`}
                            alt={prevMovie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0.1) 100%)", zIndex: 1 }} />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.3) 40%, transparent 100%)", zIndex: 1 }} />
                    </div>
                )}

                {/* ─── Current Slide (fades/zooms in) ─── */}
                <div
                    key={`slide-${index}`}
                    className="absolute inset-0 skeleton-bg"
                    style={{ zIndex: 2, animation: fading ? "fadeOut 0.6s ease-in-out forwards" : "fadeIn 0.8s ease-in-out forwards" }}
                >
                    {/* Backdrop Image */}
                    <img
                        src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
                        alt={movie?.title || movie?.name}
                        className={`w-full h-full object-cover object-center transition-opacity duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{ animation: "kenBurns 6s ease-in-out forwards" }}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                    {/* Gradient overlays — stronger on mobile so text stays readable */}
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.1) 100%)", zIndex: 1 }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.5) 40%, transparent 100%)", zIndex: 1 }} />
                </div>

                {/* ─── Content ─── */}
                <div
                    className="relative h-full flex flex-col justify-end px-4 sm:px-8 md:px-14 xl:px-20 pb-16 sm:pb-24 md:pb-36"
                    style={{ zIndex: 10 }}
                >
                    <div
                        key={`content-${index}`}
                        className="max-w-[680px] space-y-2 sm:space-y-4 md:space-y-5"
                        style={{ animation: fading ? "slideOut 0.4s ease-in-out forwards" : "slideIn 0.7s cubic-bezier(0.2,0.8,0.2,1) forwards" }}
                    >
                        {/* Badge */}
                        <div className="hidden sm:flex items-center gap-2 text-[#e50914] font-bold uppercase text-[10px] md:text-[11px] tracking-[0.35em]">
                            <span className="inline-block h-px w-5 bg-[#e50914]" />
                            Featured Today
                        </div>

                        {/* Title */}
                        <h1
                            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] text-white"
                            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}
                        >
                            {movie?.title || movie?.name}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-300">
                            <span className="text-green-400">{Math.round((movie?.vote_average || 0) * 10)}% Match</span>
                            <span className="border border-gray-600 px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-gray-400">
                                {movie?.adult ? "18+" : "PG-13"}
                            </span>
                            <span className="text-gray-400">{movie?.release_date?.split("-")[0]}</span>
                        </div>

                        {/* Overview — hidden on small phones to save space */}
                        <p className="hidden sm:block text-sm md:text-base text-gray-200 leading-relaxed max-w-[540px]">
                            {truncate(movie?.overview, 155)}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-2 sm:gap-3 pt-1">
                            <button
                                onClick={() => setSelectedMovie(movie)}
                                className="flex items-center gap-1.5 sm:gap-2 bg-white text-black font-black text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-white/90 transition active:scale-95 shadow-2xl"
                            >
                                <Play size={16} fill="black" className="sm:w-5 sm:h-5" /> Play
                            </button>
                            <button
                                onClick={() => setSelectedMovie(movie)}
                                className="flex items-center gap-1.5 sm:gap-2 font-black text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3 rounded-md hover:bg-white/20 transition active:scale-95 border border-white/20 text-white"
                                style={{ backgroundColor: "rgba(109,109,110,0.5)" }}
                            >
                                <Info size={16} className="sm:w-5 sm:h-5" /> More Info
                            </button>
                        </div>
                    </div>

                    {/* ─── Navigation Row ─── */}
                    <div className="flex items-center justify-between mt-8">
                        {/* Dot Indicators */}
                        <div className="flex items-center gap-2">
                            {movies.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { clearInterval(timerRef.current); goTo(i); }}
                                    className="transition-all duration-300 rounded-full"
                                    style={{
                                        width: i === index ? "28px" : "8px",
                                        height: "4px",
                                        backgroundColor: i === index ? "#e50914" : "rgba(255,255,255,0.35)",
                                        borderRadius: "2px",
                                    }}
                                />
                            ))}
                        </div>

                        {/* Prev / Next Arrows */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-white/20 border border-white/20 active:scale-90"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => navigate(1)}
                                className="w-9 h-9 rounded-full flex items-center justify-center transition hover:bg-white/20 border border-white/20 active:scale-90"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movie Modal */}
            {selectedMovie && (
                <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
            )}

            <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.1) translate(-1%, 0.5%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-16px); }
        }
      `}</style>
        </>
    );
};

export default Banner;
