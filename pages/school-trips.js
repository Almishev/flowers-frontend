import styled from "styled-components";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.05rem;
  color: #333;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-top: 50px;
  margin-bottom: 20px;
  font-weight: 600;
  color: #111;
  
  &:first-of-type {
    margin-top: 30px;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 20px;
  text-align: justify;
  font-size: 1.05rem;
`;

const HighlightBox = styled.div`
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin: 30px 0;
  border-left: 4px solid #b8860b;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const ServiceCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-top: 3px solid #b8860b;
  
  h3 {
    color: #b8860b;
    margin-bottom: 15px;
    font-size: 1.3rem;
  }
  
  ul {
    padding-left: 20px;
    margin: 0;
    
    li {
      margin-bottom: 8px;
      color: #555;
    }
  }
`;

const TripsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin: 40px 0;
`;

const TripCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .content {
    padding: 20px;
    
    h3 {
      margin: 0 0 10px 0;
      color: #111;
      font-size: 1.2rem;
    }
    
    p {
      color: #666;
      margin: 0 0 15px 0;
      font-size: 0.95rem;
    }
  }
`;

const AnimatedSection = styled.div`
  ${props => props.style}
`;

const CTAContainer = styled.div`
  margin-top: 20px;
`;

export default function SchoolTripsPage({schoolTrips}) {
  const servicesAnimation = useScrollAnimation({ animation: 'slideUp', delay: 200 });
  const tripsAnimation = useScrollAnimation({ animation: 'slideUp', delay: 400 });

  return (
    <>
      <SEO 
        title="Ученически екскурзии и зелени училища | Туристическа агенция Гоце Делчев, Гърмен"
        description="Специализирана туристическа агенция за ученически екскурзии и зелени училища в Гоце Делчев и Гърмен. Организираме образователни пътувания, културно-исторически турове и групови екскурзии за училища."
        keywords="ученически екскурзии, зелени училища, туристическа агенция за училища, образователни екскурзии, групови екскурзии, туристическа агенция Гоце Делчев, туристическа агенция Гърмен, екскурзии за ученици"
        url="/school-trips"
        image="/logo.png"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'Ученически екскурзии и зелени училища',
            provider: {
              '@type': 'TravelAgency',
              name: 'Friendly Travel',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Гоце Делчев',
                addressRegion: 'Благоевград',
                addressCountry: 'BG'
              }
            },
            areaServed: ['Гоце Делчев', 'Гърмен', 'Благоевград'],
            description: 'Организиране на ученически екскурзии, зелени училища и образователни пътувания за училища'
          }
        ]}
      />
      <Header />
      <Center>
        <Title>Ученически екскурзии и зелени училища</Title>
        <ContentWrapper>
          <div>
            <Paragraph>
              <strong>Friendly Travel</strong> е специализирана туристическа агенция за ученически екскурзии и зелени училища на територията на цялата страна. 
              С дългогодишен опит в образователната система, нашият екип разбира специфичните изисквания на училищата и учениците, 
              което ни позволява да създаваме персонализирани програми, които отговарят на образователните цели.
            </Paragraph>
            <Paragraph>
              Като туристическа агенция за училища, ние предлагаме широк спектър от услуги - от еднодневни образователни екскурзии 
              до многодневни зелени училища и културно-исторически турове. Всяка наша програма е внимателно обмислена, за да 
              допълва формалното обучение с практически знания и незабравими спомени.
            </Paragraph>
          </div>

          <AnimatedSection ref={servicesAnimation.ref} style={servicesAnimation.style}>
            <SectionTitle>Какво предлагаме като туристическа агенция за училища</SectionTitle>
            <ServicesGrid>
              <ServiceCard>
                <h3>Зелени училища</h3>
                <ul>
                  <li>Многодневни образователни програми</li>
                  <li>Природонаучни екскурзии</li>
                  <li>Екологично образование</li>
                  <li>Тимбилдинг дейности</li>
                </ul>
              </ServiceCard>
              <ServiceCard>
                <h3>Образователни екскурзии</h3>
                <ul>
                  <li>Културно-исторически турове</li>
                  <li>Музейни визити</li>
                  <li>Археологически обекти</li>
                  <li>Природни забележителности</li>
                </ul>
              </ServiceCard>
              <ServiceCard>
                <h3>Групови пътувания</h3>
                <ul>
                  <li>Еднодневни екскурзии</li>
                  <li>Уикенд пътувания</li>
                  <li>Международни екскурзии</li>
                  <li>Спортни турнири</li>
                </ul>
              </ServiceCard>
            </ServicesGrid>

            <HighlightBox>
              <SectionTitle>Защо да изберете Friendly Travel за ученически екскурзии?</SectionTitle>
              <Paragraph>
                Като туристическа агенция за ученически екскурзии в <strong>Гоце Делчев</strong> и <strong>Гърмен</strong>, 
                ние разбираме важността на безопасността, образователната стойност и качеството на услугите. 
                Работим с проверени партньори за транспорт и настаняване, а нашите екскурзоводи са сертифицирани 
                специалисти в своите области.
              </Paragraph>
              <Paragraph>
                Нашият екип се състои от опитни преподаватели, които обединяват професионалния си опит в образованието 
                с страстта си към пътуванията. Това ни позволява да създаваме програми, които не само развлекават, 
                но и обогатяват знанията на учениците.
              </Paragraph>
            </HighlightBox>
          </AnimatedSection>

          {schoolTrips && schoolTrips.length > 0 && (
            <AnimatedSection ref={tripsAnimation.ref} style={tripsAnimation.style}>
              <SectionTitle>Предложения за ученически екскурзии</SectionTitle>
              <TripsGrid>
                {schoolTrips.map(trip => (
                  <Link key={trip._id} href={`/trip/${trip.slug || trip._id}`}>
                    <TripCard>
                      {trip.images?.[0] && (
                        <img 
                          src={trip.images[0]} 
                          alt={trip.title}
                          onError={(e) => {
                            e.target.src = '/logo.png';
                          }}
                        />
                      )}
                      <div className="content">
                        <h3>{trip.title}</h3>
                        {trip.description && (
                          <p>{trip.description.substring(0, 120)}...</p>
                        )}
                        {trip.destinationCity && trip.destinationCountry && (
                          <p style={{color: '#b8860b', fontWeight: '500'}}>
                            {trip.destinationCity}, {trip.destinationCountry}
                          </p>
                        )}
                      </div>
                    </TripCard>
                  </Link>
                ))}
              </TripsGrid>
            </AnimatedSection>
          )}

          <div>
            <HighlightBox>
              <SectionTitle>Свържете се с нас</SectionTitle>
              <Paragraph>
                Ако търсите туристическа агенция за ученически екскурзии в <strong>Гоце Делчев</strong> или <strong>Гърмен</strong>, 
                не се колебайте да се свържете с нас. Ще създадем персонализирана програма, която отговаря на нуждите на вашето училище.
              </Paragraph>
              <Paragraph>
                <strong>Телефон:</strong> +359 896 178 447<br />
                <strong>Email:</strong> officefriendlytravel@gmail.com<br />
                <strong>Адрес:</strong> град Гоце Делчев, община Гоце Делчев, България
              </Paragraph>
              <CTAContainer>
                <ButtonLink href="/trips" primary size="l">Вижте всички екскурзии</ButtonLink>
              </CTAContainer>
            </HighlightBox>
          </div>
        </ContentWrapper>
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();
    
    // Взимаме екскурзии, които са подходящи за ученически екскурзии
    // Филтрираме по title и description, защото category е ObjectId
    const schoolTrips = await Product.find({
      $or: [
        { title: { $regex: /ученическ|школ|образователн|зелено училище/i } },
        { description: { $regex: /ученическ|школ|образователн|зелено училище/i } }
      ],
      status: 'published' // Само публикувани екскурзии
    }).select('slug title description images destinationCountry destinationCity price currency availableSeats maxSeats category status startDate endDate durationDays travelType isFeatured departureCity').limit(6).lean();

    return {
      props: {
        schoolTrips: JSON.parse(JSON.stringify(schoolTrips)),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        schoolTrips: [],
      },
    };
  }
}

