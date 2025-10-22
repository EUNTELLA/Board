import React, { useState, useEffect } from 'react';
import './PostForm.css';

// post: 수정할 때 전달받는 기존 글 데이터
// onSubmit: '저장' 버튼 클릭 시 실행될 함수
// onCancel: '취소' 버튼 클릭 시 실행될 함수
// currentUser: 로그인한 사용자 정보
const PostForm = ({ post, onSubmit, onCancel, currentUser }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 수정 모드일 경우, 폼에 기존 게시글 데이터를 채워줍니다.
    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 기본 동작 방지
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        // 로그인한 사용자의 이름을 author로 사용
        onSubmit({
            title,
            content,
            author: currentUser?.username || currentUser?.email || 'Anonymous'
        });
    };

    return (
        <div className="post-form-container">
            <h2>{post ? '게시글 수정' : '새 글 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        rows="10"
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="cancel-button">취소</button>
                    <button type="submit" className="submit-button">저장</button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
