import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import ButtonLink from "@/components/ButtonLink";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Title = styled.h2`
  font-size: 2rem;
  margin:30px 0 20px;
  font-weight: normal;
  ${props => props.style}
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
  ${props => props.style}
`;

const AnimatedGrid = styled.div`
  ${props => props.style}
`;

export default function NewProducts({products}) {
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const gridAnimation = useScrollAnimation({ animation: 'slideUp', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 400 });

  return (
    <Center>
      <Title ref={titleAnimation.ref} style={titleAnimation.style}>Нови букети</Title>
      <AnimatedGrid ref={gridAnimation.ref} style={gridAnimation.style}>
        <ProductsGrid products={products} />
      </AnimatedGrid>
      <ButtonWrapper ref={buttonAnimation.ref} style={buttonAnimation.style}>
        <ButtonLink href="/bouquets" primary size="l">
          Виж всички букети
        </ButtonLink>
      </ButtonWrapper>
    </Center>
  );
}