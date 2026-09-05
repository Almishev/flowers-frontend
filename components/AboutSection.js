import styled from "styled-components";
import Center from "@/components/Center";
import ButtonLink from "@/components/ButtonLink";
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
          За бутика
        </AnimatedTitle>
        <Content>
          <AnimatedParagraph ref={firstParagraphAnimation.ref} style={firstParagraphAnimation.style}>
            DÉLIE е парфюмен бутик с подбрани дамски, мъжки, унисекс, арабски и нишови аромати. Вярваме, че правилният парфюм е жест, спомен и характер – затова избираме всяка бутилка внимателно.
          </AnimatedParagraph>
          <AnimatedParagraph 
            ref={secondParagraphAnimation.ref}
            style={{...secondParagraphAnimation.style, marginTop: '20px'}}
          >
            Колекцията ни е от оригинални тестери в оригинални опаковки – класики и по-редки композиции за подарък или за всеки ден. Доставяме в цяла България.
          </AnimatedParagraph>
        </Content>
        <ButtonWrapper>
          <ButtonLink href="/about" black size="l">
            Научете повече за нас
          </ButtonLink>
        </ButtonWrapper>
      </Center>
    </Section>
  );
}

