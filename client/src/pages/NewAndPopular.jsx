import React from "react";
import Row from "../components/Row";
import requests from "../requests";
import Banner from "../components/Banner";

const NewAndPopular = () => {
    return (
        <div className="bg-[#141414] min-h-screen">
            <Banner requestURL={requests.requestTrending} />

            <div className="relative -mt-20 pb-16 space-y-6 z-10">
                <div className="px-4 md:px-12 pt-4">
                    <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-widest mb-1">
                        New &amp; Popular
                    </h1>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Trending this week</p>
                </div>

                <Row title="🔥 Trending Now" fetchURL={requests.requestTrending} rowID="trending" />
                <Row title="🎬 Trending Movies" fetchURL={requests.requestTrendingMovies} rowID="trendmovies" />
                <Row title="📺 Trending TV" fetchURL={requests.requestTrendingTV} rowID="trendtv" />
                <Row title="🎞️ Now Playing" fetchURL={requests.requestNowPlaying} rowID="nowplaying" />
                <Row title="📅 Upcoming Releases" fetchURL={requests.requestUpcoming} rowID="upcoming2" />
            </div>
        </div>
    );
};

export default NewAndPopular;
