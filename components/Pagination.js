import styled from "styled-components";
import Link from "next/link";

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 32px 0;
  flex-wrap: wrap;
`;

const PageButton = styled(Link)`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #d4d4d8;
  background: ${({active}) => (active ? "#4338ca" : "#fff")};
  color: ${({active}) => (active ? "#fff" : "#374151")};
  text-decoration: none;
  font-weight: 500;
  min-width: 40px;
  text-align: center;
  cursor: ${({disabled}) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({disabled}) => (disabled ? 0.4 : 1)};
  pointer-events: ${({disabled}) => (disabled ? "none" : "auto")};
`;

const ArrowButton = styled(PageButton)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

function buildHref(basePath, page) {
  try {
    const url = new URL(basePath, "http://dummy");
    if (page > 1) {
      url.searchParams.set("page", page);
    } else {
      url.searchParams.delete("page");
    }
    return `${url.pathname}${url.search}`;
  } catch (e) {
    // Fallback for relative paths
    const params = new URLSearchParams();
    if (page > 1) {
      params.set("page", page);
    }
    // Preserve existing query params from basePath
    if (basePath.includes('?')) {
      const [path, existingQuery] = basePath.split('?');
      const existingParams = new URLSearchParams(existingQuery);
      existingParams.forEach((value, key) => {
        if (key !== 'page') {
          params.set(key, value);
        }
      });
      return `${path}${params.toString() ? '?' + params.toString() : ''}`;
    }
    return `${basePath}${params.toString() ? '?' + params.toString() : ''}`;
  }
}

export default function Pagination({page, totalPages, basePath}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }
  for (let p = start; p <= end; p++) {
    pages.push(p);
  }

  return (
    <PaginationWrapper>
      <ArrowButton
        href={buildHref(basePath, Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ← Назад
      </ArrowButton>
      {start > 1 && (
        <>
          <PageButton href={buildHref(basePath, 1)} active={false}>1</PageButton>
          {start > 2 && <span>…</span>}
        </>
      )}
      {pages.map((p) => (
        <PageButton
          key={p}
          href={buildHref(basePath, p)}
          active={p === page ? 1 : 0}
        >
          {p}
        </PageButton>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span>…</span>}
          <PageButton href={buildHref(basePath, totalPages)} active={false}>
            {totalPages}
          </PageButton>
        </>
      )}
      <ArrowButton
        href={buildHref(basePath, Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Напред →
      </ArrowButton>
    </PaginationWrapper>
  );
}

