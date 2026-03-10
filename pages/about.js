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
  color: #16a34a;
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

const DestinationsHighlight = styled.div`
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin: 30px 0;
  border-left: 4px solid #16a34a;
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
  const destinationsAnimation = useScrollAnimation({ animation: 'slideUp', delay: 800 });
  const servicesAnimation = useScrollAnimation({ animation: 'slideUp', delay: 1000 });
  const foundersAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 1200 });
  const contactAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 1400 });

  return (
    <>
      <SEO 
        title="За нас | Flowers Boutique MIA - онлайн магазин за цветя"
        description="Flowers Boutique MIA е бутикова цветарница, която предлага уникални естествени и изкуствени цветя, букети, кошници, украси и декорации за дома с доставка в цяла България."
        keywords="Flowers Boutique MIA, цветарски магазин, букети, изкуствени цветя, кошници с цветя, декорации за дома, доставка на цветя в България"
        url="/about"
        image="/logo-shop-flowers.png"
      />
      <Header />
      <Center>
        <Title>За нас</Title>
        <ContentWrapper>
          <AnimatedSection ref={introAnimation.ref} style={introAnimation.style}>
            <SectionTitle>Flowers Boutique MIA</SectionTitle>
            <Paragraph>
              Flowers Boutique MIA е <strong>бутикова цветарница</strong>, създадена с идеята всяко цвете и всеки букет да носят емоция. 
              При нас ще откриете уникални естествени и изкуствени цветя, букети, кошници, украси и декорации за дома – внимателно подбрани и подредени така, че да разкажат вашата история.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={mottoAnimation.ref} style={mottoAnimation.style}>
            <Motto>&quot;Всеки букет е послание&quot;</Motto>
          </AnimatedSection>

          <AnimatedSection ref={teamAnimation.ref} style={teamAnimation.style}>
            <SectionTitle>Собственик и визия</SectionTitle>
            <Paragraph>
              Зад Flowers Boutique MIA стои <strong>Марияна Алексова</strong> – човек, който вярва, че детайлите правят всяко пространство и всеки повод специален. 
              Нейната страст към цветовете, формите и естетиката се превръща в внимателно подбрани композиции от свежи и изкуствени цветя.
            </Paragraph>
            <Paragraph>
              Всеки букет, кошница или декорация се изработва с лично отношение – от избора на цветя до финалната опаковка. 
              Целта ни е клиентът да получи не просто продукт, а <strong>преживяване</strong>, което да остане в спомените – независимо дали става дума за рожден ден, сватба, годишнина, корпоративно събитие или просто жест без повод.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={missionAnimation.ref} style={missionAnimation.style}>
            <SectionTitle>Нашата мисия</SectionTitle>
            <Paragraph>
              Мисията на Flowers Boutique MIA е да превръща емоциите в красиви цветни истории. Вярваме, че правилно подбраният букет може да каже повече от хиляди думи – да зарадва, утеши, изненада или вдъхнови.
            </Paragraph>
            <Paragraph>
              Стремим се да предложим богато разнообразие от естествени и изкуствени цветя, стилни кошници, украси и декорации за дома, 
              които да пасват на различни вкусове и поводи. Независимо дали търсите нещо минималистично и модерно, или класическа романтична визия – 
              ще ви помогнем да откриете точния вариант.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={destinationsAnimation.ref} style={destinationsAnimation.style}>
            <DestinationsHighlight>
              <SectionTitle>Доставка в цяла България</SectionTitle>
              <Paragraph>
                Изработваме букетите на място и ги изпращаме с надеждни куриерски партньори до всяка точка на страната. 
                Така можете да зарадвате любим човек, дори да не сте в същия град – ние ще се погрижим букетът да пристигне красиво опакован и в свеж вид.
              </Paragraph>
            </DestinationsHighlight>
          </AnimatedSection>

          <AnimatedSection ref={servicesAnimation.ref} style={servicesAnimation.style}>
            <SectionTitle>Какво предлагаме</SectionTitle>
            <ServicesList>
              <li>Естествени букети за рожден ден, годишнина, сватба и други поводи</li>
              <li>Изкуствени букети и аранжировки за дълготрайна декорация</li>
              <li>Кошници с цветя и комбинирани подаръчни кошници</li>
              <li>Сезонни декорации и украси за дома, офиса или витрина</li>
              <li>Цветя и украса за събития – сватби, кръщенета, корпоративни срещи</li>
              <li>Персонализирани поръчки по идея на клиента</li>
              <li>Доставка на цветя в цяла България</li>
            </ServicesList>
          </AnimatedSection>

          <AnimatedSection ref={contactAnimation.ref} style={contactAnimation.style}>
            <ContactInfo>
              <SectionTitle>Контакти</SectionTitle>
              <Paragraph>
                <strong>Собственик:</strong> Марияна Алексова
              </Paragraph>
              <Paragraph>
                <strong>Телефон за поръчки:</strong> 089 869 0246
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> aleksova_2012@abv.bg
              </Paragraph>
              <Paragraph>
                <strong>Доставка:</strong> Изпращаме поръчки в <strong>цялата страна</strong> чрез доверени куриерски партньори.
              </Paragraph>
            </ContactInfo>
            
            <ClosingText>
              Свържете се с нас и заедно ще създадем букети и декорации, които казват точно това, което чувствате.
            </ClosingText>
          </AnimatedSection>
        </ContentWrapper>
      </Center>
      <Footer />
    </>
  );
}


