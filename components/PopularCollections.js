import styled from "styled-components";
import Center from "@/components/Center";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { categoryPath } from "@/lib/slugify";

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

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  ${props => props.style}
`;

const CollectionCard = styled(Link)`
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(201, 162, 39, 0.18);
    border-color: #c9a227;
  }
`;

const CollectionName = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #111;
  font-weight: 600;
`;

const CollectionLabel = styled.span`
  display: inline-block;
  background-color: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  align-self: flex-start;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  ${props => props.style}
`;

export default function PopularCollections({ departments = [] }) {
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const gridAnimation = useScrollAnimation({ animation: 'scale', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 400 });

  if (!departments.length) return null;

  return (
    <Section>
      <Center>
        <Title ref={titleAnimation.ref} style={titleAnimation.style}>Отдели</Title>
        <CollectionsGrid ref={gridAnimation.ref} style={gridAnimation.style}>
          {departments.map((department) => (
            <CollectionCard key={department._id} href={categoryPath(department)}>
              <CollectionName>{department.name}</CollectionName>
              <CollectionLabel>
                {(department.childrenCount || 0) === 1
                  ? '1 подкатегория'
                  : `${department.childrenCount || 0} подкатегории`}
              </CollectionLabel>
            </CollectionCard>
          ))}
        </CollectionsGrid>
        <ButtonWrapper ref={buttonAnimation.ref} style={buttonAnimation.style}>
          <ButtonLink href="/categories" black size="l">
            Виж всички категории
          </ButtonLink>
        </ButtonWrapper>
      </Center>
    </Section>
  );
}
