import React, { useState, useEffect } from "react";
import {
    X, Play, Heart, Plus, Check, Star, Clock, Calendar,
    DollarSign, TrendingUp, Globe, Building2, Tag, Users, Film, ExternalLink, Image
} from "lucide-react";
import axios from "axios";
import { UserAuth } from "../context/AuthContext";
import PersonModal from "./PersonModal";
import API_BASE from "../api";

const API_KEY = "92b44f51a2134bda7e85c0ff1a41de6b";

const fmt = (n) => n > 0 ? `$${n.toLocaleString()}` : "N/A";
const fmtRuntime = (m) => m ? `${Math.floor(m / 60)}h ${m % 60}m` : null;

// USD → INR (1 USD ≈ ₹83.5)
const USD_TO_INR = 83.5;
const fmtINR = (usd) => {
    if (!usd || usd <= 0) return null;
    const inr = usd * USD_TO_INR;
    if (inr >= 1e12) return `₹${(inr / 1e12).toFixed(2)} Lakh Crore`;
    if (inr >= 1e9) return `₹${(inr / 1e7).toFixed(0)} Crore`;
    if (inr >= 1e7) return `₹${(inr / 1e7).toFixed(2)} Crore`;
    if (inr >= 1e5) return `₹${(inr / 1e5).toFixed(2)} Lakh`;
    return `₹${inr.toLocaleString("en-IN")}`;
};

const Badge = ({ children }) => (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/8 border border-white/10 text-gray-300">
        {children}
    </span>
);

const DetailRow = ({ label, value, icon: Icon }) => {
    if (!value || value === "N/A") return null;
    return (
        <div className="flex items-start gap-2 text-sm">
            {Icon && <Icon size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />}
            <span className="text-gray-500 flex-shrink-0">{label}:</span>
            <span className="text-gray-200 break-words">{value}</span>
        </div>
    );
};

const MoneyRow = ({ label, usd, icon: Icon }) => {
    if (!usd || usd <= 0) return null;
    const inr = fmtINR(usd);
    return (
        <div className="flex items-start gap-2 text-sm">
            {Icon && <Icon size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />}
            <span className="text-gray-500 flex-shrink-0">{label}:</span>
            <span>
                <span className="block text-gray-200">${usd.toLocaleString()}</span>
                {inr && <span className="block text-green-400 text-xs font-bold mt-0.5">{inr}</span>}
            </span>
        </div>
    );
};

