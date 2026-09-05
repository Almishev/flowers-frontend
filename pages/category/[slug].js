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
import CategoryFilters from "@/components/CategoryFilters";
import { slugify, categorySlug, categoryPath } from "@/lib/slugify";
import { isPerfumeDepartment, productNoun } from "@/lib/categories";

const PAGE_SIZE = 20;

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function uniqueBrands(list) {
  const seen = new Set();
  const result = [];
  for (const raw of list || []) {
    const name = String(raw || '').trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(name);
  }
  return result.sort((a, b) => a.localeCompare(b, 'bg'));
}

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

const CategoryInfo = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const CategoryName = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2rem;
  color: #333;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 1.1rem;
`;

const ProductCount = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 15px;
  color: #495057;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const Chip = styled(Link)`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 6px 12px;
  text-decoration: none;
  color: #333;
  font-size: 0.9rem;

  &:hover {
    border-color: #c9a227;
    color: #c9a227;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export default function CategoryPage({
  category,
  products,
  parentCategory,
  childCategories,
  isRoot,
  brands = [],
  totalCount = 0,
  page = 1,
  totalPages = 1,
  filters = {},
}) {
  if (!category) {
    return (
      <>
        <Header />
        <Center>
          <Title>Категорията не е намерена</Title>
          <p>Категорията, която търсите, не съществува.</p>
          <Link href="/categories">← Назад към категориите</Link>
        </Center>
        <Footer />
      </>
    );
  }

  const department = isRoot ? category : parentCategory;
  const perfume = isPerfumeDepartment(department);
  const noun = productNoun(totalCount, {perfume});
  const itemWord = perfume ? 'парфюми' : 'продукти';
  const path = categoryPath(category);
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.minPrice) params.set('min', filters.minPrice);
  if (filters.maxPrice) params.set('max', filters.maxPrice);
  if (filters.sort) params.set('sort', filters.sort);
  const queryString = params.toString();
  const basePath = queryString ? `${path}?${queryString}` : path;
  const hasFilters = !!(filters.search || filters.brand || filters.minPrice || filters.maxPrice || filters.sort);

  return (
    <>
      <SEO 
        title={`${category.name} – ${isRoot ? 'отдел' : 'категория'}`}
        description={`${itemWord.charAt(0).toUpperCase() + itemWord.slice(1)} в „${category.name}“. ${totalCount} налични.`}
        keywords={`${category.name}, ${itemWord}, DÉLIE`}
        url={path}
        image="/parfumes_sell.png"
      />
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Начало</Link>
          {' / '}
          <Link href="/categories">Отдели</Link>
          {parentCategory && (
            <>
              {' / '}
              <Link href={categoryPath(parentCategory)}>{parentCategory.name}</Link>
            </>
          )}
          {' / '}
          {category.name}
        </Breadcrumb>
        
        <CategoryInfo>
          <CategoryName>{category.name}</CategoryName>
          {parentCategory && (
            <CategoryDescription>
              Подкатегория на: <strong>{parentCategory.name}</strong>
            </CategoryDescription>
          )}
          <ProductCount>
            {totalCount} {noun} в {isRoot ? 'този отдел' : 'тази категория'}
          </ProductCount>
          {isRoot && childCategories?.length > 0 && (
            <Chips>
              {childCategories.map(child => (
                <Chip key={child._id} href={categoryPath(child)}>
                  {child.name}
                </Chip>
              ))}
            </Chips>
          )}
        </CategoryInfo>

        <CategoryFilters
          basePath={path}
          brands={brands}
          search={filters.search || ''}
          brand={filters.brand || ''}
          minPrice={filters.minPrice || ''}
          maxPrice={filters.maxPrice || ''}
          sort={filters.sort || ''}
        />

        {products.length === 0 ? (
          <NoProducts>
            {hasFilters
              ? `Няма намерени ${itemWord} по избраните филтри.`
              : `Няма намерени ${itemWord} в тази категория.`}
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

const PRODUCT_FIELDS = 'slug title description images price currency brand volume concentration gender stock category';

export async function getServerSideProps(context) {
  const empty = {
    category: null,
    products: [],
    parentCategory: null,
    childCategories: [],
    isRoot: false,
    brands: [],
    totalCount: 0,
    page: 1,
    totalPages: 1,
    filters: {search: '', brand: '', minPrice: '', maxPrice: '', sort: ''},
  };

  try {
    await mongooseConnect();
    const {slug} = context.query;
    
    let category = await Category.findOne({ slug }).populate('parent');

    if (!category) {
      const allCategories = await Category.find().populate('parent');
      category = allCategories.find((cat) => slugify(cat.name) === slug) || null;
    }

    if (!category && slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
      category = await Category.findById(slug).populate('parent');
    }
    
    if (!category) {
      return { props: empty };
    }

    const canonicalSlug = categorySlug(category);
    if (canonicalSlug && slug !== canonicalSlug) {
      const qs = (context.resolvedUrl || '').includes('?')
        ? (context.resolvedUrl || '').slice((context.resolvedUrl || '').indexOf('?'))
        : '';
      return {
        redirect: {
          destination: `/category/${canonicalSlug}${qs}`,
          permanent: true,
        },
      };
    }

    const isRoot = !category.parent;
    const childDocs = isRoot
      ? await Category.find({ parent: category._id }).sort({ name: 1 })
      : [];
    const queryIds = isRoot
      ? [category._id, ...childDocs.map(child => child._id)]
      : [category._id];

    const search = context.query.search?.trim() || '';
    const brand = context.query.brand?.trim() || '';
    const minRaw = context.query.min?.toString().trim() || '';
    const maxRaw = context.query.max?.toString().trim() || '';
    const sortParam = context.query.sort || '';
    const minPrice = minRaw !== '' && !Number.isNaN(Number(minRaw)) ? Number(minRaw) : null;
    const maxPrice = maxRaw !== '' && !Number.isNaN(Number(maxRaw)) ? Number(maxRaw) : null;

    const mongoQuery = { category: { $in: queryIds } };
    const extra = [];
    if (search) {
      extra.push({ title: new RegExp(escapeRegex(search), 'i') });
    }
    if (brand) {
      extra.push({ brand: new RegExp(`^${escapeRegex(brand)}$`, 'i') });
    }
    if (extra.length === 1) Object.assign(mongoQuery, extra[0]);
    if (extra.length > 1) mongoQuery.$and = extra;
    if (minPrice !== null || maxPrice !== null) {
      mongoQuery.price = {};
      if (minPrice !== null) mongoQuery.price.$gte = minPrice;
      if (maxPrice !== null) mongoQuery.price.$lte = maxPrice;
    }

    let sortQuery = { _id: -1 };
    if (sortParam === 'price_asc') sortQuery = { price: 1 };
    else if (sortParam === 'price_desc') sortQuery = { price: -1 };
    else if (sortParam === 'name_asc') sortQuery = { title: 1 };
    else if (sortParam === 'name_desc') sortQuery = { title: -1 };

    const pageParam = parseInt(context.query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);

    const [totalCount, rawBrands] = await Promise.all([
      Product.countDocuments(mongoQuery),
      Product.distinct('brand', {
        category: { $in: queryIds },
        brand: { $nin: ['', null] },
      }),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    const products = await Product.find(mongoQuery)
      .select(PRODUCT_FIELDS)
      .sort(sortQuery)
      .skip(skip)
      .limit(PAGE_SIZE);
    
    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(products)),
        parentCategory: category.parent ? JSON.parse(JSON.stringify(category.parent)) : null,
        childCategories: JSON.parse(JSON.stringify(childDocs)),
        isRoot,
        brands: uniqueBrands(rawBrands),
        totalCount,
        page: currentPage,
        totalPages,
        filters: {
          search,
          brand,
          minPrice: minRaw,
          maxPrice: maxRaw,
          sort: sortParam,
        },
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { props: empty };
  }
}
