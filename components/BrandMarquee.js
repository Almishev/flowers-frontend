import styled, { keyframes } from "styled-components";
import Link from "next/link";

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const Strip = styled.section`
  background: #222;
  color: #f5f0e8;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Viewport = styled.div`
  overflow: hidden;
  width: 100%;

  &:hover .marquee-track {
    animation-play-state: paused;
  }
`;

const Track = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} ${props => props.duration}s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const BrandLink = styled(Link)`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 2.4rem;
  padding: 18px 0 18px 2.4rem;
  color: inherit;
  text-decoration: none;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 600;
  letter-spacing: 0.14em;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 6px;
    color: #d4af37;
  }

  &::after {
    content: '·';
    opacity: 0.45;
    font-weight: 400;
    letter-spacing: 0;
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

function buildLoop(brands) {
  const items = [...brands];
  while (items.length > 0 && items.length < 10) {
    items.push(...brands);
  }
  return [...items, ...items];
}

export default function BrandMarquee({ brands = [] }) {
  const list = uniqueBrands(brands);
  if (list.length === 0) return null;

  const loop = buildLoop(list);
  const duration = Math.max(28, list.length * 6);

  return (
    <Strip aria-label="Марки в DÉLIE">
      <Viewport>
        <Track className="marquee-track" duration={duration}>
          {loop.map((brand, index) => (
            <BrandLink
              key={`${brand}-${index}`}
              href={`/search?brand=${encodeURIComponent(brand)}`}
            >
              {brand}
            </BrandLink>
          ))}
        </Track>
      </Viewport>
    </Strip>
  );
}
