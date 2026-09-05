import {useCallback, useEffect, useRef, useState} from "react";
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

const CarouselRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    gap: 12px;
  }
`;

const ArrowButton = styled.button`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid ${primary};
  background: #fff;
  color: ${primary};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 1;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;
  }

  &:hover:not(:disabled) {
    background: ${primaryHover};
    color: #1a1a1a;
    box-shadow: 0 4px 14px rgba(201, 162, 39, 0.4);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const Viewport = styled.div`
  overflow: hidden;
  flex: 1;
  min-width: 0;
  touch-action: pan-y;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Track = styled.div`
  display: flex;
  transition: transform 0.35s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Page = styled.div`
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, minmax(0, 1fr));
  gap: 10px;

  @media (min-width: 768px) {
    gap: 14px;
  }
`;

const BrandCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 12px 8px;
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
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

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
    box-shadow: 0 6px 16px rgba(201, 162, 39, 0.18);
    outline: none;
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
`;

const Dot = styled.button`
  width: ${props => props.active ? '18px' : '8px'};
  height: 8px;
  border: 0;
  border-radius: 999px;
  background: ${props => props.active ? primary : '#d6d3c4'};
  cursor: pointer;
  padding: 0;
  transition: width 0.2s ease, background 0.2s ease;
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

function itemsPerViewForWidth(width) {
  if (width >= 1024) return 6;
  if (width >= 768) return 4;
  if (width >= 480) return 3;
  return 2;
}

function chunk(list, size) {
  const pages = [];
  for (let i = 0; i < list.length; i += size) {
    pages.push(list.slice(i, i + size));
  }
  return pages.length > 0 ? pages : [[]];
}

export default function BrandsSection({ brands = [] }) {
  const list = uniqueBrands(brands);
  const viewportRef = useRef(null);
  const dragRef = useRef({active: false, startX: 0, moved: false});
  const [itemsPerView, setItemsPerView] = useState(2);
  const [page, setPage] = useState(0);

  const updateItemsPerView = useCallback(() => {
    const width = viewportRef.current?.clientWidth || window.innerWidth;
    setItemsPerView(itemsPerViewForWidth(width));
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [updateItemsPerView]);

  const pages = chunk(list, itemsPerView);
  const pageCount = pages.length;

  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  if (list.length === 0) return null;

  const goTo = (next) => {
    if (pageCount <= 1) return;
    setPage((next + pageCount) % pageCount);
  };

  const onPointerDown = (event) => {
    dragRef.current = {active: true, startX: event.clientX, moved: false};
  };

  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    if (Math.abs(event.clientX - dragRef.current.startX) > 8) {
      dragRef.current.moved = true;
    }
  };

  const onPointerUp = (event) => {
    if (!dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    if (Math.abs(delta) >= 40) {
      goTo(page + (delta < 0 ? 1 : -1));
    }
  };

  const handleCardClick = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
    }
  };

  return (
    <Section aria-label="Марки">
      <Inner>
        <Title>Марки</Title>
        <Intro>{list.length} {list.length === 1 ? 'марка' : 'марки'} в DÉLIE</Intro>
        <CarouselRow>
          <ArrowButton
            type="button"
            aria-label="Предишни марки"
            onClick={() => goTo(page - 1)}
            disabled={pageCount <= 1}
          >
            ‹
          </ArrowButton>
          <Viewport
            ref={viewportRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <Track style={{transform: `translateX(-${page * 100}%)`}}>
              {pages.map((pageBrands, pageIndex) => (
                <Page key={pageIndex} $columns={itemsPerView}>
                  {pageBrands.map((brand) => (
                    <BrandCard
                      key={brand}
                      href={`/search?brand=${encodeURIComponent(brand)}`}
                      onClick={handleCardClick}
                      draggable={false}
                    >
                      {brand}
                    </BrandCard>
                  ))}
                </Page>
              ))}
            </Track>
          </Viewport>
          <ArrowButton
            type="button"
            aria-label="Следващи марки"
            onClick={() => goTo(page + 1)}
            disabled={pageCount <= 1}
          >
            ›
          </ArrowButton>
        </CarouselRow>
        {pageCount > 1 && (
          <Dots>
            {pages.map((_, index) => (
              <Dot
                key={index}
                type="button"
                active={index === page ? 1 : 0}
                aria-label={`Страница ${index + 1}`}
                onClick={() => setPage(index)}
              />
            ))}
          </Dots>
        )}
      </Inner>
    </Section>
  );
}
