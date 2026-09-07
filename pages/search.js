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
import { paginateGroupedProducts } from "@/lib/productVariants";
import { attachProductPaths } from "@/lib/categories";
import { Category } from "@/models/Category";

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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function SearchPage({query, brand, products, page, totalPages, totalCount}) {
  const isBrand = !!brand;
  const label = isBrand ? brand : query;
  const basePath = isBrand
    ? `/search?brand=${encodeURIComponent(brand)}`
    : `/search?q=${encodeURIComponent(query)}`;
  const noun = totalCount === 1 ? 'продукт' : 'продукта';

  return (
    <>
      <SEO 
        title={isBrand ? `Оригинални парфюми ${brand} | DÉLIE` : `Търсене: "${query}" | DÉLIE`}
        description={isBrand
          ? `Оригинални парфюми от ${brand} в DÉLIE. Намерени ${totalCount}.`
          : `Търсене на оригинални парфюми по "${query}". Намерени ${totalCount}.`}
        keywords={isBrand
          ? `${brand}, оригинални парфюми, купи оригинален парфюм, DÉLIE`
          : `${query}, оригинални парфюми, DÉLIE`}
        url={basePath}
        image="/parfumes_sell.png"
      />
      <Header />
      <Center>
        <Title>{isBrand ? `Продукти от ${brand}` : 'Търсене'}</Title>
        <SearchSummary>
          {isBrand
            ? `${totalCount} ${noun}`
            : <>Резултати за: <strong>{label}</strong> ({totalCount} {noun})</>}
        </SearchSummary>
        {products.length === 0 ? (
          <EmptyState>
            {isBrand
              ? `Няма намерени продукти от ${brand}.`
              : 'Няма намерени продукти по тази заявка.'}
          </EmptyState>
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

export async function getServerSideProps({query}) {
  const searchQuery = query.q?.trim() || '';
  const brandQuery = query.brand?.trim() || '';
  if (!searchQuery && !brandQuery) {
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

    const mongoQuery = brandQuery
      ? { brand: new RegExp(`^${escapeRegex(brandQuery)}$`, 'i') }
      : {
          $or: [
            { title: new RegExp(escapeRegex(searchQuery), 'i') },
            { brand: new RegExp(escapeRegex(searchQuery), 'i') },
            { description: new RegExp(escapeRegex(searchQuery), 'i') },
          ]
        };

    const allProducts = await Product.find(mongoQuery)
      .select('slug title description images price compareAtPrice currency brand volume concentration gender stock category')
      .sort({_id: -1})
      .lean();
    const paged = paginateGroupedProducts(allProducts, { page, pageSize: PAGE_SIZE });
    const categories = await Category.find().select('_id slug name parent').lean();
    const products = attachProductPaths(paged.products, categories);

    return {
      props: {
        query: searchQuery,
        brand: brandQuery,
        products: JSON.parse(JSON.stringify(products)),
        page: paged.page,
        totalPages: paged.totalPages,
        totalCount: paged.totalCount,
      }
    };
  } catch (error) {
    console.error('Error in search getServerSideProps:', error);
    return {
      props: {
        query: searchQuery,
        brand: brandQuery,
        products: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
      }
    };
  }
}
