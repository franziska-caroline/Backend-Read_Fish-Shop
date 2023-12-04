import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import ReviewForm from "../ReviewForm";
import { useState } from "react";
import { StyledButton } from "../Button/Button.styled";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);
  const { mutate: mutateReviews } = useSWR(`/api/reviews/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  async function handleEditProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      router.push("/");
      mutate();
    }

    const { mutate } = useSWR("/api/products"); // call `useSWR` in your `ProductForm` component with the API endpoint and destructure the `mutate` method
  }

  async function handleAddReview(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const reviewData = Object.fromEntries(formData);

    console.log(reviewData);
    // send a "POST" request with `fetch`
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...reviewData, productId: id }), // productData from the form input as the body of the request
    });
    // if the fetch was successful, call the `mutate` method to trigger a data revalidation of the useSWR hooks
    if (response.ok) {
      mutateReviews();
      event.target.reset();
    }
    // const { mutate: mutateReviews } = useSWR("/api/reviews");
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await response.json(); // Ensure the response is fully read

        mutate();
        router.push("/");
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the delete request:", error);
    }
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
            <h3>Reviews:</h3>
            <ul>
              {data.reviews.map((review) => (
                <li key={review._id}>
                  <h4>{review.title}</h4>
                  <p>
                    {review.rating}/5: {review.text}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
        <StyledLink href="/">Back to all</StyledLink>
        <StyledButton
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          Edit
        </StyledButton>
        <StyledButton onClick={() => handleDeleteProduct(id)}>
          Delete
        </StyledButton>
      </ProductCard>
      {isEditMode && <ProductForm onSubmit={handleEditProduct} />}
      <ReviewForm onSubmit={handleAddReview} />
    </>
  );
}
