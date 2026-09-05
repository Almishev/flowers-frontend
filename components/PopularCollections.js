import styled from "styled-components";
import Center from "@/components/Center";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { categoryPath } from "@/lib/slugify";
import { primarySoft } from "@/lib/colors";

const Section = styled.section`
  padding: 72px 0 80px;
  background:
    radial-gradient(ellipse at top, rgba(201, 162, 39, 0.12), transparent 55%),
    #f7f4ec;
`;

const HeaderBlock = styled.div`
  text-align: center;
  max-width: 560px;
  margin: 0 auto 40px;
  ${props => props.style}
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c9a227;
  font-weight: 600;
`;

const Title = styled.h2`
  font-family: 'Cormorant Garamond', serif;
  font-size: 2.6rem;
  line-height: 1.15;
  margin: 0 0 12px;
  font-weight: 600;
  color: #1a1a1a;
`;

const Intro = styled.p`
  margin: 0;
  color: #6b6254;
  font-size: 1.02rem;
  line-height: 1.7;
`;

const CollectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 40px;

  @media screen and (min-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  ${props => props.style}
`;

const CollectionCard = styled(Link)`
  position: relative;
  display: block;
  min-height: 340px;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  box-shadow: 0 10px 30px rgba(26, 22, 14, 0.08);
  isolation: isolate;

  @media screen and (min-width: 700px) {
    min-height: 420px;
  }

  &:hover img {
    transform: scale(1.06);
  }

  &:hover .card-overlay {
    background: linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.72) 100%);
  }

  &:hover .card-line {
    width: 56px;
  }
`;

const CardMedia = styled.div`
  position: absolute;
  inset: 0;
  background: ${props => props.$fallback};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.08) 25%, rgba(0,0,0,0.68) 100%);
  transition: background 0.35s ease;
`;

const CardIcon = styled.div`
  position: absolute;
  top: 22px;
  left: 22px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(8px);
  z-index: 1;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const CardBody = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24px 22px 26px;
  z-index: 1;
`;

const CollectionName = styled.h3`
  margin: 0 0 8px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const GoldLine = styled.span`
  display: block;
  width: 28px;
  height: 2px;
  background: #c9a227;
  margin-bottom: 12px;
  transition: width 0.3s ease;
`;

const CollectionLabel = styled.span`
  display: inline-block;
  background: rgba(255, 255, 255, 0.14);
  color: ${primarySoft};
  border: 1px solid rgba(201, 162, 39, 0.45);
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.8rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  ${props => props.style}
`;

function departmentLook(department) {
  const key = `${department.slug || ''} ${department.name || ''}`.toLowerCase();
  if (key.includes('parfyum') || key.includes('парфюм')) {
    return {
      fallback: 'linear-gradient(160deg, #2b2114 0%, #8b6914 55%, #c9a227 100%)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 3h6l1 4H8l1-4z" />
          <path d="M8 7h8v3a6 6 0 0 1-8 0V7z" />
          <path d="M7 17c0-2 10-2 10 0v3H7v-3z" />
        </svg>
      ),
    };
  }
  if (key.includes('kozmetik') || key.includes('козметик')) {
    return {
      fallback: 'linear-gradient(160deg, #3a2a28 0%, #7a4a45 50%, #d4af37 100%)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 3h4v6H8z" />
          <path d="M7 9h6v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z" />
          <path d="M16 8h3v12h-3z" />
        </svg>
      ),
    };
  }
  if (key.includes('bizhu') || key.includes('бижу')) {
    return {
      fallback: 'linear-gradient(160deg, #1f1c18 0%, #4a4032 45%, #d4af37 100%)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3l3 5-3 13-3-13 3-5z" />
          <path d="M6 8h12" />
        </svg>
      ),
    };
  }
  return {
    fallback: 'linear-gradient(160deg, #222 0%, #6b5a2e 100%)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="7" />
      </svg>
    ),
  };
}

function subcategoryLabel(count) {
  if (count === 1) return '1 подкатегория';
  return `${count || 0} подкатегории`;
}

function productLabel(count) {
  if (typeof count !== 'number') return '';
  if (count === 1) return '1 продукт';
  return `${count} продукта`;
}

export default function PopularCollections({ departments = [] }) {
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const gridAnimation = useScrollAnimation({ animation: 'scale', delay: 200 });
  const buttonAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 400 });

  if (!departments.length) return null;

  return (
    <Section>
      <Center>
        <HeaderBlock ref={titleAnimation.ref} style={titleAnimation.style}>
          <Eyebrow>DÉLIE</Eyebrow>
          <Title>Отдели</Title>
          <Intro>Парфюми, грижа и бижута – изберете откъде да започнете.</Intro>
        </HeaderBlock>
        <CollectionsGrid ref={gridAnimation.ref} style={gridAnimation.style}>
          {departments.map((department) => {
            const look = departmentLook(department);
            const products = productLabel(department.productCount);
            return (
              <CollectionCard key={department._id} href={categoryPath(department)}>
                <CardMedia $fallback={look.fallback}>
                  {department.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={department.image}
                      alt=""
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : null}
                </CardMedia>
                <CardOverlay className="card-overlay" />
                <CardIcon>{look.icon}</CardIcon>
                <CardBody>
                  <CollectionName>{department.name}</CollectionName>
                  <GoldLine className="card-line" />
                  <CollectionLabel>
                    {products
                      ? `${products} · ${subcategoryLabel(department.childrenCount)}`
                      : subcategoryLabel(department.childrenCount)}
                  </CollectionLabel>
                </CardBody>
              </CollectionCard>
            );
          })}
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
