import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '안녕하세요! 게시판 검색을 도와드릴게요. 무엇을 찾으시나요?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversation_history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        throw new Error('API 서버에서 오류가 발생했습니다.');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        posts: data.posts || null,
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('챗봇 API 호출 오류:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '죄송합니다. 서버와 통신하는 중 오류가 발생했습니다.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleExampleClick = (text) => {
    setInput(text);
  };

  return (
    <div className="chatbot-popup-container">
      <div className="chatbot-header">
        <h3>AI 검색 도우미</h3>
        <p>게시글을 자연어로 검색해보세요</p>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-text">
                <p>{msg.content}</p>
                {msg.posts && msg.posts.length > 0 && (
                  <div className="post-results">
                    {msg.posts.map((post) => (

                      <div key={post._id} className="post-card">
                        <h4>{post.title}</h4>
                        <div className="post-meta">
                          <span>👁️ {post.views || 0}</span>

                          <span>💬 {post.comments ? post.comments.length : 0}</span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>

                        <a href={`/posts/${post._id}`} target="_blank" rel="noopener noreferrer" className="post-link">
                          자세히 보기 →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              <div className="message-avatar">🤖</div>
              <div className="message-text">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="예: 최근 React 관련 글 보여줘"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? '...' : '전송'}
        </button>
      </div>

      <div className="chatbot-examples">
        <p>💡 이렇게 물어보세요:</p>
        <div className="example-buttons">
          <button onClick={() => handleExampleClick('최근 작성된 글 보여줘')}>최근 글</button>
          <button onClick={() => handleExampleClick('인기있는 게시글 추천해줘')}>인기 글</button>
          <button onClick={() => handleExampleClick('React 관련 글 찾아줘')}>주제 검색</button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

