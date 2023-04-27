import { Fragment, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import Item from "./Item";
import Loading from "@components/Loading";
import ScrollButton from "@components/ScrollButton";

import { fetchPosts } from "@api/fetchPosts";
import { IPostsDataPerPage } from "@type/posts";

export default function Posts() {
  // page 단위로 Postsdata GET 요청 및 캐싱
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<IPostsDataPerPage, { message: string }>({
    queryKey: ["Posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.totalPages,
  });

  // ref가 연결된 태그의 확인
  // { ref, inView}
  const { ref, inView } = useInView();

  // 하단 페이지에 도달시 fetchNextPage 요청
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView]);

  return (
    <div className="w-full p-4 rounded-2xl bg-gray_4">
      {status === "loading" ? (
        <Loading />
      ) : status === "error" ? (
        <>{error && <p>Error: {error.message}</p>}</>
      ) : (
        <>
          {/* 게시글 데이터 출력 영역 */}
          <div className="w-full p-4 text-xl font-bold">자유 게시판</div>
          <div className="grid grid-cols-1 gap-4 ">
            {data.pages.map((group, indx) => (
              <Fragment key={indx + "page"}>
                {group.data.map((post) => (
                  <Item key={post.id} post={post} />
                ))}
              </Fragment>
            ))}
          </div>
          {/* fetchNextPage 를 트리거 하기 위한 태그 */}
          <span ref={ref}>
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </span>

          {/* 첫 fetching 시 로딩 UI */}
          <div>{isFetching && !isFetchingNextPage ? <Loading /> : null}</div>
        </>
      )}

      {/* 최상단 이동 버튼 */}
      <ScrollButton />
    </div>
  );
}