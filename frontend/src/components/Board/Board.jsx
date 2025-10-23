import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';

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
        return (
            <div className="max-w-[1000px] my-10 mx-auto p-10 bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] rounded-[30px] shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 animate-float">
                <h2>Loading posts...</h2>
            </div>
        );
    }

    // === 메인 UI 렌더링 ===
    return (
        <div className="max-w-[1000px] my-10 mx-auto p-10 bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] rounded-[30px] shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 animate-float">
            {/* 게시판 헤더: 타이틀 + 새 글 작성 버튼 */}
            <div className="flex justify-between items-center border-b-2 border-white/20 pb-6 mb-8">
                <h2 className="m-0 text-[32px] font-black bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent tracking-tight">
                    Posts
                </h2>
                <button
                    onClick={onNewPostClick}
                    className="border-none py-3.5 px-8 rounded-full text-[15px] font-bold cursor-pointer bg-gradient-to-r from-pink-300 to-red-400 text-white transition-all duration-500 shadow-[0_10px_30px_rgba(245,87,108,0.5)] relative overflow-hidden uppercase tracking-wide before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_40px_rgba(245,87,108,0.7)]"
                >
                    New Post
                </button>
            </div>

            {/* 검색 섹션 */}
            <div className="mb-9 p-6 bg-white/10 backdrop-blur-[10px] rounded-[20px] border border-white/15 shadow-[0_8px_32px_rgba(31,38,135,0.2)]">
                <h3 className="m-0 mb-5 text-xl font-extrabold bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
                    Search Posts
                </h3>
                <form onSubmit={handleSearch} className="flex gap-3 items-center">
                    {/* 검색어 입력 필드 */}
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search by title or content..."
                        className="flex-1 py-3.5 px-5 border-2 border-white/20 rounded-full text-[15px] transition-all duration-300 bg-white/10 text-white font-medium placeholder:text-white/50 focus:outline-none focus:border-pink-300 focus:bg-white/15 focus:shadow-[0_0_25px_rgba(240,147,251,0.5)]"
                    />
                    {/* 검색 버튼 */}
                    <button
                        type="submit"
                        className="py-3.5 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-full text-[15px] font-bold cursor-pointer transition-all duration-300 shadow-[0_5px_20px_rgba(102,126,234,0.4)] uppercase tracking-wide hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(102,126,234,0.6)]"
                    >
                        Search
                    </button>
                    {/* 검색어가 있을 때만 Clear 버튼 표시 */}
                    {searchKeyword && (
                        <button
                            type="button"
                            onClick={handleSearchClear}
                            className="py-3.5 px-7 bg-white/20 text-white border border-white/30 backdrop-blur-[10px] rounded-full text-[15px] font-bold cursor-pointer transition-all duration-300 uppercase tracking-wide hover:bg-white/30 hover:-translate-y-1"
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {/* 게시글 목록 */}
            <ul className="list-none p-0">
                {posts.length === 0 ? (
                    // 게시글이 없을 때
                    <li className="text-center py-16 text-white/70 text-lg font-semibold">
                        검색 결과가 없습니다.
                    </li>
                ) : (
                    // 게시글 목록 매핑
                    posts.map(post => (
                        <li
                            key={post._id}
                            className="flex justify-between items-center py-5 px-4 border-b border-white/10 transition-all duration-300 rounded-2xl mb-1 last:border-b-0 hover:bg-white/15 hover:translate-x-2.5 hover:shadow-[0_5px_20px_rgba(240,147,251,0.3)]"
                        >
                            {/* 게시글 제목 (클릭 시 상세 페이지로 이동) */}
                            <span
                                className="font-semibold flex-grow cursor-pointer text-white/95 transition-all duration-300 hover:text-pink-300 hover:drop-shadow-[0_0_15px_rgba(240,147,251,0.8)]"
                                onClick={() => onPostClick(post._id)}
                            >
                                {post.title}
                            </span>
                            {/* 작성자 */}
                            <span className="w-[140px] text-center text-white/70 text-sm font-medium">
                                {post.author}
                            </span>
                            {/* 작성일 (로케일 형식으로 표시) */}
                            <span className="w-[150px] text-right text-white/60 text-[13px]">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
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

