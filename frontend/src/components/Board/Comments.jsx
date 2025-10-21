import React, { useState } from 'react';
import './Comments.css';

const Comments = ({ comments, onCommentSubmit }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }
        onCommentSubmit({ author: '익명', content });
        setContent('');
    };

    return (
        <div className="comments-section">
            <h3>댓글 ({comments ? comments.length : 0})</h3>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="따뜻한 댓글을 남겨주세요."
                    rows="3"
                />
                <button type="submit">등록</button>
            </form>

            <ul className="comment-list">
                {/* comments가 존재하고, 0개 이상일 때만 목록을 렌더링합니다. */}
                {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <li key={comment._id || index} className="comment-item">
                            {/* comment 객체 자체가 아닌, 그 안의 속성을 명시적으로 렌더링합니다. */}
                            <div className="comment-author">{comment.author}</div>
                            <p className="comment-content">{comment.content}</p>
                            <div className="comment-date">{new Date(comment.createdAt).toLocaleString()}</div>
                        </li>
                    ))
                ) : (
                    <p className="no-comments">아직 댓글이 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default Comments;

