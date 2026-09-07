import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/router";
import styled from "styled-components";
import {primary, primaryHover} from "@/lib/colors";
import {childrenOf, sortDepartments} from "@/lib/categories";
import {categorySlug} from "@/lib/slugify";
import {SALE_SORT_OPTIONS} from "@/lib/saleProducts";

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

const Select = styled.select`
  flex: 1 1 180px;
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

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
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

export default function OffersFilters({
  categories = [],
  department: initialDepartment = '',
  subcategory: initialSubcategory = '',
  sort: initialSort = '',
}) {
  const router = useRouter();
  const [department, setDepartment] = useState(initialDepartment);
  const [subcategory, setSubcategory] = useState(initialSubcategory);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => {
    setDepartment(initialDepartment);
    setSubcategory(initialSubcategory);
    setSort(initialSort);
  }, [initialDepartment, initialSubcategory, initialSort]);

  const departments = useMemo(() => sortDepartments(categories), [categories]);
  const selectedDept = departments.find((dept) => categorySlug(dept) === department);
  const subcategories = useMemo(
    () => {
      if (!selectedDept) return [];
      return childrenOf(categories, selectedDept._id)
        .sort((a, b) => String(a.name).localeCompare(b.name, 'bg'));
    },
    [categories, selectedDept]
  );

  function hrefFor({nextDepartment = department, nextSubcategory = subcategory, nextSort = sort} = {}) {
    const params = new URLSearchParams();
    if (nextDepartment) params.set('department', nextDepartment);
    if (nextDepartment && nextSubcategory) params.set('subcategory', nextSubcategory);
    if (nextSort) params.set('sort', nextSort);
    const qs = params.toString();
    return qs ? `/offers?${qs}` : '/offers';
  }

  function go(next) {
    router.push(hrefFor(next));
  }

  const hasFilters = !!(initialDepartment || initialSubcategory || initialSort);

  return (
    <Form onSubmit={(event) => event.preventDefault()}>
      <Row>
        <Select
          value={department}
          onChange={(e) => {
            const nextDepartment = e.target.value;
            setDepartment(nextDepartment);
            setSubcategory('');
            go({ nextDepartment, nextSubcategory: '', nextSort: sort });
          }}
          aria-label="Категория"
        >
          <option value="">Всички категории</option>
          {departments.map((dept) => (
            <option key={dept._id} value={categorySlug(dept)}>{dept.name}</option>
          ))}
        </Select>
        <Select
          value={subcategory}
          onChange={(e) => {
            const nextSubcategory = e.target.value;
            setSubcategory(nextSubcategory);
            go({ nextDepartment: department, nextSubcategory, nextSort: sort });
          }}
          disabled={!department || subcategories.length === 0}
          aria-label="Подкатегория"
        >
          <option value="">Всички подкатегории</option>
          {subcategories.map((cat) => (
            <option key={cat._id} value={categorySlug(cat)}>{cat.name}</option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => {
            const nextSort = e.target.value;
            setSort(nextSort);
            go({ nextDepartment: department, nextSubcategory: subcategory, nextSort });
          }}
          aria-label="Сортиране"
        >
          {SALE_SORT_OPTIONS.map((opt) => (
            <option key={opt.value || 'discount'} value={opt.value}>{opt.label}</option>
          ))}
        </Select>
        {hasFilters && (
          <ClearButton type="button" onClick={() => router.push('/offers')}>
            Изчисти филтрите
          </ClearButton>
        )}
      </Row>
    </Form>
  );
}
