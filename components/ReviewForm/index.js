import {
  StyledForm,
  StyledHeading,
  StyledLabel,
} from "../ProductForm/ProductForm.styled";
import { StyledButton } from "../Button/Button.styled";

export default function ReviewForm({ onSubmit }) {
  return (
    <>
      <StyledForm onSubmit={onSubmit}>
        <StyledHeading>Add a new Review</StyledHeading>
        <StyledLabel htmlFor="title">
          Title:
          <input type="text" id="title" name="title" />
        </StyledLabel>
        <StyledLabel htmlFor="text">
          Review:
          <input type="text" id="text" name="text" />
        </StyledLabel>
        <StyledLabel htmlFor="rating">
          Rating:
          <input type="text" id="rating" name="rating" />
        </StyledLabel>
        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </>
  );
}
