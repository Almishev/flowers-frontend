import Center from "@/components/Center";
import styled from "styled-components";
import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Bg = styled.div`
  background-color: #222;
  color:#fff;
  padding: 50px 0;
`;
const Title = styled.h1`
  margin:0;
  font-weight:normal;
  font-size:1.5rem;
  @media screen and (min-width: 768px) {
    font-size:3rem;
  }
`;
const Desc = styled.p`
  color:#aaa;
  font-size:.8rem;
`;
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  justify-items: center;
  
  div:nth-child(1) {
    order: 2;
  }
  
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    justify-items: stretch;
    div:nth-child(1) {
      order: 0;
    }
  }
`;
const Column = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  
  @media screen and (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
  
  ${props => props.style}
`;
const ButtonsWrapper = styled.div`
  display: flex;
  gap:10px;
  margin-top:25px;
  ${props => props.style}
`;

const StyledCenter = styled(Center)`
  padding-top: 0 !important;
  margin-top: 0 !important;
`;

export default function Featured({product}) {
  const textAnimation = useScrollAnimation({ animation: 'slideRight', delay: 0 });
  const imageAnimation = useScrollAnimation({ animation: 'slideLeft', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 400 });

  return (
    <Bg>
      <StyledCenter>
        <ColumnsWrapper>
          <Column ref={textAnimation.ref} style={textAnimation.style}>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonsWrapper ref={buttonAnimation.ref} style={buttonAnimation.style}>
                <ButtonLink href={'/trip/'+(product.slug || product._id)} outline={1} white={1}>Прочети повече</ButtonLink>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column ref={imageAnimation.ref} style={imageAnimation.style}>
            {product.images?.[0] ? (
              <Image 
                src={product.images[0]} 
                alt={product.title}
                width={400}
                height={200}
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                loading="lazy"
                unoptimized={product.images[0]?.includes('s3.amazonaws.com')}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
              }}>
                <span style={{color: '#999'}}>Няма снимка</span>
              </div>
            )}
          </Column>
        </ColumnsWrapper>
      </StyledCenter>

    </Bg>
  );
}