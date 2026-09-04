import styled from "styled-components";
import Link from "next/link";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FoundersSection from "@/components/FoundersSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.05rem;
  color: #333;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-top: 40px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #111;
  
  &:first-of-type {
    margin-top: 30px;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 20px;
  text-align: justify;
`;

const Motto = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #c9a227;
  font-weight: 500;
  text-align: center;
  margin: 15px 0 30px;
`;

const ServicesList = styled.ul`
  padding-left: 20px;
  margin-bottom: 30px;
  
  li {
    margin-bottom: 10px;
  }
`;

const DeliveryHighlight = styled.div`
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin: 30px 0;
  border-left: 4px solid #c9a227;
`;

const ContactInfo = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #e5e7eb;
  
  p {
    margin-bottom: 10px;
  }
  
  strong {
    color: #111;
  }
`;

const ClosingText = styled.p`
  margin-top: 30px;
  font-style: italic;
  color: #666;
  text-align: center;
`;

const AnimatedSection = styled.div`
  ${props => props.style}
`;

export default function AboutPage() {
  const introAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const mottoAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 200 });
  const teamAnimation = useScrollAnimation({ animation: 'slideUp', delay: 400 });
  const missionAnimation = useScrollAnimation({ animation: 'slideUp', delay: 600 });
  const deliveryAnimation = useScrollAnimation({ animation: 'slideUp', delay: 800 });
  const servicesAnimation = useScrollAnimation({ animation: 'slideUp', delay: 1000 });
  const foundersAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 1200 });
  const contactAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 1400 });

  return (
    <>
      <SEO 
        title="За нас | DÉLIE - онлайн магазин за парфюми"
        description="DÉLIE е парфюмен бутик с дамски, мъжки, унисекс, арабски и нишови аромати. Подбрани парфюми с доставка в цяла България."
        keywords="DÉLIE, парфюмен бутик, дамски парфюми, мъжки парфюми, унисекс, арабски парфюми, нишови парфюми"
        url="/about"
        image="/parfumes_sell.png"
      />
      <Header />
      <Center>
        <Title>За нас</Title>
        <ContentWrapper>
          <AnimatedSection ref={introAnimation.ref} style={introAnimation.style}>
            <SectionTitle>DÉLIE</SectionTitle>
            <Paragraph>
              DÉLIE е <strong>парфюмен бутик</strong>, създаден с идеята всеки аромат да носи характер. 
              При нас ще откриете дамски, мъжки, унисекс, арабски и нишови парфюми – внимателно подбрани, за да разкажат вашата история.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={mottoAnimation.ref} style={mottoAnimation.style}>
            <Motto>&quot;Всеки аромат е спомен&quot;</Motto>
          </AnimatedSection>

          <AnimatedSection ref={teamAnimation.ref} style={teamAnimation.style}>
            <SectionTitle>Собственик и визия</SectionTitle>
            <Paragraph>
              Зад DÉLIE стои <strong>Даниела Делиева</strong> – която вярва, че детайлите правят всеки жест специален. 
              Нейният усет към стила се превръща в внимателно подбрана колекция от класически и нишови аромати.
            </Paragraph>
            <Paragraph>
              Всяка поръчка се подготвя с лично отношение – от избора на парфюм до опаковката. 
              Целта ни е клиентът да получи не просто продукт, а <strong>преживяване</strong> – за подарък, повод или ежедневие.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={missionAnimation.ref} style={missionAnimation.style}>
            <SectionTitle>Нашата мисия</SectionTitle>
            <Paragraph>
              Мисията на DÉLIE е да помогне да откриете аромата, който ви представя. Вярваме, че правилният парфюм може да каже повече от думи.
            </Paragraph>
            <Paragraph>
              Предлагаме разнообразие от композиции – от свежи и леки до наситени арабски и нишови аромати. 
              Независимо дали търсите класика или нещо рядко, ще ви помогнем да намерите точния вариант.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={deliveryAnimation.ref} style={deliveryAnimation.style}>
            <DeliveryHighlight>
              <SectionTitle>Доставка в цяла България</SectionTitle>
              <Paragraph>
                Изпращаме поръчките с надеждни куриерски партньори до всяка точка на страната. 
                Така можете да зарадвате себе си или любим човек – ние ще се погрижим парфюмът да пристигне добре опакован.
              </Paragraph>
            </DeliveryHighlight>
          </AnimatedSection>

          <AnimatedSection ref={servicesAnimation.ref} style={servicesAnimation.style}>
            <SectionTitle>Какво предлагаме</SectionTitle>
            <ServicesList>
              <li>Дамски парфюми</li>
              <li>Мъжки парфюми</li>
              <li>Унисекс аромати</li>
              <li>Арабски парфюми</li>
              <li>Нишови колекции</li>
              <li>Подаръчно опаковане при поискване</li>
              <li>Доставка в цяла България</li>
            </ServicesList>
          </AnimatedSection>

          <AnimatedSection ref={contactAnimation.ref} style={contactAnimation.style}>
            <ContactInfo>
              <SectionTitle>Контакти</SectionTitle>
              <Paragraph>
                <strong>Собственик:</strong> Даниела Делиева
              </Paragraph>
              <Paragraph>
                <strong>Телефон за поръчки:</strong> 0897455021
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> danieladelieva1985@gmail.com
              </Paragraph>
              <Paragraph>
                <strong>Доставка:</strong> Изпращаме поръчки в <strong>цялата страна</strong> чрез доверени куриерски партньори.
              </Paragraph>
            </ContactInfo>
            
            <ClosingText>
              Свържете се с нас и заедно ще намерим аромата, който казва точно това, което чувствате.
            </ClosingText>
          </AnimatedSection>
        </ContentWrapper>
      </Center>
      <Footer />
    </>
  );
}


