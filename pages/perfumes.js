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
import {primary, primaryHover, primarySoft} from "@/lib/colors";

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Цена – възходяща' },
  { value: 'price_desc', label: 'Цена – низходяща' },
];

const PRODUCT_FIELDS = 'slug title price compareAtPrice currency images category description brand volume concentration gender stock';

export default function PerfumesPage({
  products,
  page,
  totalPages,
  totalCount,
  search: initialSearch,
  sort: initialSort,
  categories,
  initialCategoryFilterIds = [],
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [sort, setSort] = useState(initialSort || '');
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
    if (categoryFilterIds.length > 0) params.set('cat', categoryFilterIds.join(','));
    params.set('page', '1');
    router.push('/perfumes?' + params.toString());
  }

  function clearFilters() {
    setSearchTerm('');
    setSort('');
    setCategoryFilterIds([]);
    router.push('/perfumes');
  }

  function buildBasePath() {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (sort) params.set('sort', sort);
    if (categoryFilterIds.length > 0) params.set('cat', categoryFilterIds.join(','));
    const queryString = params.toString();
    return queryString ? `/perfumes?${queryString}` : '/perfumes';
  }

  const basePath = buildBasePath();
  const hasActiveFilters =
    !!searchTerm || !!sort || categoryFilterIds.length > 0;

  const seoTitle = initialSearch
    ? `Търсене на оригинални парфюми: "${initialSearch}" | DÉLIE`
    : 'Оригинални парфюми | DÉLIE';

  const seoDescription = initialSearch
    ? `Резултати за търсене на оригинални парфюми по "${initialSearch}". Намерени ${totalCount}.`
    : `Всички оригинални парфюми в DÉLIE. Общо ${totalCount}. Купете онлайн с доставка в цяла България.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        url={basePath}
        image="/parfumes_sell.png"
      />
      <Header />
      <Center>
        <Title>Всички парфюми</Title>
        <p style={{color:'#6b7280', marginTop: '-8px'}}>
          {searchTerm
            ? `Намерени ${totalCount} ${totalCount === 1 ? 'парфюм' : 'парфюма'}`
            : `Общо парфюми: ${totalCount}`}
        </p>
        
        <div style={{marginBottom: '20px'}}>
          <form
            onSubmit={handleSearch}
            style={{marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}
          >
            <input
              type="text"
              placeholder="Търси по име, бранд или описание..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{flex: '1 1 300px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minWidth: '200px'}}
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                background: primary,
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = primaryHover;
                e.currentTarget.style.color = '#1a1a1a';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(201, 162, 39, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = primary;
                e.currentTarget.style.color = '#1a1a1a';
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
                const params = new URLSearchParams();
                if (searchTerm.trim()) params.set('search', searchTerm.trim());
                if (e.target.value) params.set('sort', e.target.value);
                if (categoryFilterIds.length > 0) params.set('cat', categoryFilterIds.join(','));
                params.set('page', '1');
                router.push('/perfumes?' + params.toString());
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
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = primaryHover;
                  e.currentTarget.style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#6b7280';
                  e.currentTarget.style.color = 'white';
                }}
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
                gap: '8px 8px',
                marginBottom: '10px',
                fontSize: '0.8rem',
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
                      background: checked ? primarySoft : '#f3f4f6',
                      borderRadius: '999px',
                      padding: '5px 8px',
                      flex: '1 1 calc(33.333% - 8px)',
                      justifyContent: 'flex-start',
                      boxSizing: 'border-box',
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
                        if (next.length > 0) params.set('cat', next.join(','));
                        params.set('page', '1');
                        router.push('/perfumes?' + params.toString());
                      }}
                      style={{accentColor: primary}}
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div>Няма намерени парфюми.</div>
        ) : (
          <>
            <ProductsGrid products={products} />
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

export async function getServerSideProps({query, resolvedUrl}) {
  try {
    await mongooseConnect();

    const perfumeDept = await Category.findOne({
      $and: [
        { $or: [{ parent: { $exists: false } }, { parent: null }] },
        { $or: [{ slug: 'parfyumi' }, { name: 'Парфюми' }] },
      ],
    }).select('slug name');

    if (perfumeDept) {
      const slug = perfumeDept.slug || 'parfyumi';
      const qs = (resolvedUrl || '').includes('?')
        ? (resolvedUrl || '').slice((resolvedUrl || '').indexOf('?'))
        : '';
      return {
        redirect: {
          destination: `/category/${slug}${qs}`,
          permanent: true,
        },
      };
    }
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const search = query.search?.trim() || '';
    const sortParam = query.sort || '';
    const catParam = query.cat || '';
    const categoryFilterIds = catParam ? catParam.split(',') : [];

    let mongoQuery = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      mongoQuery.$or = [
        { title: regex },
        { description: regex },
        { brand: regex },
      ];
    }

    if (categoryFilterIds.length > 0) {
      mongoQuery.category = { $in: categoryFilterIds };
    }

    const totalCount = await Product.countDocuments(mongoQuery);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    let sortQuery = {};
    if (sortParam === 'price_asc') {
      sortQuery = { price: 1 };
    } else if (sortParam === 'price_desc') {
      sortQuery = { price: -1 };
    } else {
      sortQuery = { _id: -1 };
    }

    const [products, categories] = await Promise.all([
      Product.find(mongoQuery)
      .select(PRODUCT_FIELDS)
      .sort(sortQuery)
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean(),
      Category.find({})
        .select('name slug')
        .sort({ name: 1 })
        .lean(),
    ]);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        page: currentPage,
        totalPages,
        totalCount,
        search,
        sort: sortParam,
        categories: JSON.parse(JSON.stringify(categories)),
        initialCategoryFilterIds: categoryFilterIds,
      },
    };
  } catch (error) {
    console.error('Error fetching perfumes:', error.message);
    return {
      props: {
        products: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
        search: '',
        sort: '',
      },
    };
  }
}
