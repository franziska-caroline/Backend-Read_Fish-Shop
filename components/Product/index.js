import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import ReviewForm from "../ReviewForm";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useSWR(`/api/products/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  console.log(data);
  return (
    <>
      <ProductCard>
        <h2>{data.name}</h2>
        <p>Description: {data.description}</p>
        <p>
          Price: {data.price} {data.currency}
        </p>
        {data?.reviews.length > 0 && (
          <>
            <h3>Comments:</h3>
            <ul>
              {data.reviews.map((review) => {
                return (
                  <>
                    <li key={review._id}>
                      <h4>{review.title}</h4>
                      <p>
                        {review.rating}/5: {review.text}
                      </p>
                    </li>
                  </>
                );
              })}
            </ul>
          </>
        )}
        <StyledLink href="/">Back to all</StyledLink>
      </ProductCard>
      <ReviewForm />
    </>
  );
}

