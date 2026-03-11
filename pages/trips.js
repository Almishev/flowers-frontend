import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import SEO from "@/components/SEO";

const PAGE_SIZE = 20;

import {useRouter} from "next/router";
import {useState} from "react";

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Цена – възходяща' },
  { value: 'price_desc', label: 'Цена – низходяща' },
];

export default function TripsPage({
  trips,
  page,
  totalPages,
  totalCount,
  search: initialSearch,
  sort: initialSort,
  typeFilter: initialTypeFilter,
  availableTypeValues,
  categories,
  initialCategoryFilterIds = [],
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  // Празна стойност означава "по подразбиране – най-нови"
  const [sort, setSort] = useState(initialSort || '');
  const [typeFilter, setTypeFilter] = useState(initialTypeFilter || '');
  const [categoryFilterIds, setCategoryFilterIds] = useState(
    Array.isArray(initialCategoryFilterIds) ? initialCategoryFilterIds : []
  );

  function handleSearch(e) {
    e.preventDefault();
    applyFilters();
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (sort) params.set('sort', sort);
    if (typeFilter) params.set('type', typeFilter);
     if (categoryFilterIds.length > 0) params.set('cat', categoryFilterIds.join(','));
    params.set('page', '1');
    router.push('/bouquets?' + params.toString());
  }

  function clearFilters() {
    setSearchTerm('');
    setSort('');
    setTypeFilter('');
    setCategoryFilterIds([]);
    router.push('/bouquets');
  }

  function buildBasePath() {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (sort) params.set('sort', sort);
    if (typeFilter) params.set('type', typeFilter);
    if (categoryFilterIds.length > 0) params.set('cat', categoryFilterIds.join(','));
    const queryString = params.toString();
    return queryString ? `/bouquets?${queryString}` : '/bouquets';
  }

  const basePath = buildBasePath();
  const hasActiveFilters =
    !!searchTerm || !!typeFilter || !!sort || categoryFilterIds.length > 0;

  // SEO текстовете
  const seoTitle = initialSearch
    ? `Търсене на букети: "${initialSearch}"`
    : 'Всички букети';

  const seoDescription = initialSearch
    ? `Резултати за търсене на букети по "${initialSearch}". Намерени ${totalCount}.`
    : `Всички букети в Flowers Boutique MIA. Общо ${totalCount}.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        url={basePath}
        image="/logo-shop-flowers-v2.png"
      />
      <Header />
      <Center>
        <Title>Всички букети</Title>
        <p style={{color:'#6b7280', marginTop: '-8px'}}>
          {searchTerm
            ? `Намерени ${totalCount} ${totalCount === 1 ? 'букет' : 'букета'}`
            : `Общо букети: ${totalCount}`}
        </p>
        
        <div style={{marginBottom: '20px'}}>
          <form
            onSubmit={handleSearch}
            style={{marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}
          >
            <input
              type="text"
              placeholder="Търси по име, описание или повод..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{flex: '1 1 300px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '200px'}}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(1.05)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Търси
            </button>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                // при промяна на сортирането пренасочваме със запазени филтри
                const params = new URLSearchParams();
                if (searchTerm.trim()) params.set('search', searchTerm.trim());
                if (e.target.value) params.set('sort', e.target.value);
                if (typeFilter) params.set('type', typeFilter);
                params.set('page', '1');
                router.push('/bouquets?' + params.toString());
              }}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                minWidth: '200px',
              }}
            >
              <option value="">Сортирай по: най-нови</option>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {availableTypeValues && availableTypeValues.length > 0 && (
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  applyFilters();
                }}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  minWidth: '180px',
                }}
              >
                <option value="">Всички типове цветя</option>
                {availableTypeValues.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            )}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
              >
                Изчисти всички
              </button>
            )}
          </form>

          {categories && categories.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px 16px',
                marginBottom: '10px',
                fontSize: '0.9rem',
              }}
            >
              {categories.map((cat) => {
                const id = cat._id?.toString?.() || cat._id;
                const checked = categoryFilterIds.includes(id);
                return (
                  <label
                    key={id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      background: checked ? '#dcfce7' : '#f3f4f6',
                      borderRadius: '999px',
                      padding: '6px 12px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...categoryFilterIds, id]
                          : categoryFilterIds.filter((cId) => cId !== id);
                        setCategoryFilterIds(next);
                        const params = new URLSearchParams();
                        if (searchTerm.trim()) params.set('search', searchTerm.trim());
                        if (sort) params.set('sort', sort);
                        if (typeFilter) params.set('type', typeFilter);
                        if (next.length > 0) params.set('cat', next.join(','));
                        params.set('page', '1');
                        router.push('/bouquets?' + params.toString());
                      }}
                      style={{accentColor: '#16a34a'}}
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {trips.length === 0 ? (
          <div>Няма намерени букети.</div>
        ) : (
          <>
            <ProductsGrid products={trips} />
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              basePath={basePath}
            />
          </>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps({query}) {
  try {
    await mongooseConnect();
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const search = query.search?.trim() || '';
    // ако няма sort в URL, показваме по подразбиране "най-нови"
    const sortParam = query.sort || '';
    const typeFilter = query.type?.trim() || '';
    const catParam = query.cat || '';
    const categoryFilterIds = catParam ? catParam.split(',') : [];

    // Създаваме query за филтриране на букети
    let mongoQuery = {
      status: { $ne: 'archived' }, // Не показваме архивирани
    };

    // Търсене по заглавие и описание
    if (search) {
      const regex = new RegExp(search, 'i');
      mongoQuery.$or = [
        { title: regex },
        { description: regex },
      ];
    }

    // Филтър по избрани категории
    if (categoryFilterIds.length > 0) {
      mongoQuery.category = { $in: categoryFilterIds };
    }

    // Филтър по тип цветя (свойство). Името на ключа тук трябва да съвпада с това,
    // което използвате в админ панела, напр. "Тип цветя".
    if (typeFilter) {
      mongoQuery['properties.Тип цветя'] = typeFilter;
    }

    const totalCount = await Product.countDocuments(mongoQuery);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    // Определяме сортирането
    let sortQuery = {};
    if (sortParam === 'price_asc') {
      sortQuery = { price: 1 };
    } else if (sortParam === 'price_desc') {
      sortQuery = { price: -1 };
    } else {
      // по подразбиране – най-новите продукти
      sortQuery = { _id: -1 };
    }

    const [trips, categories] = await Promise.all([
      Product.find(mongoQuery)
      .select('slug title price currency images category status isFeatured description')
      .sort(sortQuery)
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
      Category.find({ status: { $ne: 'archived' } })
        .select('name slug')
        .sort({ name: 1 })
        .lean(),
    ]);

    return {
      props: {
        trips: JSON.parse(JSON.stringify(trips)),
        page: currentPage,
        totalPages,
        totalCount,
        search,
        sort: sortParam,
        typeFilter,
        availableTypeValues: [],
        categories: JSON.parse(JSON.stringify(categories)),
        initialCategoryFilterIds: categoryFilterIds,
      },
    };
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    return {
      props: {
        trips: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
        search: '',
        sort: '',
        typeFilter: '',
        availableTypeValues: [],
      },
    };
  }
}