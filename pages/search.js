import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import SEO from "@/components/SEO";

const PAGE_SIZE = 20;

const SearchSummary = styled.p`
  color: #4b5563;
  margin-top: -10px;
`;

const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: #6b7280;
`;

export default function SearchPage({query, trips, page, totalPages, totalCount}) {
  const basePath = `/search?q=${encodeURIComponent(query)}`;

  return (
    <>
      <SEO 
        title={`Търсене: "${query}"`}
        description={`Търсене на екскурзии по "${query}". Намерени ${totalCount}.`}
        url={`/search?q=${encodeURIComponent(query)}`}
        image="/logo.png"
      />
      <Header />
      <Center>
        <Title>Търсене</Title>
        <SearchSummary>
          Резултати за: <strong>{query}</strong> ({totalCount} {totalCount === 1 ? 'екскурзия' : 'екскурзии'})
        </SearchSummary>
        {trips.length === 0 ? (
          <EmptyState>Няма намерени екскурзии по тази заявка.</EmptyState>
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
  const searchQuery = query.q?.trim() || '';
  if (!searchQuery) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    await mongooseConnect();
    
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const skip = (page - 1) * PAGE_SIZE;

    const regex = new RegExp(searchQuery, 'i');
    const mongoQuery = {
      $or: [
        { title: regex },
        { destinationCountry: regex },
        { destinationCity: regex },
        { departureCity: regex },
        { description: regex },
      ]
    };

    const totalCount = await Product.countDocuments(mongoQuery);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const currentSkip = (currentPage - 1) * PAGE_SIZE;

    const trips = await Product.find(mongoQuery, null, {
      sort: {'_id': -1},
      skip: currentSkip,
      limit: PAGE_SIZE,
    }).lean();

    return {
      props: {
        query: searchQuery,
        trips: JSON.parse(JSON.stringify(trips)),
        page: currentPage,
        totalPages,
        totalCount,
      }
    };
  } catch (error) {
    console.error('Error in search getServerSideProps:', error);
    return {
      props: {
        query: searchQuery,
        trips: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
      }
    };
  }
}

