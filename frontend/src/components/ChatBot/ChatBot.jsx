import React, { useState, useRef, useEffect } from 'react';
// CSS 파일 import를 추가합니다. (이전에 인라인 스타일로 작업했기 때문에)
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

  // --- 1. 샘플 데이터와 데모 응답 함수를 모두 삭제합니다. ---
  // const samplePosts = [...];
  // const generateDemoResponse = (...) => { ... };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- 2. sendMessage 함수를 실제 API 호출 로직으로 수정합니다. ---
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input; // 현재 입력값을 변수에 저장
    setInput('');
    setLoading(true);

    try {
      // FastAPI 서버(http://localhost:8000)에 POST 요청을 보냅니다.
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput, // 저장해둔 입력값 사용
          // 대화 기록을 함께 보내 LLM이 문맥을 파악하도록 돕습니다. (최근 6개)
          conversation_history: messages.slice(-6),
        }),
      });

      if (!response.ok) {
        // API 서버에서 에러가 발생한 경우
        throw new Error('API 서버에서 오류가 발생했습니다.');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        posts: data.posts || null, // API 응답에 posts가 있을 경우 함께 저장
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('챗봇 API 호출 오류:', error);
      // 사용자에게 에러 메시지를 보여줍니다.
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

  // --- 3. 인라인 스타일을 CSS 클래스로 변경합니다. ---
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
                      <div key={post.id} className="post-card">
                        <h4>{post.title}</h4>
                        <div className="post-meta">
                          <span>👁️ {post.views || 0}</span>
                          <span>💬 {post.comments || 0}</span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <a href={`/posts/${post.id}`} target="_blank" rel="noopener noreferrer" className="post-link">
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

