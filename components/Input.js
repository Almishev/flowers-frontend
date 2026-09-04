import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing:border-box;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #c9a227;
  }
`;

export default function Input(props) {
  return <StyledInput {...props} />
}