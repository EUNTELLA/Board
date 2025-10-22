import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import './Board.css';

/**
 * Board Component
 *
 * 게시판 메인 화면을 렌더링하는 컴포넌트
 * 게시글 목록을 표시하고, 검색, 페이지네이션 기능을 제공
 *
 * @param {Function} onPostClick - 게시글 클릭 시 호출되는 콜백 함수 (게시글 ID를 인자로 받음)
 * @param {Function} onNewPostClick - "New Post" 버튼 클릭 시 호출되는 콜백 함수
 * @param {number} refreshKey - 부모 컴포넌트에서 전달받는 키. 값이 변경되면 게시글 목록 재조회
 */
const Board = ({ onPostClick, onNewPostClick, refreshKey }) => {
    // === State 관리 ===
    const [posts, setPosts] = useState([]);                     // 현재 페이지의 게시글 목록
    const [currentPage, setCurrentPage] = useState(1);          // 현재 페이지 번호
    const [totalPages, setTotalPages] = useState(1);            // 전체 페이지 수
    const [isLoading, setIsLoading] = useState(true);           // 로딩 상태
    const [searchKeyword, setSearchKeyword] = useState('');     // 실제 검색에 사용되는 키워드
    const [searchInput, setSearchInput] = useState('');         // 입력 필드의 임시 검색어

    /**
     * useEffect Hook - 게시글 목록 조회
     *
     * 의존성 배열의 값이 변경될 때마다 실행:
     * - currentPage: 페이지 번호 변경 시
     * - refreshKey: 부모에서 새 글 작성/삭제 시 강제 새로고침용
     * - searchKeyword: 검색어 변경 시
     */
    useEffect(() => {

        const fetchPosts = async () => {
            setIsLoading(true);  // 로딩 시작
            try {
                // URL 구성: 기본 URL + 페이지 번호
                let url = `http://localhost:3001/posts?page=${currentPage}`;

                // 검색어가 있으면 쿼리 파라미터 추가
                if (searchKeyword) {
                    url += `&search=${encodeURIComponent(searchKeyword)}`;
                }

                // API 호출
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to load data.');

                // 응답 데이터 파싱 및 상태 업데이트
                const data = await response.json();
                setPosts(data.posts);           // 게시글 목록 설정
                setTotalPages(data.totalPages); // 전체 페이지 수 설정
            } catch (error) {
                console.error('Failed to load posts:', error);
                alert('Unable to load posts.');
            } finally {
                setIsLoading(false);  // 로딩 종료
            }
        };

        fetchPosts();  // 함수 실행

    }, [currentPage, refreshKey, searchKeyword]);  // 의존성 배열

    /**
     * handlePageChange - 페이지 변경 핸들러
     *
     * @param {number} page - 이동할 페이지 번호
     *
     * 동작:
     * 1. currentPage 상태 업데이트 (useEffect가 자동으로 데이터 재조회)
     * 2. 페이지 최상단으로 스크롤
     */
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);  // 페이지 상단으로 스크롤 (사용자 경험 향상)
    };

    /**
     * handleSearch - 검색 폼 제출 핸들러
     *
     * @param {Event} e - 폼 제출 이벤트
     *
     * 동작:
     * 1. 폼 기본 동작 방지 (페이지 새로고침 방지)
     * 2. 입력된 검색어를 실제 검색 키워드로 설정
     * 3. 첫 페이지로 이동 (검색 결과는 항상 1페이지부터)
     */
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchKeyword(searchInput);  // searchInput → searchKeyword (useEffect 트리거)
        setCurrentPage(1);              // 검색 시 첫 페이지로 리셋
    };

    /**
     * handleSearchClear - 검색 초기화 핸들러
     *
     * "Clear" 버튼 클릭 시 모든 검색 관련 상태 초기화
     * 전체 게시글 목록으로 돌아감
     */
    const handleSearchClear = () => {
        setSearchInput('');      // 입력 필드 비우기
        setSearchKeyword('');    // 검색 키워드 제거 (전체 목록 조회)
        setCurrentPage(1);       // 첫 페이지로 이동
    };

    // === 로딩 중일 때 렌더링 ===
    // 데이터를 불러오는 동안 로딩 메시지 표시
    if (isLoading) {
        return <div className="board-container"><h2>Loading posts...</h2></div>;
    }

    // === 메인 UI 렌더링 ===
    return (
        <div className="board-container">
            {/* 게시판 헤더: 타이틀 + 새 글 작성 버튼 */}
            <div className="board-header">
                <h2>Posts</h2>
                <button onClick={onNewPostClick} className="new-post-button">New Post</button>
            </div>

            {/* 검색 섹션 */}
            <div className="search-section">
                <h3>Search Posts</h3>
                <form onSubmit={handleSearch} className="search-form">
                    {/* 검색어 입력 필드 */}
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by title or content..."
                        className="search-input"
                    />
                    {/* 검색 버튼 */}
                    <button type="submit" className="search-button">Search</button>
                    {/* 검색어가 있을 때만 Clear 버튼 표시 */}
                    {searchKeyword && (
                        <button type="button" onClick={handleSearchClear} className="clear-button">
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {/* 게시글 목록 */}
            <ul className="post-list">
                {posts.length === 0 ? (
                    // 게시글이 없을 때
                    <li className="no-posts">검색 결과가 없습니다.</li>
                ) : (
                    // 게시글 목록 매핑
                    posts.map(post => (
                        <li key={post._id} className="post-item">
                            {/* 게시글 제목 (클릭 시 상세 페이지로 이동) */}
                            <span className="post-title" onClick={() => onPostClick(post._id)}>
                                {post.title}
                            </span>
                            {/* 작성자 */}
                            <span className="post-author">{post.author}</span>
                            {/* 작성일 (로케일 형식으로 표시) */}
                            <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </li>
                    ))
                )}
            </ul>

            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default Board;

