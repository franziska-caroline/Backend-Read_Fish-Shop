import {
  StyledForm,
  StyledHeading,
  StyledLabel,
} from "../ProductForm/ProductForm.styled";
import { StyledButton } from "../Button/Button.styled";
import useSWR from "swr";

export default function ReviewForm() {
  const { mutate } = useSWR("/api/review"); // call `useSWR` in your `ReviewForm` component with the API endpoint and destructure the `mutate` method

  async function handleSubmit(event) {
    event.preventDefault();

    // Bekomme hier die Daten aus dem Formular
    const formData = new FormData(event.target);
    const reviewData = Object.fromEntries(formData);
    const data = {
      rating: reviewData.review__rating,
      text: reviewData.review__text,
      title: reviewData.review__title,
    };

    // send a "POST" request with `fetch`
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // productData from the form input as the body of the request
    });

    // if the fetch was successful, call the `mutate` method to trigger a data revalidation of the useSWR hooks
    if (response.ok) {
      mutate();
      event.target.reset();
    }
  }
  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledHeading>Add a new Review</StyledHeading>
        <StyledLabel htmlFor="review__title">
          Title:
          <input type="text" id="review__title" name="review__title" />
        </StyledLabel>
        <StyledLabel htmlFor="review__rating">
          Rating:
          <input type="text" id="review__rating" name="review__rating" />
        </StyledLabel>
        <StyledLabel htmlFor="review__text">
          Text:
          <input type="text" id="review__text" name="review__text" />
        </StyledLabel>
        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </>
  );
}
