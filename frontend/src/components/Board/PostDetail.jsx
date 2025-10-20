import React, { useState, useEffect } from 'react';
import './PostDetail.css';


const PostDetail = ({ postId, onBackToList, onEdit, onDelete }) => {
    const [post, setPost] = useState(null);

    useEffect(() => {
        setPost({
            id: postId,
            title: `게시글 ${postId} 제목`,
            author: '테스트 작성자',
            createdAt: new Date().toISOString(),
            content: `이것은 게시글 ${postId}의 상세 내용입니다. 이 부분은 나중에 실제 API에서 받아온 데이터로 채워집니다.`
        });
    }, [postId]);

    if (!post) {
        return <div>로딩 중...</div>;
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
                <button onClick={() => onDelete(post.id)} className="action-button delete-button">삭제</button>
            </div>
        </div>
    );
};

export default PostDetail;

