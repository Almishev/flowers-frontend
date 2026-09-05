import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { groupProductVariants } from "@/lib/productVariants";

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export default function ProductsGrid({products}) {
  const alreadyGrouped = products?.length > 0 && products.every(product => Array.isArray(product.variants));
  const items = alreadyGrouped ? products : groupProductVariants(products);

  return (
    <StyledProductsGrid>
      {items?.length > 0 && items.map(product => (
        <ProductBox key={product._id} {...product} />
      ))}
    </StyledProductsGrid>
  );
}