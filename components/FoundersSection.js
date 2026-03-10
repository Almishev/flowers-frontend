import styled from "styled-components";
import Image from "next/image";

const FoundersContainer = styled.div`
  margin-top: 50px;
  padding-top: 50px;
  border-top: 2px solid #e5e7eb;
  width: 100%;
`;

const FoundersTitle = styled.h3`
  font-size: 1.8rem;
  margin: 0 0 40px;
  font-weight: 600;
  text-align: center;
  color: #111;
`;

const FoundersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  max-width: 700px;
  margin: 0 auto;
`;

const FounderCard = styled.div`
  text-align: center;
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
`;

const PhotoWrapper = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #16a34a;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FounderPhoto = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderPhoto = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #166534 0%, #22c55e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
`;

const FounderName = styled.h4`
  font-size: 1.4rem;
  margin: 0 0 10px;
  color: #111;
  font-weight: 600;
`;

const FounderPhone = styled.a`
  display: block;
  font-size: 1.1rem;
  color: #16a34a;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  
  &:hover {
    color: #16a34a;
    text-decoration: underline;
  }
`;

const FounderBio = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #555;
  text-align: left;
  margin: 0;
`;

const founders = [
  {
    name: "Марияна Алексова",
    phone: "0898690246",
    bio: "Марияна Алексова е създателят на Flowers Boutique MIA – бутикова цветарница, посветена на това да превръща емоциите в красиви букети и декорации. Тя подбира внимателно всяко цвете, всяка кошница и всеки детайл, за да създаде персонални аранжировки за сватби, рождени дни, годишнини, корпоративни събития и уютен дом. Вярва, че правилно подбраният букет може да каже повече от хиляди думи и подхожда към всяка поръчка с лично внимание и усет към стила. Научете повече за нас.",
    initial: "МА",
    image: "https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/mia+(1).jpg",
  },
];

export default function FoundersSection() {
  return (
    <FoundersContainer>
      <FoundersTitle>Нашият екип</FoundersTitle>
      <FoundersGrid>
        {founders.map((founder, index) => (
          <FounderCard key={index}>
            <PhotoWrapper>
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={200}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              ) : (
                <PlaceholderPhoto>
                  {founder.initial}
                </PlaceholderPhoto>
              )}
            </PhotoWrapper>
            <FounderName>{founder.name}</FounderName>
            <FounderPhone href={`tel:+359${founder.phone.substring(1)}`}>
              {founder.phone}
            </FounderPhone>
            <FounderBio>{founder.bio}</FounderBio>
          </FounderCard>
        ))}
      </FoundersGrid>
    </FoundersContainer>
  );
}

