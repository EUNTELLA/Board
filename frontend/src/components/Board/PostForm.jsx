import React, { useState, useEffect } from 'react';
import './PostForm.css';

const PostForm = ({ post, onSubmit, onCancel, currentUser }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) {
            alert('Please enter both title and content.');
            return;
        }
        onSubmit({
            title,
            content,
            author: currentUser?.username || currentUser?.email || 'Anonymous'
        });
    };

    return (
        <div className="post-form-container">
            <h2>{post ? 'Edit Post' : 'New Post'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter content"
                        rows="10"
                    />
                </div>
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
                    <button type="submit" className="submit-button">Save</button>
                </div>
            </form>
        </div>
    );
};

export default PostForm;
