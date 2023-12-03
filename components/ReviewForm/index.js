import {
  StyledForm,
  StyledHeading,
  StyledLabel,
} from "../ProductForm/ProductForm.styled";
import { StyledButton } from "../Button/Button.styled";

export default function ReviewForm() {
  return (
    <>
      <StyledForm>
        <StyledHeading>Add a new Review</StyledHeading>
        <StyledLabel htmlFor="review">
          Review:
          <textarea type="text" rows="3" id="review" name="review" />
        </StyledLabel>
        <StyledButton type="submit">Submit</StyledButton>
      </StyledForm>
    </>
  );
}
