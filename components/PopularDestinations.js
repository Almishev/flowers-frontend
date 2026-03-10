import styled from "styled-components";
import Center from "@/components/Center";
import Link from "next/link";
import Image from "next/image";
import ButtonLink from "@/components/ButtonLink";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Section = styled.section`
  padding: 60px 0;
  background-color: #fff7f7;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 40px;
  font-weight: normal;
  text-align: center;
  ${props => props.style}
`;

const DestinationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  ${props => props.style}
`;

const DestinationCard = styled(Link)`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
`;

const DestinationName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #111;
  font-weight: 600;
`;

const TripCount = styled.span`
  display: inline-block;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  align-self: flex-start;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  ${props => props.style}
`;

export default function PopularDestinations({destinations}) {
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const gridAnimation = useScrollAnimation({ animation: 'scale', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 400 });

  if (!destinations || destinations.length === 0) {
    return null;
  }

  return (
    <Section>
      <Center>
        <Title ref={titleAnimation.ref} style={titleAnimation.style}>Популярни букети и поводи</Title>
        <DestinationsGrid ref={gridAnimation.ref} style={gridAnimation.style}>
          {destinations.slice(0, 6).map((dest, index) => (
            <DestinationCard key={index} href={`/destination/${encodeURIComponent(dest.name)}`}>
              {dest.sample?.image && (
                <ImageWrapper>
                  <Image 
                    src={dest.sample.image} 
                    alt={dest.name}
                    width={250}
                    height={150}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                    unoptimized={dest.sample.image?.includes('s3.amazonaws.com')}
                  />
                </ImageWrapper>
              )}
              <DestinationName>{dest.name}</DestinationName>
              <TripCount>{dest.count} {dest.count === 1 ? 'букет' : 'букета'}</TripCount>
            </DestinationCard>
          ))}
        </DestinationsGrid>
        <ButtonWrapper ref={buttonAnimation.ref} style={buttonAnimation.style}>
          <ButtonLink href="/categories" primary size="l">
            Виж всички категории
          </ButtonLink>
        </ButtonWrapper>
      </Center>
    </Section>
  );
}

