import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './Board.css';

const Board = ({ onPostClick, onNewPostClick }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const sampleData = {
            posts: Array.from({ length: 53 }, (_, i) => ({ id: 53 - i, title: `페이지네이션 테스트 게시글 ${53 - i}`, author: `작성자${i + 1}`, date: `2025-10-19` })),
            totalPages: 6,
        };
        const postsPerPage = 10;
        const startIndex = (currentPage - 1) * postsPerPage;
        setPosts(sampleData.posts.slice(startIndex, startIndex + postsPerPage));
        setTotalPages(sampleData.totalPages);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>최신 게시글</h2>
                <button onClick={onNewPostClick} className="new-post-button">새 글 작성</button>
            </div>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post.id} className="post-item">
                        <span className="post-title" onClick={() => onPostClick(post.id)}>
                            {post.title}
                        </span>
                        <span className="post-author">{post.author}</span>
                        <span className="post-date">{post.date}</span>
                    </li>
                ))}
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

