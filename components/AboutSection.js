import styled from "styled-components";
import Center from "@/components/Center";
import ButtonLink from "@/components/ButtonLink";
import FoundersSection from "@/components/FoundersSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Section = styled.section`
  padding: 60px 0;
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 20px;
  font-weight: normal;
  text-align: center;
`;

const AnimatedTitle = styled(Title)`
  ${props => props.style}
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
  margin-bottom: 30px;
`;

const AnimatedContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
  margin-bottom: 30px;
  ${props => props.style}
`;

const AnimatedParagraph = styled.p`
  ${props => props.style}
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

export default function AboutSection() {
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const firstParagraphAnimation = useScrollAnimation({ animation: 'slideUp', delay: 200 });
  const secondParagraphAnimation = useScrollAnimation({ animation: 'slideUp', delay: 400 });

  return (
    <Section>
      <Center>
        <AnimatedTitle ref={titleAnimation.ref} style={titleAnimation.style}>
          За цветарницата
        </AnimatedTitle>
        <Content>
          <AnimatedParagraph ref={firstParagraphAnimation.ref} style={firstParagraphAnimation.style}>
            Flowers Boutique MIA е малка бутикова цветарница, посветена на това да превръща емоциите в красиви букети и декорации. Уникални естествени и изкуствени цветя, букети, кошници, украси, декорации за дома – всичко подбираме внимателно, за да разкажем вашата история чрез цветята. Вярваме, че цветята са най-нежният начин да кажеш „Благодаря“, „Обичам те“ или просто „Мисля за теб“.
          </AnimatedParagraph>
          <AnimatedParagraph 
            ref={secondParagraphAnimation.ref}
            style={{...secondParagraphAnimation.style, marginTop: '20px'}}
          >
            Работим с подбрани доставчици и сезонни цветя, за да гарантираме дълготрайност и свежест. Предлагаме букети за всякакви поводи – рождени дни, сватби, корпоративни събития, абитуриентски балове и ежедневни малки поводи за радост. Нашата цел е всеки клиент да получи не просто букет, а лично преживяване.
          </AnimatedParagraph>
        </Content>
        <FoundersSection />
        <ButtonWrapper>
          <ButtonLink href="/about" primary size="l">
            Научете повече за нас
          </ButtonLink>
        </ButtonWrapper>
      </Center>
    </Section>
  );
}

