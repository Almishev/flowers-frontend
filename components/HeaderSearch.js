import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import styled from "styled-components";
import SearchIcon from "@/components/icons/Search";
import {primary, primaryHover, primaryDark} from "@/lib/colors";

const Wrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 0;
  ${props => props.$open && `
    flex: 1 1 auto;
    margin-right: 12px;
  `}
`;

const IconButton = styled.button`
  background: transparent;
  width: 32px;
  height: 32px;
  border: 0;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.2s ease;

  &:hover {
    color: ${primaryDark};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Field = styled.input`
  flex: 1;
  min-width: 0;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #1a1a1a;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: #1a1a1a;
  font-size: 13px;
  font-family: inherit;

  &::placeholder {
    color: #6b7280;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.15);
  }
`;

const Results = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: min(92vw, 360px);
  max-height: min(60vh, 420px);
  overflow-y: auto;
  background: #111827;
  border: 1px solid #333;
  border-radius: 10px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.65);
  z-index: 10001;
  padding: 6px 0;
`;

const ResultLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  text-decoration: none;
  color: #f3f4f6;

  &:hover {
    background: rgba(201, 162, 39, 0.12);
    color: ${primaryHover};
  }
`;

const Thumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  background: #1f2937;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Meta = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    font-size: 12px;
    color: #9ca3af;
  }
`;

const Empty = styled.div`
  padding: 14px;
  color: #9ca3af;
  font-size: 14px;
`;

const MoreLink = styled(Link)`
  display: block;
  padding: 10px 14px;
  color: ${primary};
  text-decoration: none;
  font-size: 13px;
  border-top: 1px solid #333;

  &:hover {
    color: ${primaryHover};
  }
`;

export default function HeaderSearch() {
  const router = useRouter();
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.products) ? data.products : []);
        setSearched(true);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setResults([]);
          setSearched(true);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  function goToSearch(event) {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <Wrap ref={wrapRef} $open={open}>
      <IconButton
        type="button"
        aria-label="Търсене"
        aria-expanded={open}
        onClick={() => setOpen(prev => !prev)}
      >
        <SearchIcon />
      </IconButton>
      {open && (
        <form onSubmit={goToSearch} style={{flex: 1, minWidth: 0}}>
          <Field
            ref={inputRef}
            type="search"
            placeholder="Търси продукт или марка..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      )}
      {open && query.trim().length >= 2 && (
        <Results>
          {loading && <Empty>Търсене...</Empty>}
          {!loading && searched && results.length === 0 && (
            <Empty>Няма намерени продукти.</Empty>
          )}
          {!loading && results.map((product) => (
            <ResultLink
              key={product._id}
              href={`/perfume/${product.slug || product._id}`}
              onClick={() => setOpen(false)}
            >
              <Thumb>
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt="" />
                ) : null}
              </Thumb>
              <Meta>
                <strong>{product.title}</strong>
                <span>
                  {[
                    product.brand,
                    product.variants?.filter(item => item.volume).length > 1
                      ? product.variants.map(item => item.volume).filter(Boolean).join(' / ')
                      : product.volume,
                    typeof product.price === 'number' ? `${product.price.toFixed(2)} EUR` : '',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </span>
              </Meta>
            </ResultLink>
          ))}
          {!loading && results.length > 0 && (
            <MoreLink
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setOpen(false)}
            >
              Виж всички резултати
            </MoreLink>
          )}
        </Results>
      )}
    </Wrap>
  );
}
