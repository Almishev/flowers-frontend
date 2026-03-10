import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Image from "next/image";
import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import Link from "next/link";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const CategoryCard = styled(Link)`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

// CategoryImage е заменен с Next.js Image component

const CategoryTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const ProductCount = styled.span`
  display: inline-block;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-top: 10px;
`;

export default function CategoriesPage({categories}) {
  return (
    <>
      <SEO 
        title="Категории екскурзии"
        description={`Категории екскурзии – почивки, уикенд пътувания, city break и други.`}
        keywords="категории екскурзии, почивки, уикенд, city break, туристическа агенция"
        url="/categories"
        image="/logo.png"
      />
      <Header />
      <Center>
        <Title>Категории екскурзии</Title>
        {categories.length === 0 ? (
          <div>Няма намерени категории.</div>
        ) : (
          <CategoryGrid>
            {categories.map(category => (
              <CategoryCard key={category._id} href={`/category/${category.slug || category._id}`}>
                {category.image && (
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    width={200}
                    height={140}
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      background: '#f3f3f3',
                    }}
                    loading="lazy"
                    unoptimized={category.image?.includes('s3.amazonaws.com')}
                  />
                )}
                <CategoryTitle>{category.name}</CategoryTitle>
                <CategoryDescription>
                  {category.parent ? `Подкатегория на ${category.parent.name}` : 'Основна категория'}
                </CategoryDescription>
                <ProductCount>
                  {category.productCount || 0} екскурзии
                </ProductCount>
              </CategoryCard>
            ))}
          </CategoryGrid>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();
    
    // Взимаме всички категории с техните родители
    const categories = await Category.find().populate('parent');
    
    // Добавяме брой продукти за всяка категория
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({category: category._id});
        return {
          ...category.toObject(),
          productCount
        };
      })
    );
    
    return {
      props: {
        categories: JSON.parse(JSON.stringify(categoriesWithCounts)),
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
      }
    };
  }
}
