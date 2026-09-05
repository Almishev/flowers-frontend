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
import {categoryPath} from "@/lib/slugify";
import {childrenOf, parentIdOf, productNoun, sortDepartments, isPerfumeDepartment} from "@/lib/categories";

const DepartmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 20px;
`;

const DepartmentCard = styled.section`
  background-color: #fff;
  padding: 24px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const DepartmentHeader = styled(Link)`
  display: flex;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  align-items: center;
  margin-bottom: 16px;
`;

const DepartmentTitle = styled.h2`
  margin: 0 0 6px 0;
  font-size: 1.5rem;
`;

const Meta = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.95rem;
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const SubCard = styled(Link)`
  background: #f8f9fa;
  padding: 14px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #eee;

  &:hover {
    border-color: #c9a227;
    color: #c9a227;
  }
`;

export default function CategoriesPage({departments, allCategories}) {
  return (
    <>
      <SEO 
        title="Категории"
        description="Разгледайте отделите на DÉLIE – оригинални парфюми, козметика и бижута."
        keywords="оригинални парфюми, категории, козметика, бижута, DÉLIE"
        url="/categories"
        image="/parfumes_sell.png"
      />
      <Header />
      <Center>
        <Title>Отдели</Title>
        {departments.length === 0 ? (
          <div>Няма намерени отдели.</div>
        ) : (
          <DepartmentList>
            {departments.map(department => {
              const children = childrenOf(allCategories, department._id);
              return (
                <DepartmentCard key={department._id}>
                  <DepartmentHeader href={categoryPath(department)}>
                    {department.image && (
                      <Image
                        src={department.image}
                        alt={department.name}
                        width={120}
                        height={90}
                        style={{objectFit: 'cover', borderRadius: 8, background: '#f3f3f3'}}
                        unoptimized={department.image?.includes('s3.amazonaws.com')}
                      />
                    )}
                    <div>
                      <DepartmentTitle>{department.name}</DepartmentTitle>
                      <Meta>
                        {department.productCount || 0} {productNoun(department.productCount || 0, {perfume: isPerfumeDepartment(department)})}
                      </Meta>
                    </div>
                  </DepartmentHeader>
                  {children.length > 0 && (
                    <SubGrid>
                      {children.map(child => (
                        <SubCard key={child._id} href={categoryPath(child)}>
                          <strong>{child.name}</strong>
                          <Meta>
                            {child.productCount || 0} {productNoun(child.productCount || 0, {perfume: isPerfumeDepartment(department)})}
                          </Meta>
                        </SubCard>
                      ))}
                    </SubGrid>
                  )}
                </DepartmentCard>
              );
            })}
          </DepartmentList>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();
    const categories = await Category.find().populate('parent').lean();
    const childIdsByParent = {};
    categories.forEach((category) => {
      const parentId = parentIdOf(category);
      if (!parentId) return;
      if (!childIdsByParent[parentId]) childIdsByParent[parentId] = [];
      childIdsByParent[parentId].push(category._id);
    });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const isRoot = !category.parent;
        const ids = isRoot
          ? [category._id, ...(childIdsByParent[String(category._id)] || [])]
          : [category._id];
        const productCount = await Product.countDocuments({category: {$in: ids}});
        return {...category, productCount};
      })
    );

    const departments = sortDepartments(categoriesWithCounts);

    return {
      props: {
        departments: JSON.parse(JSON.stringify(departments)),
        allCategories: JSON.parse(JSON.stringify(categoriesWithCounts)),
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        departments: [],
        allCategories: [],
      }
    };
  }
}
