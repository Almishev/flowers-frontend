import styled from "styled-components";
import Button from "@/components/Button";
import BagIcon from "@/components/icons/BagIcon";

const StyledOrderButton = styled(Button)`
  justify-content: center;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 10px 18px;
  border-radius: 8px;

  svg {
    height: 18px;
    width: 18px;
    margin-right: 8px;
  }
`;

export default function OrderButton({
  disabled,
  outOfStock,
  children,
  ...rest
}) {
  const soldOut = !!(outOfStock || disabled);
  return (
    <StyledOrderButton primary {...rest} disabled={soldOut}>
      {soldOut ? (
        'Изчерпан'
      ) : (
        <>
          <BagIcon />
          {children || 'Поръчай'}
        </>
      )}
    </StyledOrderButton>
  );
}
