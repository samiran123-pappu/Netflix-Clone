import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Info, Play } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { LARGE_IMAGE_BASE_URL, MOVIE_CATEGORIES, TV_CATEGORIES } from "../../utils/constants.js";
import { useContentStore } from "../../store/content.js";
import MovieSlider from "../../components/MovieSlider.jsx";
import { useState } from "react";

const HomeScreen = () => {
    const { trendingContent } = useGetTrendingContent();

    const { contentType } = useContentStore();
    // Optional: Add loading state if trendingContent is null/undefined
    const [imageLoading, setImageLoading] = useState(true);

    if (!trendingContent)
        return (
            <div className='h-screen text-white relative'>
                <Navbar />
                <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer' />
            </div>
        );
    return (
        <>
            <div className="relative h-screen text-white">
                <Navbar />

                {/* Loading spinner */}
                {imageLoading && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center -z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}

                {/* Background Image */}
                <img
                    src={LARGE_IMAGE_BASE_URL + trendingContent?.backdrop_path}
                    alt="Hero image"
                    className="absolute top-0 left-0 w-full h-full object-cover -z-50"
                    onLoad={() => setImageLoading(false)}
                />

                {/* Dark Overlay - allows clicks to pass through */}
                <div
                    className="absolute top-0 left-0 w-full h-full bg-black/50 -z-50 pointer-events-none"
                    aria-hidden="true"
                />

                {/* Gradient Overlay from top - also allows clicks */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent -z-10 pointer-events-none" />

                {/* Content (Title, Description, Buttons) */}
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-32">
                    <div className="max-w-2xl">
                        <h1 className="mt-4 text-6xl font-extrabold text-balance">
                            {trendingContent?.title || trendingContent?.name}
                        </h1>

                        <p className="mt-4 text-lg">
                            {trendingContent?.release_date?.split("-")[0] ||
                                trendingContent?.first_air_date?.split("-")[0]}{" "}
                            | {trendingContent?.adult ? "18+" : "13+"}{" "}
                            | {trendingContent?.media_type === "movie" ? "Movie" : "TV Show"}{" "}
                            | {trendingContent?.vote_average?.toFixed(1)} ⭐
                        </p>

                        <p className="mt-4 text-lg">
                            {trendingContent?.overview?.length > 200
                                ? trendingContent.overview.slice(0, 200) + "..."
                                : trendingContent?.overview}
                        </p>
                    </div>

                    {/* Buttons - Now Fully Clickable */}
                    <div className="flex mt-8 gap-4">
                        <Link
                            to={`/watch/${trendingContent?.id}`}
                            className="bg-white hover:bg-white/80 text-black font-bold py-3 px-6 rounded flex items-center transition"
                        >
                            <Play className="size-6 mr-2 fill-black" />
                            Play
                        </Link>
                        <Link
                            to={`/watch/${trendingContent?.id}`}
                            className="bg-gray-500/70 hover:bg-gray-500/90 text-white font-bold py-3 px-6 rounded flex items-center transition"
                        >
                            <Info className="size-6 mr-2" />
                            More Info
                        </Link>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-10 bg-black py-10'>
                {contentType === "movie"
                    ? MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)
                    : TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}
            </div>
        </>
    );
};

export default HomeScreen;