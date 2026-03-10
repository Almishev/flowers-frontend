import styled from "styled-components";
import { useState, useEffect } from "react";

const FloatingButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #665CAC 0%, #7B6FBF 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 92, 172, 0.4);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(102, 92, 172, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media screen and (max-width: 768px) {
    width: 56px;
    height: 56px;
    bottom: 16px;
    right: 16px;
  }
`;

const ViberIcon = styled.svg`
  width: 32px;
  height: 32px;
  fill: white;
  
  @media screen and (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  background: #222;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  pointer-events: none;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #222;
  }
  
  @media screen and (max-width: 768px) {
    bottom: 65px;
    font-size: 0.75rem;
    padding: 6px 10px;
  }
`;

export default function ViberChatButton({ phoneNumber = "+359888123456" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Форматираме телефонния номер за Viber deep link
  // Viber изисква формат: +359XXXXXXXXX (без интервали или тирета)
  const formattedPhone = phoneNumber.replace(/\s|-/g, '');
  const viberLink = `viber://chat?number=${encodeURIComponent(formattedPhone)}`;
  
  const handleClick = (e) => {
    // Ако Viber не е инсталиран, може да отворим web версията
    // Но засега използваме deep link
    window.open(viberLink, '_blank');
  };
  
  useEffect(() => {
    // Показваме tooltip при hover след малко забавяне
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <FloatingButton
      href={viberLink}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      aria-label="Пишете ни във Viber"
      title="Пишете ни във Viber"
    >
      <Tooltip show={showTooltip}>
        Пишете ни във Viber
      </Tooltip>
      <ViberIcon viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.1 0 11.4c0 3.2 1.6 6 4 7.7V24l5.3-2.9c1.4.4 2.9.6 4.2.6 6.9 0 12.5-5.1 12.5-11.4S19.4 0 12.5 0zm6.9 15.4c-.2.6-1.1 1.1-1.5 1.2-.4.1-.9.2-2.1-.4-1.7-.8-3.9-2.7-5.4-4.3-2.1-2.1-3.5-4.6-3.9-5.4-.4-.8-.4-1.2.1-1.6.4-.3.9-.4 1.2-.4.3 0 .6 0 .9.1.3.1.7.4.9.7.2.3.4.7.6 1.1.2.4.3.7.5 1 .2.3.1.6 0 .8-.1.2-.2.4-.4.6-.2.2-.4.5-.6.7-.2.2-.4.4-.2.7.2.3.4.6.8 1 .4.4.8.8 1.2 1.1.5.4 1 .7 1.4.9.4.2.7.2.9 0 .2-.2.4-.5.7-.8.3-.3.6-.5.9-.7.3-.2.6-.1.8 0 .2.1.5.2.7.4.2.2.3.4.4.6.1.2.1.5 0 .7z"/>
      </ViberIcon>
    </FloatingButton>
  );
}

