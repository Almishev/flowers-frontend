import styled from "styled-components";
import Link from "next/link";
import {primary, primaryHover, primarySoft} from "@/lib/colors";

const Section = styled.section`
  background: #faf8f2;
  padding: 48px 0 40px;
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (min-width: 768px) {
    padding: 0 32px;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 8px;
  font-weight: 600;
  color: #111827;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Intro = styled.p`
  margin: 0 0 28px;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`;

const BrandCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 12px 10px;
  background: #fff;
  border: 1px solid #e8e0cc;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
  color: #1a1a1a;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.25;
  word-break: break-word;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;

  @media (min-width: 768px) {
    min-height: 64px;
    padding: 16px 12px;
    font-size: 1.15rem;
  }

  &:hover,
  &:focus-visible {
    background: ${primarySoft};
    border-color: ${primary};
    color: ${primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(201, 162, 39, 0.18);
    outline: none;
  }
`;

function uniqueBrands(brands) {
  const seen = new Set();
  const result = [];
  for (const raw of brands || []) {
    const name = String(raw || '').trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result.sort((a, b) => a.localeCompare(b, 'bg'));
}

export default function BrandsSection({ brands = [] }) {
  const list = uniqueBrands(brands);
  if (list.length === 0) return null;

  return (
    <Section aria-label="Марки">
      <Inner>
        <Title>Марки</Title>
        <Intro>{list.length} {list.length === 1 ? 'марка' : 'марки'} в DÉLIE</Intro>
        <Grid>
          {list.map((brand) => (
            <BrandCard
              key={brand}
              href={`/search?brand=${encodeURIComponent(brand)}`}
            >
              {brand}
            </BrandCard>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
