import styled from "styled-components";
import Center from "@/components/Center";
import Link from "next/link";

const SectionWrapper = styled.section`
  background: #f9fafb;
  padding: 40px 0 20px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin: 0 0 24px 0;
  font-weight: 600;
  color: #111827;
  text-align: center;
`;

const SeeAllLink = styled(Link)`
  display: inline-flex;
  font-size: 0.95rem;
  color: #16a34a;
  text-decoration: none;
  font-weight: 500;
  align-items: center;
  justify-content: center;

  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Card = styled(Link)`
  background: #ffffff;
  border-radius: 12px;
  padding: 18px 18px 16px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
    border-color: #d1d5db;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 140px;
  border-radius: 10px;
  background: #f3f4f6;
  overflow: hidden;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryName = styled.h3`
  margin: 0 0 6px 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
`;

const CategoryMeta = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

export default function PopularCategoriesHome({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <SectionWrapper>
      <Center>
        <Title>Популярни категории букети</Title>
        <Grid>
          {categories.map((cat) => (
            <Card
              key={cat._id}
              href={`/category/${cat.slug || cat._id}`}
            >
              <ImageWrapper>
                {cat.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                    Категория букет
                  </span>
                )}
              </ImageWrapper>
              <CategoryName>{cat.name}</CategoryName>
              <CategoryMeta>
                {typeof cat.productCount === "number"
                  ? `${cat.productCount} ${cat.productCount === 1 ? "букет" : "букета"}`
                  : "Букети в тази категория"}
              </CategoryMeta>
            </Card>
          ))}
        </Grid>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <SeeAllLink href="/categories">Виж всички категории</SeeAllLink>
        </div>
      </Center>
    </SectionWrapper>
  );
}

