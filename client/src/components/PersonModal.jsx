import React, { useState, useEffect } from "react";
import {
    X, Star, Film, Tv, ExternalLink, Calendar, MapPin,
    ChevronLeft, ChevronRight, User
} from "lucide-react";
import axios from "axios";

const API_KEY = "92b44f51a2134bda7e85c0ff1a41de6b";

const PersonModal = ({ personId, personName, onClose }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("bio");
    const [photoIdx, setPhotoIdx] = useState(0);

    useEffect(() => {
        if (!personId) return;
        setLoading(true);
        setData(null);
        setActiveTab("bio");
        setPhotoIdx(0);

        axios
            .get(
                `https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}&append_to_response=movie_credits,tv_credits,images,external_ids`
            )
            .then((res) => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));

        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [personId]);

    if (!personId) return null;

    // Derived data
    const name = data?.name || personName || "Loading…";
    const bio = data?.biography;
    const birthday = data?.birthday;
    const deathday = data?.deathday;
    const birthplace = data?.place_of_birth;
    const knownFor = data?.known_for_department;
    const popularity = data?.popularity?.toFixed(1);
    const imdbId = data?.external_ids?.imdb_id;
    const instagram = data?.external_ids?.instagram_id;
    const profilePath = data?.profile_path;

    const photos = (data?.images?.profiles || []).filter((p) => p.file_path);
    const currentPhoto = photos[photoIdx];

    // Movie credits sorted by release date desc
    const movies = (data?.movie_credits?.cast || [])
        .filter((m) => m.poster_path || m.backdrop_path)
        .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
        .slice(0, 30);

    // TV credits sorted by first_air_date desc
    const tvShows = (data?.tv_credits?.cast || [])
        .filter((t) => t.poster_path || t.backdrop_path)
        .sort((a, b) => (b.first_air_date || "").localeCompare(a.first_air_date || ""))
        .slice(0, 20);

    // Crew credits
    const crewMovies = (data?.movie_credits?.crew || [])
        .filter((m) => m.poster_path)
        .sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""))
        .slice(0, 15);

    const TABS = [
        { key: "bio", label: "Bio" },
        { key: "movies", label: `Movies (${movies.length})` },
        { key: "tv", label: `TV (${tvShows.length})` },
        ...(photos.length > 0 ? [{ key: "photos", label: `Photos (${photos.length})` }] : []),
    ];

    const age = birthday
        ? Math.floor(
            (new Date(deathday || Date.now()) - new Date(birthday)) / (365.25 * 24 * 60 * 60 * 1000)
        )
        : null;

    return (
        <div
            className="fixed inset-0 z-[300] flex items-center justify-center p-2 md:p-6"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#181818] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] text-white z-10"
                style={{ scrollbarWidth: "none" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#1e1e1e] border border-white/10 flex items-center justify-center hover:bg-[#333] transition"
                >
                    <X size={18} />
                </button>

                {/* ── Hero Header ── */}
                <div className="flex gap-5 p-6 pb-0">
                    {/* Profile Photo */}
                    <div className="w-28 h-36 sm:w-36 sm:h-48 rounded-xl overflow-hidden bg-[#2a2a2a] flex-shrink-0 border border-white/10 shadow-xl">
                        {profilePath ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w342/${profilePath}`}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <User size={48} strokeWidth={1} />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-1">
                        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-1">{name}</h2>

                        {knownFor && (
                            <span className="inline-block text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#e50914]/20 text-[#e50914] mb-3">
                                {knownFor}
                            </span>
                        )}

                        <div className="space-y-1.5 text-sm">
                            {birthday && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Calendar size={14} className="text-gray-600" />
                                    <span>{birthday}{age ? ` (${deathday ? `died aged ${age}` : `age ${age}`})` : ""}</span>
                                </div>
                            )}
                            {birthplace && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPin size={14} className="text-gray-600" />
                                    <span>{birthplace}</span>
                                </div>
                            )}
                            {popularity && (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Star size={14} className="text-yellow-500" />
                                    <span>Popularity: {popularity}</span>
                                </div>
                            )}
                        </div>

                        {/* External links */}
                        <div className="flex items-center gap-2 mt-3">
                            {imdbId && (
                                <a
                                    href={`https://www.imdb.com/name/${imdbId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black hover:bg-yellow-500/30 transition flex items-center gap-1"
                                >
                                    <ExternalLink size={11} /> IMDb
                                </a>
                            )}
                            {instagram && (
                                <a
                                    href={`https://instagram.com/${instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-black hover:bg-pink-500/30 transition flex items-center gap-1"
                                >
                                    <ExternalLink size={11} /> Instagram
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-white/10 px-5 mt-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors relative flex-shrink-0"
                            style={{ color: activeTab === tab.key ? "white" : "#6b7280" }}
                        >
                            {tab.label}
                            {activeTab === tab.key && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e50914] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="p-5 md:p-6 min-h-[200px]">

                    {/* BIO TAB */}
                    {activeTab === "bio" && (
                        <div className="space-y-5">
                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={`h-3 bg-white/5 rounded ${i === 5 ? "w-1/2" : "w-full"}`} />
                                    ))}
                                </div>
                            ) : bio ? (
                                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">{bio}</p>
                            ) : (
                                <p className="text-gray-600 text-sm">No biography available.</p>
                            )}

                            {/* Known for top movies */}
                            {movies.slice(0, 6).length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-3">Known For</p>
                                    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                                        {movies.slice(0, 6).map((m) => (
                                            <div key={m.id} className="flex-shrink-0 w-20 text-center">
                                                <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#2a2a2a] mb-1.5 border border-white/5">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w185/${m.poster_path}`}
                                                        alt={m.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight">{m.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MOVIES TAB */}
                    {activeTab === "movies" && (
                        <div className="space-y-2">
                            {movies.length === 0 ? (
                                <p className="text-gray-600 text-center py-10 text-sm">No movie credits.</p>
                            ) : (
                                <>
                                    {crewMovies.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Directed / Crew</p>
                                            <div className="space-y-1.5">
                                                {crewMovies.map((m) => (
                                                    <FilmographyRow key={`crew-${m.id}-${m.job}`} item={m} role={m.job} type="movie" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">Acting</p>
                                    <div className="space-y-1.5">
                                        {movies.map((m) => (
                                            <FilmographyRow key={m.id} item={m} role={m.character} type="movie" />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* TV TAB */}
                    {activeTab === "tv" && (
                        <div className="space-y-1.5">
                            {tvShows.length === 0 ? (
                                <p className="text-gray-600 text-center py-10 text-sm">No TV credits.</p>
                            ) : (
                                tvShows.map((t) => (
                                    <FilmographyRow key={t.id} item={t} role={t.character} type="tv" />
                                ))
                            )}
                        </div>
                    )}

                    {/* PHOTOS TAB */}
                    {activeTab === "photos" && photos.length > 0 && (
                        <div className="space-y-4">
                            {/* Main photo viewer */}
                            <div className="relative aspect-[2/3] max-h-96 mx-auto overflow-hidden rounded-xl bg-[#2a2a2a] flex items-center justify-center" style={{ maxWidth: "280px" }}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${photos[photoIdx].file_path}`}
                                    alt={`${name} photo ${photoIdx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {photos.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setPhotoIdx((i) => (i - 1 + photos.length) % photos.length)}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button
                                            onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:bg-black transition"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </>
                                )}
                                <span className="absolute bottom-2 right-2 text-[10px] bg-black/70 px-2 py-0.5 rounded">
                                    {photoIdx + 1} / {photos.length}
                                </span>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                                {photos.slice(0, 20).map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPhotoIdx(i)}
                                        className={`flex-shrink-0 w-14 h-20 rounded-lg overflow-hidden border-2 transition ${i === photoIdx ? "border-[#e50914]" : "border-transparent opacity-50 hover:opacity-80"}`}
                                    >
                                        <img src={`https://image.tmdb.org/t/p/w185/${p.file_path}`} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilmographyRow = ({ item, role, type }) => {
    const year = (item.release_date || item.first_air_date || "")?.split("-")[0];
    const title = item.title || item.name;
    const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w92/${item.poster_path}`
        : null;

    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition group">
            <div className="w-10 h-14 rounded-md overflow-hidden bg-[#2a2a2a] flex-shrink-0 border border-white/5">
                {poster ? (
                    <img src={poster} alt={title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {type === "tv" ? <Tv size={14} className="text-gray-600" /> : <Film size={14} className="text-gray-600" />}
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white line-clamp-1">{title}</p>
                {role && <p className="text-xs text-gray-500 line-clamp-1 italic">{role}</p>}
            </div>
            <div className="text-right flex-shrink-0">
                <span className="text-xs text-gray-600">{year || "—"}</span>
                {item.vote_average > 0 && (
                    <p className="text-[10px] text-yellow-500 mt-0.5 flex items-center gap-0.5 justify-end">
                        <Star size={9} fill="currentColor" />{item.vote_average?.toFixed(1)}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PersonModal;
