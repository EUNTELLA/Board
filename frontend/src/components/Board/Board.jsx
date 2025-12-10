import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

const Board = ({ onPostClick, onNewPostClick, refreshKey }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                let url = `http://localhost:3001/posts?page=${currentPage}`;
                if (searchKeyword) {
                    url += `&search=${encodeURIComponent(searchKeyword)}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to load data.');

                const data = await response.json();
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('Failed to load posts:', error);
                alert('Unable to load posts.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [currentPage, refreshKey, searchKeyword]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput);
        setCurrentPage(1);
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setSearchKeyword('');
        setCurrentPage(1);
    };

    if (isLoading) {
        return (
            <div className="max-w-[1000px] my-10 mx-auto p-10 bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] rounded-[30px] shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 animate-float">
                <h2>Loading posts...</h2>
            </div>
        );
    }

    return (
        <div className="max-w-[1000px] my-10 mx-auto p-10 bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] rounded-[30px] shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 animate-float">
            <div className="flex justify-between items-center border-b-2 border-white/20 pb-6 mb-8">
                <h2 className="m-0 text-[32px] font-black bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent tracking-tight">
                    Posts
                </h2>
                <button
                    onClick={onNewPostClick}
                    className="border-none py-3.5 px-8 rounded-full text-[15px] font-bold cursor-pointer bg-gradient-to-r from-pink-300 to-red-400 text-white transition-all duration-500 shadow-[0_10px_30px_rgba(245,87,108,0.5)] relative overflow-hidden uppercase tracking-wide before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_40px_rgba(245,87,108,0.7)]"
                >
                    New Post
                </button>
            </div>

            <div className="mb-9 p-6 bg-white/10 backdrop-blur-[10px] rounded-[20px] border border-white/15 shadow-[0_8px_32px_rgba(31,38,135,0.2)]">
                <h3 className="m-0 mb-5 text-xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                    Search Posts
                </h3>
                <form onSubmit={handleSearch} className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by title or content..."
                        className="flex-1 py-3.5 px-5 border-2 border-white/20 rounded-full text-[15px] transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)]"
                    />
                    <button
                        type="submit"
                        className="py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-full text-[15px] font-bold cursor-pointer transition-all duration-300 shadow-[0_5px_20px_rgba(102,126,234,0.4)] uppercase tracking-wide hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(102,126,234,0.6)]"
                    >
                        Search
                    </button>
                    {searchKeyword && (
                        <button
                            type="button"
                            onClick={handleSearchClear}
                            className="py-3.5 px-7 bg-white/20 text-white border border-white/30 backdrop-blur-[10px] rounded-full text-[15px] font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-white/30 hover:-translate-y-1"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <ul className="list-none p-0">
                {posts.length === 0 ? (
                    <li className="text-center py-16 text-white/70 text-lg font-semibold">
                        검색 결과가 없습니다.
                    </li>
                ) : (
                    posts.map(post => (
                        <li
                            key={post._id}
                            className="flex justify-between items-center py-5 px-4 border-b border-white/10 transition-all duration-300 rounded-2xl mb-1 last:border-b-0 hover:bg-white/15 hover:translate-x-2.5 hover:shadow-[0_5px_20px_rgba(240,147,251,0.3)]"
                        >
                            <span
                                className="font-semibold flex-grow cursor-pointer text-white/95 transition-all duration-300 hover:text-pink-300 hover:drop-shadow-[0_0_15px_rgba(240,147,251,0.8)]"
                                onClick={() => onPostClick(post._id)}
                            >
                                {post.title}
                            </span>
                            <span className="w-[140px] text-center text-white/70 text-sm font-medium">
                                {post.author}
                            </span>
                            <span className="w-[150px] text-right text-white/60 text-[13px]">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                        </li>
                    ))
                )}
            </ul>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Board;
