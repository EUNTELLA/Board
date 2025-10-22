import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './Board.css';

const Board = ({ onPostClick, onNewPostClick, refreshKey }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchInput, setSearchInput] = useState(''); // 입력 중인 검색어

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                let url = `http://localhost:3001/posts?page=${currentPage}`;
                if (searchKeyword) {
                    url += `&search=${encodeURIComponent(searchKeyword)}`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('데이터를 불러오는 데 실패했습니다.');
                const data = await response.json();
                setPosts(data.posts);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error('게시글 목록 로딩 실패:', error);
                alert('게시글 목록을 불러올 수 없습니다.');
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
        setSearchKeyword(searchInput); // 입력한 값을 실제 검색어로 설정
        setCurrentPage(1); // 검색 시 첫 페이지로 이동
    };

    const handleSearchClear = () => {
        setSearchInput('');
        setSearchKeyword('');
        setCurrentPage(1);
    };

    if (isLoading) {
        return <div className="board-container"><h2>게시글을 불러오는 중...</h2></div>;
    }

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>게시글</h2>
                <button onClick={onNewPostClick} className="new-post-button">새 글 작성</button>
            </div>

            <div className="search-section">
                <h3>게시글 검색</h3>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="제목이나 내용으로 검색..."
                        className="search-input"
                    />
                    <button type="submit" className="search-button">검색</button>
                    {searchKeyword && (
                        <button type="button" onClick={handleSearchClear} className="clear-button">
                            초기화
                        </button>
                    )}
                </form>
            </div>

            <ul className="post-list">
                {posts.length === 0 ? (
                    <li className="no-posts">검색 결과가 없습니다.</li>
                ) : (
                    posts.map(post => (
                        <li key={post._id} className="post-item">
                            <span className="post-title" onClick={() => onPostClick(post._id)}>
                                {post.title}
                            </span>
                            <span className="post-author">{post.author}</span>
                            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
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

