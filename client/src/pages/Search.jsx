import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search as SearchIcon, Film, Tv, X } from "lucide-react";
import Movie from "../components/Movie";

const API_KEY = "92b44f51a2134bda7e85c0ff1a41de6b";

const useDebounce = (value, delay) => {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
};

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    // Always read query from URL — this is the source of truth
    const query = searchParams.get("q") || "";

    const [localQuery, setLocalQuery] = useState(query);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");

    const debouncedLocal = useDebounce(localQuery, 350);

    // Sync URL when user types in the page's own input
    useEffect(() => {
        if (debouncedLocal.trim()) {
            setSearchParams({ q: debouncedLocal.trim() }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
    }, [debouncedLocal]);

    // Sync local input when URL query changes (e.g. user navigated here from Navbar)
    useEffect(() => {
        setLocalQuery(query);
    }, [query]);

    // Fetch results whenever URL query changes — parallel across all major languages
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }
        setLoading(true);

        // Search in parallel across English + major Indian languages
        const LANGUAGES = ["en-US", "hi-IN", "te-IN", "ta-IN", "kn-IN", "ml-IN", "bn-IN"];
        const encoded = encodeURIComponent(query);

        Promise.all(
            LANGUAGES.map((lang) =>
                axios
                    .get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encoded}&language=${lang}&page=1&include_adult=false`)
                    .then((r) => r.data.results || [])
                    .catch(() => [])
            )
        )
            .then((allResults) => {
                // Flatten and deduplicate by id
                const seen = new Set();
                const merged = allResults.flat().filter((r) => {
                    if (r.media_type === "person") return false;
                    if (!r.backdrop_path && !r.poster_path) return false;
                    if (seen.has(r.id)) return false;
                    seen.add(r.id);
                    return true;
                });
                // Sort by popularity descending
                merged.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                setResults(merged);
            })
            .finally(() => setLoading(false));
    }, [query]);


    const displayed =
        filter === "all"
            ? results
            : results.filter((r) => r.media_type === filter);

    return (
        <div className="min-h-screen bg-[#141414] pt-24 pb-16 px-4 md:px-12">
            {/* ── Search Input ── */}
            <div className="max-w-2xl mx-auto mb-10">
                <div className="relative flex items-center bg-[#1c1c1c] border border-white/10 rounded-lg overflow-hidden focus-within:border-white/30 transition-all">
                    <SearchIcon size={20} className="ml-4 text-gray-500 flex-shrink-0" />
                    <input
                        autoFocus
                        type="text"
                        value={localQuery}
                        onChange={(e) => setLocalQuery(e.target.value)}
                        placeholder="Search movies, TV shows…"
                        className="flex-1 bg-transparent text-white px-4 py-4 text-lg placeholder-gray-600 outline-none"
                    />
                    {localQuery && (
                        <button
                            onClick={() => { setLocalQuery(""); setResults([]); navigate("/search"); }}
                            className="mr-4 text-gray-500 hover:text-white transition"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Filter Tabs ── */}
            {results.length > 0 && (
                <div className="flex items-center gap-3 mb-8 justify-center">
                    {[
                        { key: "all", label: "All" },
                        { key: "movie", label: "Movies", icon: <Film size={14} /> },
                        { key: "tv", label: "TV Shows", icon: <Tv size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all"
                            style={{
                                backgroundColor: filter === tab.key ? "#e50914" : "rgba(255,255,255,0.08)",
                                color: filter === tab.key ? "white" : "#aaa",
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            <span className="ml-1 text-xs opacity-70">
                                ({tab.key === "all" ? results.length : results.filter((r) => r.media_type === tab.key).length})
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* ── Empty / idle state ── */}
            {!query && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-4">
                    <SearchIcon size={64} strokeWidth={1} />
                    <p className="text-xl font-black uppercase tracking-widest">Find your next watch</p>
                    <p className="text-sm text-gray-700">Search for movies and TV shows above</p>
                </div>
            )}

            {/* ── Loading skeleton ── */}
            {query && loading && (
                <div
                    className="grid gap-3"
                    style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(145px,16vw,240px),1fr))" }}
                >
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="aspect-video bg-white/5 rounded-md animate-pulse" />
                    ))}
                </div>
            )}

            {/* ── No results ── */}
            {query && !loading && displayed.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-3">
                    <p className="text-xl font-black uppercase tracking-widest">No results</p>
                    <p className="text-sm text-gray-700">
                        Nothing found for <span className="text-white">"{query}"</span>. Try another title.
                    </p>
                </div>
            )}

            {/* ── Results grid ── */}
            {!loading && displayed.length > 0 && (
                <>
                    <p className="text-gray-500 text-sm mb-5 text-center">
                        {displayed.length} result{displayed.length !== 1 ? "s" : ""} for{" "}
                        <span className="text-white font-bold">"{query}"</span>
                    </p>
                    <div
                        className="grid gap-3 sm:gap-4 lg:gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(clamp(140px,40vw,280px),1fr))" }}
                    >
                        {displayed.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="relative">
                                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/70 backdrop-blur-sm text-gray-300">
                                    {item.media_type === "tv" ? <Tv size={10} /> : <Film size={10} />}
                                    {item.media_type === "tv" ? "TV" : "Movie"}
                                </div>
                                <Movie item={item} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Search;
