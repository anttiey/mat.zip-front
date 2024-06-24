import MyReviewItem from "../MyReviewItem/MyReviewItem";
import * as S from "./MyReviewListPage.style";
import { useInfiniteQuery } from "react-query";
import { UserReview } from "types/common";

import getNextPageParam from "api/getNextPageParam";
import fetchUserReviewList from "api/mypage/fetchUserReviewList";

import Divider from "components/common/Divider/Divider";
import ErrorImage from "components/common/ErrorImage/ErrorImage";
import ErrorText from "components/common/ErrorText/ErrorText";
import InfiniteScroll from "components/common/InfiniteScroll/InfiniteScroll";
import Spinner from "components/common/Spinner/Spinner";
import Text from "components/common/Text/Text";

function MyReviewListPage() {
  const { data, error, isLoading, isError, fetchNextPage, isFetching } =
    useInfiniteQuery(["myReviewList"], fetchUserReviewList, {
      getNextPageParam,
    });

  const loadMoreReviews = () => {
    fetchNextPage();
  };

  const reviews =
    data?.pages.reduce<UserReview[]>(
      (prevReviews, { reviews: currentReviews }) => [
        ...prevReviews,
        ...currentReviews,
      ],
      []
    ) || [];

  return (
    <S.Container>
      <S.HeaderWrapper>
        <Text css={S.headerStyle}>나의 리뷰</Text>
      </S.HeaderWrapper>
      <InfiniteScroll handleContentLoad={loadMoreReviews} hasMore={true}>
        {(isLoading || isFetching) && <Spinner />}
        {isError && error instanceof Error && (
          <ErrorImage errorMessage={error.message} />
        )}
        {reviews.length ? (
          reviews.map((review) => (
            <S.ReviewItemWrapper key={review.id}>
              <MyReviewItem {...review} />
              <Divider />
            </S.ReviewItemWrapper>
          ))
        ) : (
          <ErrorText>작성된 리뷰가 없습니다.</ErrorText>
        )}
      </InfiniteScroll>
    </S.Container>
  );
}

export default MyReviewListPage;
