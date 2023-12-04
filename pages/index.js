import ProductForm from "@/components/ProductForm";
import ProductList from "../components/ProductList";
import styled from "styled-components";
import useSWR from "swr";

const Heading = styled.h1`
  text-align: center;
  color: var(--color-nemo);
`;

export default function HomePage() {
  const { mutate } = useSWR("/api/products"); // call `useSWR` in your `ProductForm` component with the API endpoint and destructure the `mutate` method

  async function handleAddProduct(event) {
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
    <>
      <Heading>
        <span role="img" aria-label="A fish">
          🐠
        </span>
        Fish Shop
      </Heading>
      <ProductForm onSubmit={handleAddProduct} />
      <ProductList />
    </>
  );
}
