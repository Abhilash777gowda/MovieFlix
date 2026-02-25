import React from "react";
import Row from "../components/Row";
import requests from "../requests";
import Banner from "../components/Banner";

const Movies = () => {
    return (
        <div className="bg-[#141414] min-h-screen">
            {/* Reuse banner with a movie-only category */}
            <Banner requestURL={requests.requestAction} />

            <div className="relative -mt-20 pb-16 space-y-6 z-10">
                <div className="px-4 md:px-12 pt-4">
                    <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-widest mb-1">
                        Movies
                    </h1>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Browse all films</p>
                </div>

                <Row title="🔥 Action" fetchURL={requests.requestAction} rowID="action" />
                <Row title="😂 Comedy" fetchURL={requests.requestComedy} rowID="comedy" />
                <Row title="🎭 Drama" fetchURL={requests.requestDrama} rowID="drama" />
                <Row title="🚀 Sci-Fi" fetchURL={requests.requestSciFi} rowID="scifi" />
                <Row title="🎬 Animation" fetchURL={requests.requestAnimation} rowID="animation" />
                <Row title="😱 Horror" fetchURL={requests.requestHorror} rowID="horror" />
                <Row title="😰 Thriller" fetchURL={requests.requestThriller} rowID="thriller" />
                <Row title="⭐ Top Rated" fetchURL={requests.requestTopRated} rowID="toprated" />
                <Row title="🍿 Popular" fetchURL={requests.requestPopular} rowID="popular" />
                <Row title="📅 Upcoming" fetchURL={requests.requestUpcoming} rowID="upcoming" />
            </div>
        </div>
    );
};

export default Movies;
