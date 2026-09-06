import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';
import { onHeroReady } from '@/lib/heroReady';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: #c9a227;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.isHiding ? fadeOut : fadeIn} 0.25s ease;
  pointer-events: ${props => props.isHiding ? 'none' : 'auto'};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const AnimatedLogo = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
  position: relative;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #000;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
  margin-top: 20px;
`;

const LoadingText = styled.p`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const MAX_WAIT_MS = 1200;

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (sessionStorage.getItem('pageLoaded')) {
      setLoading(false);
      return;
    }

    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      setIsHiding(true);
      setTimeout(() => {
        setLoading(false);
        setIsHiding(false);
        sessionStorage.setItem('pageLoaded', 'true');
      }, 200);
    };

    const isHome = window.location.pathname === '/';
    if (!isHome) {
      hide();
      return;
    }

    const stopListen = onHeroReady(hide);
    const cap = setTimeout(hide, MAX_WAIT_MS);

    return () => {
      stopListen();
      clearTimeout(cap);
    };
  }, []);

  if (!loading) return null;

  return (
    <LoadingOverlay isHiding={isHiding}>
      <LogoContainer>
        <AnimatedLogo>
          <Image
            src="/parfumes.png"
            alt="DÉLIE"
            width={200}
            height={200}
            style={{ objectFit: 'contain' }}
          />
        </AnimatedLogo>
        <LoadingText>DÉLIE</LoadingText>
        <Spinner />
      </LogoContainer>
    </LoadingOverlay>
  );
}
