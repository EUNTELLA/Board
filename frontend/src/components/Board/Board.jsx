import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './Board.css';

const Board = ({ onPostClick, onNewPostClick, refreshKey }) => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/posts?page=${currentPage}`);
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
        // [수정] refreshKey가 바뀔 때마다 fetchPosts 함수를 다시 호출하여 목록을 새로고침합니다.
    }, [currentPage, refreshKey]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    if (isLoading) {
        return <div className="board-container"><h2>게시글을 불러오는 중...</h2></div>;
    }

    return (
        <div className="board-container">
            <div className="board-header">
                <h2>최신 게시글</h2>
                <button onClick={onNewPostClick} className="new-post-button">새 글 작성</button>
            </div>
            <ul className="post-list">
                {posts.map(post => (
                    <li key={post._id} className="post-item">
                        <span className="post-title" onClick={() => onPostClick(post._id)}>
                            {post.title}
                        </span>
                        <span className="post-author">{post.author}</span>
                        <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
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

