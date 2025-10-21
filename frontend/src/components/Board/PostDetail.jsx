import React, { useState, useEffect } from 'react';
import Comments from './Comments';
import './PostDetail.css';

const PostDetail = ({ postId, onBackToList, onEdit, onDelete }) => {
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPost = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}`);
            if (!response.ok) throw new Error('데이터 로딩 실패');
            const data = await response.json();
            setPost(data);
        } catch (error) {
            console.error('상세 정보 로딩 오류:', error);
            alert('게시글 정보를 불러올 수 없습니다.');
            onBackToList();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (postId) fetchPost();
    }, [postId]);

    const handleCommentSubmit = async (commentData) => {
        try {
            const response = await fetch(`http://localhost:3001/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentData),
            });
            if (!response.ok) throw new Error('댓글 작성 실패');
            fetchPost();
        } catch (error) {
            console.error('댓글 작성 오류:', error);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    if (isLoading) {
        return <div className="post-detail-container"><h2>로딩 중...</h2></div>;
    }
    if (!post) {
        return <div className="post-detail-container"><h2>게시글을 찾을 수 없습니다.</h2></div>;
    }

    return (
        <div className="post-detail-container">
            <button onClick={onBackToList} className="back-button">← 목록으로</button>
            <div className="post-header">
                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span>작성자: {post.author}</span>
                    <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <div className="post-actions">
                <button onClick={() => onEdit(post)} className="action-button edit-button">수정</button>
                <button onClick={() => onDelete(post._id)} className="action-button delete-button">삭제</button>
            </div>


            <Comments comments={post.comments} onCommentSubmit={handleCommentSubmit} />
        </div>
    );
};

export default PostDetail;

