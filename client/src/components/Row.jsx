import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import Movie from "./Movie";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Row = ({ title, fetchURL, rowID }) => {
    const [movies, setMovies] = useState([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [hoverArrow, setHoverArrow] = useState(null);
    const sliderRef = useRef(null);

    useEffect(() => {
        axios.get(fetchURL).then((res) => {
            setMovies(res.data.results || []);
        }).catch(() => { });
    }, [fetchURL]);

    const updateScroll = () => {
        const el = sliderRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };

    const slide = (dir) => {
        const el = sliderRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75, behavior: "smooth" });
        setTimeout(updateScroll, 450);
    };

    return (
        <div className="py-3 group/row" style={{ overflow: "visible" }}>
            {/* ── Row Title ── */}
            <h2 className="text-white text-sm md:text-base font-black uppercase tracking-[0.15em] mb-3 px-3 md:px-12 flex items-center gap-1.5 cursor-default">
                <span className="inline-block w-1 h-4 bg-[#e50914] rounded-full" />
                {title}
            </h2>

            {/* ── Slider Rail ── */}
            <div className="relative" style={{ overflow: "visible" }}>
                {/* Left Arrow — always visible on mobile, hover-revealed on desktop */}
                {canScrollLeft && (
                    <button
                        onClick={() => slide("left")}
                        onMouseEnter={() => setHoverArrow("left")}
                        onMouseLeave={() => setHoverArrow(null)}
                        aria-label="Scroll left"
                        className="absolute left-0 top-0 h-full z-30 flex items-center justify-center transition-all duration-200 row-arrow"
                        style={{
                            width: "40px",
                            background: hoverArrow === "left"
                                ? "linear-gradient(to right, rgba(0,0,0,0.92), rgba(0,0,0,0.5) 80%, transparent)"
                                : "linear-gradient(to right, rgba(0,0,0,0.7), transparent)",
                        }}
                    >
                        <div
                            className="flex items-center justify-center transition-all duration-200"
                            style={{ transform: hoverArrow === "left" ? "scale(1.15)" : "scale(1)" }}
                        >
                            <ChevronLeft
                                size={hoverArrow === "left" ? 32 : 22}
                                className="text-white drop-shadow-lg"
                                strokeWidth={2.5}
                            />
                        </div>
                    </button>
                )}

                {/* Cards — touch-scroll enabled */}
                <div
                    ref={sliderRef}
                    onScroll={updateScroll}
                    className="flex gap-2 px-3 md:px-12"
                    style={{
                        overflowX: "auto",
                        overflowY: "visible",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        paddingBottom: "24px",
                        marginBottom: "-24px",
                        paddingTop: "12px",
                        marginTop: "-12px",
                    }}
                >
                    {movies.map((item, idx) => (
                        <Movie key={`${item.id}-${idx}`} item={item} />
                    ))}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                    <button
                        onClick={() => slide("right")}
                        onMouseEnter={() => setHoverArrow("right")}
                        onMouseLeave={() => setHoverArrow(null)}
                        aria-label="Scroll right"
                        className="absolute right-0 top-0 h-full z-30 flex items-center justify-center transition-all duration-200 row-arrow"
                        style={{
                            width: "40px",
                            background: hoverArrow === "right"
                                ? "linear-gradient(to left, rgba(0,0,0,0.92), rgba(0,0,0,0.5) 80%, transparent)"
                                : "linear-gradient(to left, rgba(0,0,0,0.7), transparent)",
                        }}
                    >
                        <div
                            className="flex items-center justify-center transition-all duration-200"
                            style={{ transform: hoverArrow === "right" ? "scale(1.15)" : "scale(1)" }}
                        >
                            <ChevronRight
                                size={hoverArrow === "right" ? 32 : 22}
                                className="text-white drop-shadow-lg"
                                strokeWidth={2.5}
                            />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Row;