const MovieModal = ({ movie, onClose }) => {
    const [trailer, setTrailer] = useState(null);
    const [details, setDetails] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [like, setLike] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const { user } = UserAuth();

    const isTV = movie?.media_type === "tv" || !!movie?.first_air_date;

    useEffect(() => {
        if (!movie) return;
        setDetails(null); setTrailer(null); setPlaying(false); setActiveTab("overview");

        const type = isTV ? "tv" : "movie";

        // Trailer
        axios.get(`https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${API_KEY}`)
            .then((res) => {
                const t = res.data.results.find((v) => v.type === "Trailer" && v.site === "YouTube")
                    || res.data.results.find((v) => v.site === "YouTube");
                if (t) setTrailer(t);
            }).catch(() => { });

        // Full details + credits + keywords + images
        axios.get(
            `https://api.themoviedb.org/3/${type}/${movie.id}?api_key=${API_KEY}&append_to_response=credits,keywords,similar,recommendations,external_ids,watch/providers,images`
        ).then((res) => setDetails(res.data)).catch(() => { });

        // Liked / saved
        if (user?.email) {
            axios.get(`${API_BASE}/api/user/likes/${user.email}`)
                .then((res) => { if (res.data?.includes(movie.id)) setLike(true); }).catch(() => { });
            axios.get(`${API_BASE}/api/user/watchlist/${user.email}`)
                .then((res) => { if (res.data?.some?.((m) => m.id === movie.id)) setSaved(true); }).catch(() => { });
        }

        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, [movie, user]);

    const toggleLike = async () => {
        if (!user?.email) return alert("Please sign in first");
        const next = !like; setLike(next);
        try { await axios.post(`${API_BASE}/api/user/toggle-like`, { email: user.email, movieId: movie.id }); }
        catch { setLike(!next); }
    };

    const toggleSave = async () => {
        if (!user?.email) return alert("Please sign in first");
        if (saved) {
            setSaved(false);
            try { await axios.post(`${API_BASE}/api/user/remove-watchlist`, { email: user.email, movieId: movie.id }); }
            catch { setSaved(true); }
        } else {
            setSaved(true);
            try {
                const cleanMovie = {
                    id: movie.id, title: movie.title || movie.name || "", name: movie.name || "",
                    overview: movie.overview || "", backdrop_path: movie.backdrop_path || "",
                    poster_path: movie.poster_path || "", vote_average: movie.vote_average || 0,
                    release_date: movie.release_date || movie.first_air_date || "",
                    adult: movie.adult || false, media_type: movie.media_type || "movie",
                };
                await axios.post(`${API_BASE}/api/user/add-watchlist`, { email: user.email, movie: cleanMovie });
            } catch { setSaved(false); }
        }
    };

    if (!movie) return null;

    // Extract all the data
    const title = details?.title || details?.name || movie.title || movie.name;
    const tagline = details?.tagline;
    const overview = details?.overview || movie.overview;
    const rating = (details?.vote_average || movie.vote_average)?.toFixed(1);
    const voteCount = details?.vote_count?.toLocaleString();
    const runtime = fmtRuntime(details?.runtime || details?.episode_run_time?.[0]);
    const releaseDate = details?.release_date || details?.first_air_date || movie.release_date;
    const status = details?.status;
    const originalLang = details?.original_language?.toUpperCase();
    const budget = fmt(details?.budget);
    const revenue = fmt(details?.revenue);
    const genres = details?.genres || [];
    const cast = details?.credits?.cast?.slice(0, 10) || [];
    const crew = details?.credits?.crew || [];
    const director = crew.find((c) => c.job === "Director");
    const writers = crew.filter((c) => ["Writer", "Screenplay", "Story"].includes(c.job)).slice(0, 3);
    const productionCompanies = details?.production_companies || [];
    const productionCountries = details?.production_countries?.map((c) => c.name).join(", ");
    const spokenLanguages = details?.spoken_languages?.map((l) => l.english_name).join(", ");
    const keywords = (details?.keywords?.keywords || details?.keywords?.results || []).slice(0, 15);
    const popularity = details?.popularity?.toFixed(0);
    const homepage = details?.homepage;
    const imdbId = details?.external_ids?.imdb_id || details?.imdb_id;
    const seasons = details?.number_of_seasons;
    const episodes = details?.number_of_episodes;
    const networks = details?.networks?.map((n) => n.name).join(", ");
    const similar = details?.similar?.results?.filter((m) => m.backdrop_path).slice(0, 6) || [];
    const screenshots = details?.images?.backdrops?.slice(0, 6) || [];

    // Watch providers — prefer India (IN), fallback to US
    const watchData = details?.["watch/providers"]?.results;
    const regionProviders = watchData?.IN || watchData?.US || null;
    const streamingOn = regionProviders?.flatrate || [];
    const rentOn = regionProviders?.rent || [];
    const buyOn = regionProviders?.buy || [];
    const watchLink = regionProviders?.link || null;
    const hasProviders = streamingOn.length > 0 || rentOn.length > 0 || buyOn.length > 0;

    const backdropUrl = `https://image.tmdb.org/t/p/original/${movie.backdrop_path || movie.poster_path}`;

    const TABS = ["overview", "details", "cast", "similar"];

    return (
        <>
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 md:p-6" onClick={onClose}>
                <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

                <div
                    className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#181818] rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.9)] text-white z-10"
                    style={{ scrollbarWidth: "none" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ── Close ── */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-[#181818]/90 flex items-center justify-center hover:bg-[#333] transition border border-white/10 shadow-xl"
                    >
                        <X size={18} />
                    </button>

                    {/* ── Hero ── */}
                    <div className="relative w-full aspect-video bg-black rounded-t-2xl overflow-hidden">
                        {playing && trailer ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`}
                                title={trailer.name}
                                frameBorder="0"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent z-10" />
                                <img src={backdropUrl} alt={title} className="w-full h-full object-cover" />

                                {/* Hero Content */}
                                <div className="absolute bottom-0 left-0 z-20 p-5 md:p-7 space-y-3 w-full">
                                    {tagline && <p className="text-[#e50914] text-xs font-bold uppercase tracking-widest italic">"{tagline}"</p>}
                                    <h2 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-xl">{title}</h2>

                                    {/* Quick stats */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                                        {rating && <span className="flex items-center gap-1 text-yellow-400"><Star size={12} fill="currentColor" />{rating}/10</span>}
                                        {voteCount && <span className="text-gray-400">{voteCount} votes</span>}
                                        {runtime && <span className="flex items-center gap-1 text-gray-400"><Clock size={12} />{runtime}</span>}
                                        {releaseDate && <span className="flex items-center gap-1 text-gray-400"><Calendar size={12} />{releaseDate}</span>}
                                        {seasons && <span className="text-gray-400">{seasons} season{seasons !== 1 ? "s" : ""}</span>}
                                        {episodes && <span className="text-gray-400">{episodes} episodes</span>}
                                        <span className="border border-gray-600 px-1.5 py-0.5 rounded text-gray-400">{movie.adult ? "18+" : "PG-13"}</span>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {trailer ? (
                                            <button onClick={() => setPlaying(true)}
                                                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md font-black text-sm hover:bg-white/90 transition active:scale-95"
                                            ><Play size={16} fill="black" /> Play Trailer</button>
                                        ) : (
                                            <button className="flex items-center gap-2 bg-gray-600/50 text-white/40 px-5 py-2.5 rounded-md font-black text-sm cursor-not-allowed">
                                                <Play size={16} /> No Trailer
                                            </button>
                                        )}
                                        <button onClick={toggleSave}
                                            className="w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition bg-black/40"
                                            title={saved ? "Remove from My List" : "Add to My List"}
                                        >
                                            {saved ? <Check size={16} className="text-green-400" /> : <Plus size={16} />}
                                        </button>
                                        <button onClick={toggleLike}
                                            className="w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition bg-black/40"
                                            title="Like"
                                        >
                                            <Heart size={16} className={like ? "fill-red-500 text-red-500" : ""} />
                                        </button>
                                        {homepage && (
                                            <a href={homepage} target="_blank" rel="noopener noreferrer"
                                                className="w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition bg-black/40"
                                                title="Official Website"
                                            ><ExternalLink size={14} /></a>
                                        )}
                                        {imdbId && (
                                            <a href={`https://www.imdb.com/title/${imdbId}`} target="_blank" rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black hover:bg-yellow-500/30 transition"
                                            >IMDb</a>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex border-b border-white/10 px-6 mt-0">
                        {TABS.map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className="px-4 py-3 text-sm font-bold capitalize transition-colors relative"
                                style={{ color: activeTab === tab ? "white" : "#6b7280" }}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e50914] rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* ── Tab Content ── */}
                    <div className="p-5 md:p-7 space-y-6 min-h-[200px]">

                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && (
                            <div className="space-y-5">
                                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{overview || "No overview available."}</p>

                                {/* Genres */}
                                {genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map((g) => <Badge key={g.id}>{g.name}</Badge>)}
                                    </div>
                                )}

                                {/* ── WHERE TO WATCH ── */}
                                {details && (
                                    <div className="border border-white/8 rounded-xl p-4 bg-white/[0.02]">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
                                            <span className="text-[#e50914]">▶</span> Where to Watch
                                        </p>
                                        {!hasProviders ? (
                                            <p className="text-gray-600 text-xs">No streaming info available for your region.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {streamingOn.length > 0 && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Stream Free / Subscription</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {streamingOn.map((p) => (
                                                                <ProviderLogo key={p.provider_id} provider={p} link={watchLink} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {rentOn.length > 0 && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Rent</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {rentOn.map((p) => (
                                                                <ProviderLogo key={p.provider_id} provider={p} link={watchLink} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {buyOn.length > 0 && (
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-2">Buy</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {buyOn.map((p) => (
                                                                <ProviderLogo key={p.provider_id} provider={p} link={watchLink} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {watchLink && (
                                            <a href={watchLink} target="_blank" rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-1 text-[10px] text-gray-600 hover:text-white transition"
                                            >
                                                <ExternalLink size={10} /> Powered by JustWatch
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Keywords */}
                                {keywords.length > 0 && (
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={11} /> Keywords</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {keywords.map((k) => (
                                                <span key={k.id} className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/8 text-gray-400 rounded">
                                                    {k.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Screenshots */}
                                {screenshots.length > 0 && (
                                    <div className="pt-2">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5"><Image size={11} /> Screenshots</p>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                            {screenshots.map((img, i) => (
                                                <div key={i} className="aspect-video rounded-lg overflow-hidden border border-white/10 group bg-[#181818]">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                                                        alt={`${title} screenshot ${i + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* DETAILS TAB */}
                        {activeTab === "details" && (
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
                                <DetailRow label="Status" value={status} icon={Film} />
                                <DetailRow label="Release Date" value={releaseDate} icon={Calendar} />
                                <DetailRow label="Runtime" value={runtime} icon={Clock} />
                                <DetailRow label="Original Language" value={originalLang} icon={Globe} />
                                <DetailRow label="Spoken Languages" value={spokenLanguages} icon={Globe} />
                                <DetailRow label="Rating" value={`${rating}/10 (${voteCount} votes)`} icon={Star} />
                                <DetailRow label="Popularity Score" value={popularity} icon={TrendingUp} />
                                {!isTV && <MoneyRow label="Budget" usd={details?.budget} icon={DollarSign} />}
                                {!isTV && <MoneyRow label="Box Office" usd={details?.revenue} icon={TrendingUp} />}
                                {!isTV && details?.budget > 0 && details?.revenue > 0 && (
                                    <MoneyRow
                                        label="Profit"
                                        usd={details.revenue - details.budget}
                                        icon={TrendingUp}
                                    />
                                )}
                                <DetailRow label="Production Countries" value={productionCountries} icon={Globe} />
                                <DetailRow label="Director" value={director?.name} icon={Film} />
                                {writers.length > 0 && <DetailRow label="Writers" value={writers.map((w) => w.name).join(", ")} icon={Film} />}
                                {seasons && <DetailRow label="Seasons" value={String(seasons)} icon={Film} />}
                                {episodes && <DetailRow label="Episodes" value={String(episodes)} icon={Film} />}
                                {networks && <DetailRow label="Network" value={networks} icon={Building2} />}

                                {/* Production Companies */}
                                {productionCompanies.length > 0 && (
                                    <div className="sm:col-span-2 pt-2">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                                            <Building2 size={11} /> Production Companies
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {productionCompanies.map((co) => (
                                                <div key={co.id} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-lg px-3 py-2">
                                                    {co.logo_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w92/${co.logo_path}`}
                                                            alt={co.name}
                                                            className="h-5 object-contain filter invert opacity-70"
                                                        />
                                                    ) : (
                                                        <Building2 size={14} className="text-gray-500" />
                                                    )}
                                                    <span className="text-xs text-gray-400 font-semibold">{co.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CAST TAB */}
                        {activeTab === "cast" && (
                            <div className="space-y-6">
                                {cast.length > 0 ? (
                                    <>
                                        {director && (
                                            <div>
                                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Director</p>
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer group/dir hover:bg-white/5 rounded-xl p-2 transition"
                                                    onClick={() => setSelectedPerson({ id: director.id, name: director.name })}
                                                >
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-[#2a2a2a] flex-shrink-0 border-2 border-transparent group-hover/dir:border-[#e50914] transition">
                                                        {director.profile_path ? (
                                                            <img src={`https://image.tmdb.org/t/p/w185/${director.profile_path}`} alt={director.name} className="w-full h-full object-cover" />
                                                        ) : <div className="w-full h-full flex items-center justify-center text-gray-600">👤</div>}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm group-hover/dir:text-[#e50914] transition">{director.name}</p>
                                                        <p className="text-gray-500 text-xs">Director · tap for details</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1"><Users size={11} /> Cast</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                                {cast.map((actor) => (
                                                    <div
                                                        key={actor.id}
                                                        className="text-center group cursor-pointer"
                                                        onClick={() => setSelectedPerson({ id: actor.id, name: actor.name })}
                                                    >
                                                        <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#2a2a2a] mb-2 border-2 border-transparent group-hover:border-[#e50914] transition">
                                                            {actor.profile_path ? (
                                                                <img src={`https://image.tmdb.org/t/p/w185/${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                                                            ) : <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600">👤</div>}
                                                        </div>
                                                        <p className="text-xs font-black text-gray-200 leading-tight line-clamp-1 group-hover:text-[#e50914] transition">{actor.name}</p>
                                                        <p className="text-[10px] text-gray-500 line-clamp-1 italic">{actor.character}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-600 text-center py-10">Cast information not available.</p>
                                )}
                            </div>
                        )}

                        {/* SIMILAR TAB */}
                        {activeTab === "similar" && (
                            <div>
                                {similar.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {similar.map((item) => (
                                            <div key={item.id} className="group relative rounded-lg overflow-hidden bg-[#222] border border-white/5 cursor-pointer hover:border-white/20 transition">
                                                <div className="aspect-video overflow-hidden">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
                                                        alt={item.title || item.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                </div>
                                                <div className="p-2.5">
                                                    <p className="text-xs font-black text-gray-200 line-clamp-1">{item.title || item.name}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                                                        <span className="text-yellow-400 flex items-center gap-0.5"><Star size={9} fill="currentColor" />{item.vote_average?.toFixed(1)}</span>
                                                        <span>{item.release_date?.split("-")[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-center py-10">No similar titles found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Person detail modal — stacks on top */}
            {selectedPerson && (
                <PersonModal
                    personId={selectedPerson.id}
                    personName={selectedPerson.name}
                    onClose={() => setSelectedPerson(null)}
                />
            )}
        </>
    );
};

const ProviderLogo = ({ provider, link }) => (
    <a
        href={link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        title={provider.provider_name}
        className="group flex flex-col items-center gap-1.5"
    >
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/40 transition shadow-md">
            <img
                src={`https://image.tmdb.org/t/p/w92/${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-full h-full object-cover"
            />
        </div>
        <span className="text-[9px] text-gray-600 group-hover:text-gray-300 transition text-center w-12 line-clamp-2 leading-tight">
            {provider.provider_name}
        </span>
    </a>
);

export default MovieModal;
