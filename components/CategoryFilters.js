import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import styled from "styled-components";
import {primary, primaryHover} from "@/lib/colors";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 0 24px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Field = styled.input`
  flex: 1 1 160px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${primary};
  }
`;

const Select = styled.select`
  flex: 1 1 160px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.95rem;
  font-family: inherit;
  background: #fff;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${primary};
  }
`;

const GoldButton = styled.button`
  padding: 10px 20px;
  background: ${primary};
  color: #1a1a1a;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.3s ease;

  &:hover {
    background: ${primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(201, 162, 39, 0.4);
  }
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background: #6b7280;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;

  &:hover {
    background: ${primaryHover};
    color: #1a1a1a;
  }
`;

const SORT_OPTIONS = [
  {value: '', label: 'Сортирай: най-нови'},
  {value: 'price_asc', label: 'Цена – възходяща'},
  {value: 'price_desc', label: 'Цена – низходяща'},
  {value: 'name_asc', label: 'Име – А-Я'},
  {value: 'name_desc', label: 'Име – Я-А'},
];

export default function CategoryFilters({
  basePath,
  brands = [],
  search: initialSearch = '',
  brand: initialBrand = '',
  minPrice: initialMin = '',
  maxPrice: initialMax = '',
  sort: initialSort = '',
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [brand, setBrand] = useState(initialBrand);
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    setSearch(initialSearch);
    setBrand(initialBrand);
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
    setSort(initialSort);
  }, [basePath, initialSearch, initialBrand, initialMin, initialMax, initialSort]);

  function buildQuery(next = {}) {
    const values = {
      search,
      brand,
      min: minPrice,
      max: maxPrice,
      sort,
      ...next,
    };
    const params = new URLSearchParams();
    if (String(values.search || '').trim()) params.set('search', String(values.search).trim());
    if (values.brand) params.set('brand', values.brand);
    if (String(values.min || '').trim()) params.set('min', String(values.min).trim());
    if (String(values.max || '').trim()) params.set('max', String(values.max).trim());
    if (values.sort) params.set('sort', values.sort);
    params.set('page', '1');
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function apply(event) {
    event?.preventDefault();
    router.push(buildQuery());
  }

  function clearFilters() {
    setSearch('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    router.push(basePath);
  }

  const hasFilters = !!(initialSearch || initialBrand || initialMin || initialMax || initialSort);

  return (
    <Form onSubmit={apply}>
      <Row>
        <Field
          type="search"
          placeholder="Търси по име..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Търсене по име"
        />
        <Select
          value={brand}
          onChange={(e) => {
            setBrand(e.target.value);
            router.push(buildQuery({brand: e.target.value}));
          }}
          aria-label="Филтър по марка"
        >
          <option value="">Всички марки</option>
          {brands.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            router.push(buildQuery({sort: e.target.value}));
          }}
          aria-label="Сортиране"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value || 'newest'} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
      </Row>
      <Row>
        <Field
          type="number"
          min="0"
          step="0.01"
          placeholder="Цена от"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          aria-label="Минимална цена"
        />
        <Field
          type="number"
          min="0"
          step="0.01"
          placeholder="Цена до"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          aria-label="Максимална цена"
        />
        <GoldButton type="submit">Приложи</GoldButton>
        {hasFilters && (
          <ClearButton type="button" onClick={clearFilters}>
            Изчисти филтрите
          </ClearButton>
        )}
      </Row>
    </Form>
  );
}
