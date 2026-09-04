import styled from "styled-components";
import Center from "@/components/Center";
import {useState} from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Section = styled.section`
  padding: 60px 0;
  background-color: #fff;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0 0 40px;
  font-weight: normal;
  text-align: center;
  ${props => props.style}
`;

const FAQContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  ${props => props.style}
`;

const FAQItem = styled.div`
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 0;
  ${props => props.style}
  
  &:first-child {
    border-top: 1px solid #e5e7eb;
  }
`;

const Question = styled.button`
  width: 100%;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  
  &:hover {
    color: #c9a227;
  }
`;

const Answer = styled.div`
  margin-top: 15px;
  color: #666;
  line-height: 1.8;
  padding-right: 30px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const Icon = styled.span`
  font-size: 1.5rem;
  color: #c9a227;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const faqs = [
  {
    question: "Как да поръчам парфюм?",
    answer: "Изберете аромат от каталога, добавете го в кошницата и попълнете данните за доставка и плащане. След потвърждение ще получите имейл с информация за поръчката."
  },
  {
    question: "Доставяте ли в цяла България?",
    answer: "Да, работим с куриерска фирма и доставяме до всяка точка на България. Цената и срокът за доставка зависят от населеното място."
  },
  {
    question: "Оригинални ли са парфюмите?",
    answer: "Да. Предлагаме оригинални парфюми от подбрани колекции – дамски, мъжки, унисекс, арабски и нишови."
  },
  {
    question: "Мога ли да върна продукт?",
    answer: "Запечатани продукти могат да бъдат върнати според Общите условия. Свържете се с нас по телефона или имейл възможно най-бързо."
  },
  {
    question: "Мога ли да променя или отменя поръчка?",
    answer: "Ако поръчката все още не е изпратена, можем да направим промяна или отказ. Обадете се или ни пишете възможно най-скоро."
  }
];

function FAQItemComponent({ faq, index, isOpen, onToggle, delay }) {
  const animation = useScrollAnimation({ animation: 'fadeIn', delay });

  return (
    <FAQItem ref={animation.ref} style={animation.style}>
      <Question onClick={onToggle}>
        <span>{faq.question}</span>
        <Icon isOpen={isOpen}>▼</Icon>
      </Question>
      <Answer isOpen={isOpen}>
        {faq.answer}
      </Answer>
    </FAQItem>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const containerAnimation = useScrollAnimation({ animation: 'slideUp', delay: 200 });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section>
      <Center>
        <Title ref={titleAnimation.ref} style={titleAnimation.style}>Често задавани въпроси</Title>
        <FAQContainer ref={containerAnimation.ref} style={containerAnimation.style}>
          {faqs.map((faq, index) => (
            <FAQItemComponent
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => toggleFAQ(index)}
              delay={300 + (index * 100)}
            />
          ))}
        </FAQContainer>
      </Center>
    </Section>
  );
}

