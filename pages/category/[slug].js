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
import { slugify, categorySlug, categoryPath } from "@/lib/slugify";
import { isPerfumeDepartment, productNoun } from "@/lib/categories";

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

export default function CategoryPage({category, products, parentCategory, childCategories, isRoot}) {
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
  const noun = productNoun(products.length, {perfume});
  const itemWord = perfume ? 'парфюми' : 'продукти';

  return (
    <>
      <SEO 
        title={`${category.name} – ${isRoot ? 'отдел' : 'категория'}`}
        description={`${itemWord.charAt(0).toUpperCase() + itemWord.slice(1)} в „${category.name}“. ${products.length} налични.`}
        keywords={`${category.name}, ${itemWord}, DÉLIE`}
        url={categoryPath(category)}
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
            {products.length} {noun} в {isRoot ? 'този отдел' : 'тази категория'}
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

        {products.length === 0 ? (
          <NoProducts>
            Няма намерени {itemWord} в тази категория.
          </NoProducts>
        ) : (
          <ProductsGrid products={products} />
        )}
      </Center>
      <Footer />
    </>
  );
}

const PRODUCT_FIELDS = 'slug title description images price currency brand volume concentration gender stock category';

export async function getServerSideProps(context) {
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
      return {
        props: {
          category: null,
          products: [],
          parentCategory: null,
          childCategories: [],
          isRoot: false,
        }
      };
    }

    const canonicalSlug = categorySlug(category);
    if (canonicalSlug && slug !== canonicalSlug) {
      return {
        redirect: {
          destination: `/category/${canonicalSlug}`,
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

    const products = await Product.find({category: {$in: queryIds}}).select(PRODUCT_FIELDS);
    
    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(products)),
        parentCategory: category.parent ? JSON.parse(JSON.stringify(category.parent)) : null,
        childCategories: JSON.parse(JSON.stringify(childDocs)),
        isRoot,
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: null,
        products: [],
        parentCategory: null,
        childCategories: [],
        isRoot: false,
      }
    };
  }
}
