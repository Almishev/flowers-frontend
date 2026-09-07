import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Pagination from "@/components/Pagination";
import OffersFilters from "@/components/OffersFilters";
import { attachProductPaths, childrenOf, parentIdOf, sortDepartments } from "@/lib/categories";
import { hydrateVariantSiblings, variantKey } from "@/lib/productVariants";
import { categorySlug } from "@/lib/slugify";
import { fetchSaleProducts, SALE_PAGE_SIZE } from "@/lib/saleProducts";
import { buildCollectionStructuredData } from "@/lib/seo";

const Breadcrumb = styled.div`
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #c9a227;
    }
  }
`;

const Intro = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 24px;
`;

const IntroText = styled.p`
  margin: 0;
  color: #666;
  font-size: 1.05rem;
  line-height: 1.5;
`;

const ProductCount = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 14px;
  color: #495057;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

function productLabel(count) {
  return count === 1 ? 'продукт с намаление' : 'продукта с намаление';
}

function uniqueSaleCards(products) {
  const seen = new Set();
  return (products || []).filter((product) => {
    const key = product.volume ? variantKey(product) : String(product._id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function OffersPage({
  products,
  categories,
  totalCount = 0,
  page = 1,
  totalPages = 1,
  filters = {},
}) {
  const params = new URLSearchParams();
  if (filters.department) params.set('department', filters.department);
  if (filters.subcategory) params.set('subcategory', filters.subcategory);
  if (filters.sort) params.set('sort', filters.sort);
  const queryString = params.toString();
  const basePath = queryString ? `/offers?${queryString}` : '/offers';
  const hasFilters = !!(filters.department || filters.subcategory || filters.sort);
  const canonicalPath = page > 1
    ? `${basePath}${queryString ? '&' : '?'}page=${page}`
    : basePath;
  const title = 'Топ предложения – оригинални парфюми с намаление | DÉLIE';
  const description = 'Намаления на оригинални парфюми тестери, козметика и бижута в DÉLIE. Промоции с най-голяма отстъпка и доставка в цяла България.';

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords="топ предложения, намаления парфюми, промоции, оригинални парфюми тестери, парфюм онлайн, козметика намаление, бижута промоция, DÉLIE"
        url={canonicalPath}
        image="/parfumes_sell.png"
        breadcrumbs={[
          { name: 'Начало', url: '/' },
          { name: 'Топ предложения', url: '/offers' },
        ]}
        structuredData={buildCollectionStructuredData({
          title,
          description,
          path: canonicalPath,
          products,
          page,
          pageSize: SALE_PAGE_SIZE,
          totalCount,
        })}
      />
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Начало</Link>
          {' / '}
          Топ предложения
        </Breadcrumb>

        <Title>Топ предложения</Title>
        <Intro>
          <IntroText>
            Открийте най-изгодните оферти на DÉLIE – оригинални парфюми тестери в оригинални опаковки, козметика и бижута на промо цена. Започваме от продуктите с най-голяма отстъпка, с бърза доставка в цяла България.
          </IntroText>
          <ProductCount>
            {totalCount} {productLabel(totalCount)}
          </ProductCount>
        </Intro>

        <OffersFilters
          categories={categories}
          department={filters.department || ''}
          subcategory={filters.subcategory || ''}
          sort={filters.sort || ''}
        />

        {products.length === 0 ? (
          <NoProducts>
            {hasFilters
              ? 'Няма намалени продукти по избраните филтри.'
              : 'В момента няма продукти с намаление.'}
          </NoProducts>
        ) : (
          <>
            <ProductsGrid products={products} />
            <Pagination page={page} totalPages={totalPages} basePath={basePath} />
          </>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  const empty = {
    products: [],
    categories: [],
    totalCount: 0,
    page: 1,
    totalPages: 1,
    filters: { department: '', subcategory: '', sort: '' },
  };

  try {
    await mongooseConnect();

    const departmentSlug = String(context.query.department || '').trim();
    const subcategorySlug = String(context.query.subcategory || '').trim();
    const sortParam = String(context.query.sort || '').trim();
    const pageParam = parseInt(context.query.page, 10);

    const categories = await Category.find()
      .select('_id slug name parent navOrder')
      .lean();
    const departments = sortDepartments(categories);

    let selectedDept = departments.find((dept) => categorySlug(dept) === departmentSlug) || null;
    let selectedSub = categories.find((cat) => {
      if (!parentIdOf(cat)) return false;
      return categorySlug(cat) === subcategorySlug;
    }) || null;

    if (selectedSub && selectedDept && parentIdOf(selectedSub) !== String(selectedDept._id)) {
      selectedSub = null;
    }
    if (selectedSub && !selectedDept) {
      selectedDept = categories.find((cat) => String(cat._id) === parentIdOf(selectedSub)) || null;
    }

    let categoryIds = null;
    if (selectedSub) {
      categoryIds = [selectedSub._id];
    } else if (selectedDept) {
      categoryIds = [selectedDept._id, ...childrenOf(categories, selectedDept._id).map((cat) => cat._id)];
    }

    const paged = await fetchSaleProducts(Product, {
      categoryIds,
      sort: sortParam,
      page: pageParam,
      pageSize: SALE_PAGE_SIZE,
    });

    const withSiblings = await hydrateVariantSiblings(Product, paged.products);
    const products = attachProductPaths(uniqueSaleCards(withSiblings), categories);

    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
        categories: JSON.parse(JSON.stringify(categories)),
        totalCount: paged.totalCount,
        page: paged.page,
        totalPages: paged.totalPages,
        filters: {
          department: selectedDept ? categorySlug(selectedDept) : '',
          subcategory: selectedSub ? categorySlug(selectedSub) : '',
          sort: sortParam,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return { props: empty };
  }
}
