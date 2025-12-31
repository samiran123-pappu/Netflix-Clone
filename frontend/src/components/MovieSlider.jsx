import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMAGE_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";


const MovieSlider = ({ category }) => {
    const { contentType } = useContentStore();
    const [content, setContent] = useState([]); // Better: initialize as empty array
    const [loading, setLoading] = useState(true); // Optional: explicit loading state
    const [showArrows, setShowArrows] = useState(false);
    const sliderRef = useRef(null);



    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
        }
    };
    const scrollRight = () => {
        sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    };



    // const scrollLeft = () => {
    //     document.querySelector('.flex.space-x-4.overflow-x-scroll').scrollBy({
    //         left: -300,
    //         behavior: 'smooth'
    //     });
    // }
    // const scrollRight = () => {
    //     document.querySelector('.flex.space-x-4.overflow-x-scroll').scrollBy({
    //         left: 300,
    //         behavior: 'smooth'
    //     });
    // }

    const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows";
    const formattedCategoryName =
        category.replaceAll("_", " ")[0].toUpperCase() +
        category.replaceAll("_", " ").slice(1);

    useEffect(() => {
        const getContent = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`/api/v1/${contentType}/${category}`);
                setContent(res.data.content || []); // Fallback to empty array if undefined
            } catch (error) {
                console.error("Failed to fetch content:", error);
                setContent([]); // Ensure it's always an array even on error
            } finally {
                setLoading(false);
            }
        };
        getContent();
    }, [contentType, category]);

    // Show loading state while fetching
    if (loading) {
        return (
            <div className="bg-black text-white relative px-5 md:px-20 py-10">
                <h2 className="text-2xl font-bold mb-4">
                    {formattedCategoryName} {formattedContentType}
                </h2>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-black text-white relative px-5 md:px-20 py-10"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            <h2 className="text-2xl font-bold mb-4">
                {formattedCategoryName} {formattedContentType}
            </h2>

            <div ref={sliderRef} className='flex space-x-4  overflow-x-scroll scrollbar-hide'>
                {content.map((item) => (
                    <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
                        <div className='rounded-lg overflow-hidden'>
                            <img
                                src={SMALL_IMAGE_BASE_URL + item.backdrop_path}
                                alt='Movie image'
                                className='transition-transform duration-300 ease-in-out group-hover:scale-125'
                            />
                        </div>
                        <p className='mt-2 text-center'>
                            {item.title || item.name}
                        </p>
                    </Link>
                ))}
            </div>
            {showArrows && (
                <>
                    <button
                        className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollLeft}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
                        onClick={scrollRight}
                    >
                        <ChevronRight size={24} />
                    </button>
                </>

            )}
        </div>
    );
};

export default MovieSlider;