import { useState } from "react";
import { useContentStore } from "../store/content";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { LARGE_IMAGE_BASE_URL } from "../utils/constants";

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState("movie");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const [results, setResults] = useState([]);
    const { setContentType } = useContentStore();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        tab === "movie" ? setContentType("movie") : setContentType("tv");
        setResults([]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.error("Please enter a search term");
            return;
        }
        try {
            const endpoint = activeTab === "movie" ? "movie" : activeTab === "tv" ? "tv" : "person";
            const res = await axios.get(`/api/v1/search/${endpoint}/${searchTerm}`);
            console.log("Search response:", res.data);
            setResults(res.data.data || res.data.content || []);
            // Add to search history if not already there
            if (!searchHistory.includes(searchTerm)) {
                setSearchHistory([searchTerm, ...searchHistory.slice(0, 9)]);
            }
            toast.success("Search completed");
        } catch (error) {
            console.error("Search error:", error);
            if (error.response?.status === 404) {
                toast.error("Nothing found, make sure you are searching under the right category");
                setResults([]);
            } else {
                toast.error("An error occurred, please try again later");
            }
        }
    };

    const handleSearchFromHistory = (term) => {
        setSearchTerm(term);
        // Trigger search with the selected term
        setTimeout(() => {
            const formElement = document.querySelector("form");
            if (formElement) formElement.dispatchEvent(new Event("submit", { bubbles: true }));
        }, 0);
    };

    const clearSearchHistory = () => {
        setSearchHistory([]);
        toast.success("Search history cleared");
    };

    return (
        <div className='bg-black min-h-screen text-white'>
            <Navbar />
            <div className='container mx-auto px-4 py-8'>
                <div className='flex justify-center gap-3 mb-4'>
                    <button
                        className={`py-2 px-4 rounded ${activeTab === "movie" ? "bg-red-600" : "bg-gray-800"
                            } hover:bg-red-700`}
                        onClick={() => handleTabClick("movie")}
                    >
                        Movies
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${activeTab === "tv" ? "bg-red-600" : "bg-gray-800"
                            } hover:bg-red-700`}
                        onClick={() => handleTabClick("tv")}
                    >
                        TV Shows
                    </button>
                    <button
                        className={`py-2 px-4 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-800"
                            } hover:bg-red-700`}
                        onClick={() => handleTabClick("person")}
                    >
                        Person
                    </button>
                </div>

                <form className='flex gap-2 items-stretch mb-8 max-w-2xl mx-auto' onSubmit={handleSearch}>
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={"Search for a " + activeTab}
                        className='w-full p-2 rounded bg-gray-800 text-white'
                    />
                    <button type='submit' className='bg-red-600 hover:bg-red-700 text-white p-2 rounded'>
                        <Search className='size-6' />
                    </button>
                </form>

                {searchHistory.length > 0 && (
                    <div className='mb-6 max-w-2xl mx-auto'>
                        <div className='flex justify-between items-center mb-3'>
                            <h3 className='text-lg font-semibold'>Search History</h3>
                            <button
                                onClick={clearSearchHistory}
                                className='text-sm text-red-400 hover:text-red-300'
                            >
                                Clear History
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {searchHistory.map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSearchFromHistory(term)}
                                    className='bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm'
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {results && results.length > 0 ? (
                        results.map((result) => {
                            if (!result.poster_path && !result.profile_path) return null;
                            const imagePath = activeTab === "person" ? result.profile_path : result.poster_path;
                            const title = result.title || result.name;

                            return (
                                <div key={result.id} className='bg-gray-800 p-4 rounded hover:scale-105 transition-transform'>
                                    {activeTab === "person" ? (
                                        <div className='flex flex-col items-center'>
                                            {imagePath && (
                                                <img
                                                    src={LARGE_IMAGE_BASE_URL + imagePath}
                                                    alt={title}
                                                    className='max-h-96 rounded mx-auto w-full object-cover'
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                                                    }}
                                                />
                                            )}
                                            <h2 className='mt-2 text-xl font-bold text-center'>{title}</h2>
                                        </div>
                                    ) : (
                                        <Link
                                            to={"/watch/" + result.id}
                                            onClick={() => {
                                                setContentType(activeTab);
                                            }}
                                        >
                                            {imagePath && (
                                                <img
                                                    src={LARGE_IMAGE_BASE_URL + imagePath}
                                                    alt={title}
                                                    className='w-full h-auto rounded object-cover'
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
                                                    }}
                                                />
                                            )}
                                            <h2 className='mt-2 text-xl font-bold'>{title}</h2>
                                        </Link>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className='col-span-full text-center py-12'>
                            <p className='text-gray-400 text-lg'>No results found. Try searching for something!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default SearchPage;