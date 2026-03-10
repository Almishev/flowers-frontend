import styled from "styled-components";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import SEO from "@/components/SEO";

const Wrapper = styled.div`
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  padding: 40px 20px;
`;

const Content = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 60px 50px;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.12);
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -80px;
    right: -80px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(59,130,246,0.18), transparent 65%);
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -100px;
    left: -60px;
    width: 260px;
    height: 260px;
    background: radial-gradient(circle, rgba(16,185,129,0.18), transparent 60%);
    z-index: 0;
  }
`;

const Status = styled.div`
  font-size: 6rem;
  font-weight: 700;
  color: #1d4ed8;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 2.25rem;
  color: #111827;
  position: relative;
  z-index: 1;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  margin: 0 auto 32px;
  position: relative;
  z-index: 1;
  max-width: 520px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const PrimaryButton = styled(Link)`
  padding: 14px 28px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 15px 30px rgba(37, 99, 235, 0.22);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(37, 99, 235, 0.28);
  }
`;

const SecondaryButton = styled(Link)`
  padding: 14px 28px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  color: #111827;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }
`;

const Tip = styled.p`
  margin-top: 26px;
  font-size: 0.95rem;
  color: #6b7280;
  position: relative;
  z-index: 1;
`;

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="404 - Страницата не е намерена"
        description="Тази страница не съществува. Върнете се към началото или разгледайте екскурзиите."
        keywords="404 страница, не е намерено"
        url="/404"
        image="/logo.png"
      />
      <Header />
      <Wrapper>
        <Content>
          <Status>404</Status>
          <Title>О, не! Загубихме тази страница.</Title>
          <Description>
            Търсената страница не съществува или е преместена. 
            Опитайте отново от началото или разгледайте наличните екскурзии.
          </Description>
          <Actions>
            <PrimaryButton href="/">← Към началната страница</PrimaryButton>
            <SecondaryButton href="/trips">Разгледай екскурзиите</SecondaryButton>
          </Actions>
          <Tip>
            Ако смятате, че това е грешка, свържете се с нас: officefriendlytravel@gmail.com
          </Tip>
        </Content>
      </Wrapper>
      <Footer />
    </>
  );
}

