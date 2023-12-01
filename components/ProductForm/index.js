import { StyledForm, StyledHeading, StyledLabel } from "./ProductForm.styled";
import { StyledButton } from "../Button/Button.styled";
import useSWR from "swr";

export default function ProductForm() {
  const { mutate } = useSWR("/api/products"); // call `useSWR` in your `ProductForm` component with the API endpoint and destructure the `mutate` method

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    // send a "POST" request with `fetch`
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), // productData from the form input as the body of the request
    });

    // if the fetch was successful, call the `mutate` method to trigger a data revalidation of the useSWR hooks
    if (response.ok) {
      mutate();
      event.target.reset();
    }
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledHeading>Add a new Fish</StyledHeading>
      <StyledLabel htmlFor="name">
        Name:
        <input type="text" id="name" name="name" />
      </StyledLabel>
      <StyledLabel htmlFor="description">
        Description:
        <input type="text" id="description" name="description" />
      </StyledLabel>
      <StyledLabel htmlFor="price">
        Price:
        <input type="number" id="price" name="price" min="0" />
      </StyledLabel>
      <StyledLabel htmlFor="currency">
        Currency:
        <select id="currency" name="currency">
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>
      </StyledLabel>
      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
}
