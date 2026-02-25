import React from "react";
import Row from "../components/Row";
import requests from "../requests";
import Banner from "../components/Banner";

const TVShows = () => {
    return (
        <div className="bg-[#141414] min-h-screen">
            <Banner requestURL={requests.requestTVPopular} isTV />

            <div className="relative -mt-20 pb-16 space-y-6 z-10">
                <div className="px-4 md:px-12 pt-4">
                    <h1 className="text-white text-2xl md:text-4xl font-black uppercase tracking-widest mb-1">
                        TV Shows
                    </h1>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Series & Episodes</p>
                </div>

                <Row title="🔴 Airing Today" fetchURL={requests.requestTVAiringToday} rowID="airing" />
                <Row title="📡 On The Air" fetchURL={requests.requestTVOnAir} rowID="onair" />
                <Row title="🌟 Popular Shows" fetchURL={requests.requestTVPopular} rowID="tvpopular" />
                <Row title="⭐ Top Rated Shows" fetchURL={requests.requestTVTopRated} rowID="tvtop" />
                <Row title="🎭 Drama Series" fetchURL={requests.requestTVDrama} rowID="tvdrama" />
                <Row title="🔍 Crime & Mystery" fetchURL={requests.requestTVCrime} rowID="tvcrime" />
            </div>
        </div>
    );
};

export default TVShows;
