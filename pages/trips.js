import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import SEO from "@/components/SEO";

const PAGE_SIZE = 20;

import {useRouter} from "next/router";
import {useState} from "react";

export default function TripsPage({
  trips,
  page,
  totalPages,
  totalCount,
  search: initialSearch,
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');

  function handleSearch(e) {
    e.preventDefault();
    applyFilters();
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    params.set('page', '1'); // Reset to page 1 on new filters
    router.push('/bouquets?' + params.toString());
  }


  function clearFilters() {
    setSearchTerm('');
    router.push('/bouquets');
  }

  // Build base path for pagination (preserves all filters)
  function buildBasePath() {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    const queryString = params.toString();
    return queryString ? `/bouquets?${queryString}` : '/bouquets';
  }

  const basePath = buildBasePath();
  const hasActiveFilters = !!searchTerm;

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
        image="/logo-shop-flowers.png"
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
          <form onSubmit={handleSearch} style={{marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
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

    const totalCount = await Product.countDocuments(mongoQuery);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const trips = await Product.find(mongoQuery)
      .select('slug title price currency images category status isFeatured description')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(PAGE_SIZE)
      .lean();

    return {
      props: {
        trips: JSON.parse(JSON.stringify(trips)),
        page: currentPage,
        totalPages,
        totalCount,
        search,
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
      },
    };
  }
}