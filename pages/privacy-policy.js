import styled from "styled-components";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 1.05rem;
  color: #333;
  padding: 20px 0 60px;
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

const InfoBox = styled.div`
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  margin: 30px 0;
  border-left: 4px solid #16a34a;
  
  p {
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 20px;
  
  li {
    margin-bottom: 10px;
    text-align: justify;
  }
`;

const ContactBox = styled.div`
  background-color: #fff;
  border: 2px solid #16a34a;
  padding: 25px;
  border-radius: 8px;
  margin: 40px 0;
  text-align: center;
  
  p {
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: #111;
  }
  
  a {
    color: #16a34a;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LastUpdated = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 40px;
  text-align: center;
`;

const AnimatedSection = styled.div`
  ${props => props.style}
`;

export default function PrivacyPolicyPage() {
  const introAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const dataAnimation = useScrollAnimation({ animation: 'slideUp', delay: 200 });
  const usageAnimation = useScrollAnimation({ animation: 'slideUp', delay: 400 });
  const sharingAnimation = useScrollAnimation({ animation: 'slideUp', delay: 600 });
  const securityAnimation = useScrollAnimation({ animation: 'slideUp', delay: 800 });
  const rightsAnimation = useScrollAnimation({ animation: 'slideUp', delay: 1000 });
  const cookiesAnimation = useScrollAnimation({ animation: 'slideUp', delay: 1200 });
  const contactAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 1400 });

  return (
    <>
      <SEO 
        title="Политика за поверителност | Flowers Boutique MIA"
        description="Политика за поверителност и защита на личните данни на Flowers Boutique MIA - онлайн магазин за цветя, букети, кошници и декорации."
        keywords="политика поверителност, защита данни, GDPR, лични данни, Flowers Boutique MIA"
        url="/privacy-policy"
        image="/pirin-pixel-yellow.png"
      />
      <Header />
      <Center>
        <Title>Политика за поверителност</Title>
        <ContentWrapper>
          <AnimatedSection ref={introAnimation.ref} style={introAnimation.style}>
            <Paragraph>
              Flowers Boutique MIA (&quot;ние&quot;, &quot;нас&quot;, &quot;нашата&quot;) уважава вашата поверителност и се ангажира да защитава вашите лични данни. 
              Тази Политика за поверителност обяснява как събираме, използваме, съхраняваме и споделяме вашата лична информация, когато използвате нашия онлайн магазин 
              за цветя, букети, кошници, украси и декорации или правите поръчка при нас.
            </Paragraph>
            <InfoBox>
              <Paragraph>
                <strong>Важно:</strong> Използвайки нашия уебсайт и правейки поръчка, вие се съгласявате с тази Политика за поверителност. 
                Ако не сте съгласни с някоя част от тази политика, моля, не използвайте нашите услуги.
              </Paragraph>
            </InfoBox>
          </AnimatedSection>

          <AnimatedSection ref={dataAnimation.ref} style={dataAnimation.style}>
            <SectionTitle>1. Какви данни събираме</SectionTitle>
            <Paragraph>
              При създаване на поръчка или комуникация с нас, можем да събираме следните категории лични данни:
            </Paragraph>
            <List>
              <li><strong>Идентификационни данни:</strong> име и фамилия</li>
              <li><strong>Контактна информация:</strong> телефонен номер, имейл адрес, адрес за доставка и фактуриране</li>
              <li><strong>Данни за поръчките:</strong> избрани продукти (букети, кошници, украси, декорации), количество, цена, избран метод на плащане и доставка, бележка към поръчката (например текст за картичка)</li>
              <li><strong>Платежна информация:</strong> данни за плащанията (без да съхраняваме пълни данни за банкови или кредитни карти – плащанията през онлайн платформи се обработват от съответните платежни оператори)</li>
              <li><strong>Технически данни:</strong> IP адрес, тип браузър, информация за устройството, cookies и подобни технологии</li>
            </List>
          </AnimatedSection>

          <AnimatedSection ref={usageAnimation.ref} style={usageAnimation.style}>
            <SectionTitle>2. Как използваме вашите данни</SectionTitle>
            <Paragraph>
              Използваме събраните лични данни за следните цели:
            </Paragraph>
            <List>
              <li><strong>Изпълнение на поръчки:</strong> обработка и потвърждаване на поръчки, подготовка на букети и декорации, организиране на доставката</li>
              <li><strong>Комуникация:</strong> отговори на ваши запитвания, изпращане на важна информация относно статуса на поръчката или промени</li>
              <li><strong>Маркетинг (с ваше съгласие):</strong> изпращане на информационни бюлетини, промоции и оферти за нови продукти и кампании</li>
              <li><strong>Правни задължения:</strong> съответствие с приложимите закони и разпоредби, включително данъчно и счетоводно законодателство</li>
              <li><strong>Подобряване на услугите:</strong> анализ на използването на нашия уебсайт за подобряване на потребителското изживяване</li>
            </List>
          </AnimatedSection>

          <AnimatedSection ref={sharingAnimation.ref} style={sharingAnimation.style}>
            <SectionTitle>3. С кого споделяме вашите данни</SectionTitle>
            <Paragraph>
              Може да споделяме вашите лични данни със следните категории получатели:
            </Paragraph>
            <List>
              <li><strong>Доставчици на услуги:</strong> куриерски компании и партньори по доставки, платежни оператори и IT доставчици, необходими за изпълнение на вашата поръчка</li>
              <li><strong>Правни власти:</strong> когато това е изискано от закон или при съдебни разпореждания</li>
              <li><strong>IT доставчици:</strong> компании, които ни помагат да поддържаме нашия уебсайт и системи (със строги договори за поверителност)</li>
            </List>
            <Paragraph>
              <strong>Важно:</strong> Ние не продаваме вашите лични данни на трети страни за маркетингови цели.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={securityAnimation.ref} style={securityAnimation.style}>
            <SectionTitle>4. Защита на данните</SectionTitle>
            <Paragraph>
              Прилагаме подходящи технически и организационни мерки за защита на вашите лични данни срещу неоторизиран достъп, загуба, унищожаване или промяна. Въпреки това, никой метод за предаване по интернет или електронно съхранение не е 100% сигурен.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={rightsAnimation.ref} style={rightsAnimation.style}>
            <SectionTitle>5. Вашите права</SectionTitle>
            <Paragraph>
              Съгласно Регламент (ЕС) 2016/679 (GDPR), имате следните права относно вашите лични данни:
            </Paragraph>
            <List>
              <li><strong>Право на достъп:</strong> можете да поискате копие от личните данни, които притежаваме за вас</li>
              <li><strong>Право на корекция:</strong> можете да поискате да коригираме неточни или непълни данни</li>
              <li><strong>Право на изтриване:</strong> можете да поискате изтриване на вашите данни в определени обстоятелства</li>
              <li><strong>Право на ограничаване на обработката:</strong> можете да поискате ограничаване на обработката на вашите данни</li>
              <li><strong>Право на преносимост:</strong> можете да поискате прехвърляне на вашите данни към друг доставчик</li>
              <li><strong>Право на възражение:</strong> можете да възразите срещу обработката на вашите данни за маркетингови цели</li>
              <li><strong>Право на оттегляне на съгласие:</strong> когато обработката се основава на вашето съгласие, можете да го оттеглите по всяко време</li>
            </List>
            <Paragraph>
              За упражняване на някое от тези права, моля, свържете се с нас на посочения по-долу имейл адрес.
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={cookiesAnimation.ref} style={cookiesAnimation.style}>
            <SectionTitle>6. Бисквитки (Cookies)</SectionTitle>
            <Paragraph>
              Нашият уебсайт използва бисквитки за подобряване на функционалността и анализиране на използването. Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство. Можете да контролирате използването на бисквитки чрез настройките на вашия браузър.
            </Paragraph>
            <Paragraph>
              Използваме следните типове бисквитки:
            </Paragraph>
            <List>
              <li><strong>Необходими бисквитки:</strong> необходими за основното функциониране на уебсайта</li>
              <li><strong>Аналитични бисквитки:</strong> помагат ни да разберем как посетителите използват нашия уебсайт</li>
              <li><strong>Функционални бисквитки:</strong> запомнят вашите предпочитания и подобряват потребителското изживяване</li>
            </List>
          </AnimatedSection>

          <AnimatedSection ref={contactAnimation.ref} style={contactAnimation.style}>
            <SectionTitle>7. Срок на съхранение</SectionTitle>
            <Paragraph>
              Съхраняваме вашите лични данни само толкова дълго, колкото е необходимо за целите, за които са събрани, или колкото изисква приложимото законодателство. Данните за резервации се съхраняват за периода, необходим за изпълнение на договорните задължения и за съответствие с правните изисквания (обикновено 5-7 години след приключване на договорните отношения).
            </Paragraph>
          </AnimatedSection>

          <AnimatedSection ref={contactAnimation.ref} style={contactAnimation.style}>
            <SectionTitle>8. Промени в политиката</SectionTitle>
            <Paragraph>
              Може да обновяваме тази Политика за поверителност от време на време. Ще уведомим за значими промени чрез публикуване на новата версия на нашия уебсайт. Препоръчваме ви да преглеждате тази страница периодично.
            </Paragraph>
          </AnimatedSection>

          <ContactBox>
            <SectionTitle>9. Контакти</SectionTitle>
            <Paragraph>
              Ако имате въпроси относно тази Политика за поверителност или искате да упражните някое от вашите права, моля, свържете се с нас:
            </Paragraph>
            <Paragraph>
              <strong>Flowers Boutique MIA</strong><br/>
              ул. Серес 12, Гоце Делчев, България, 2900
            </Paragraph>
            <Paragraph>
              <strong>Имейл:</strong> <a href="mailto:antonalmishev123@gmail.com">antonalmishev123@gmail.com</a>
            </Paragraph>
            <Paragraph>
              <strong>Телефон:</strong> <a href="tel:+359877382224">087 738 2224</a>
            </Paragraph>
          </ContactBox>

          <LastUpdated>
            Последна актуализация: {new Date().toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </LastUpdated>
        </ContentWrapper>
      </Center>
      <Footer />
    </>
  );
}


