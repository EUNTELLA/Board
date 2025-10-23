import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help you search the board. What are you looking for?',
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
          conversation_history: messages.slice(-6), // 최근 메세지 6개만 전송
        }),
      });

      if (!response.ok) {
        throw new Error('An error occurred with the API server.');
      }

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.message,
        posts: data.posts || null, // 검색 결과 게시글 배열
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, an error occurred while communicating with the server.',
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

  // 검색 결과 표시
  // 조회수 , 댓글 수 , 작성일을 포함한 게시글 카드
  return (
    <div className="fixed bottom-[100px] right-8 w-[400px] h-[600px] z-[1000] flex flex-col bg-gray-800 border border-emerald-500 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden animate-slideUp">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white p-5 text-center border-b border-emerald-500">
        <h3 className="m-0 mb-2 text-xl">AI Search Assistant</h3>
        <p className="m-0 opacity-90 text-[13px]">Search posts with natural language</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#1A1A2E]">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-5 animate-fadeIn">
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 bg-[#2c3a4e]">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-[#2c3a4e] text-gray-200'} px-3.5 py-2.5 rounded-xl break-words`}>
                <p className="m-0 leading-relaxed">{msg.content}</p>
                {msg.posts && msg.posts.length > 0 && (
                  <div className="mt-3 flex flex-col gap-2.5">
                    {msg.posts.map((post) => (
                      <div key={post._id} className="bg-[#2c3a4e] border border-gray-600 rounded-lg p-3">
                        <h4 className="m-0 mb-2 text-sm text-gray-200">{post.title}</h4>
                        <div className="flex gap-3 text-xs text-gray-400 mb-2">
                          <span>👁️ {post.views || 0}</span>
                          <span>💬 {post.comments ? post.comments.length : 0}</span>
                          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <a
                          href={`/posts/${post._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-green-400 no-underline font-medium text-[13px] mt-2"
                        >
                          View Details →
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
          <div className="mb-5 animate-fadeIn">
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 bg-[#2c3a4e]">🤖</div>
              <div className="bg-[#2c3a4e] text-gray-200 px-3.5 py-2.5 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 p-3 bg-[#1A1A2E] border-t border-emerald-500">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., Show me recent React posts"
          disabled={loading}
          className="flex-1 py-2.5 px-3.5 border-2 border-gray-600 rounded-[20px] text-sm outline-none bg-[#2c3a4e] text-gray-200 placeholder:text-gray-500 focus:border-green-400"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="py-2.5 px-5 bg-green-400 text-[#1A1A2E] border-none rounded-[20px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>

      {/* Examples */}
      <div className="p-3 bg-gray-800 border-t border-gray-600">
        <p className="m-0 mb-2 text-xs text-gray-400">💡 Try asking:</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleExampleClick('Show me recent posts')}
            className="py-1 px-2.5 bg-[#2c3a4e] border border-gray-600 text-gray-200 rounded-2xl text-xs cursor-pointer hover:bg-green-400 hover:text-[#1A1A2E] hover:border-green-400 transition-colors"
          >
            Recent
          </button>
          <button
            onClick={() => handleExampleClick('Popular posts')}
            className="py-1 px-2.5 bg-[#2c3a4e] border border-gray-600 text-gray-200 rounded-2xl text-xs cursor-pointer hover:bg-green-400 hover:text-[#1A1A2E] hover:border-green-400 transition-colors"
          >
            Popular
          </button>
          <button
            onClick={() => handleExampleClick('Find React posts')}
            className="py-1 px-2.5 bg-[#2c3a4e] border border-gray-600 text-gray-200 rounded-2xl text-xs cursor-pointer hover:bg-green-400 hover:text-[#1A1A2E] hover:border-green-400 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
