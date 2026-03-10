import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Image from 'next/image';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #b8860b;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${props => props.isHiding ? fadeOut : fadeIn} 0.3s ease;
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

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Проверяваме дали това е първоначално зареждане (не навигация)
    // Ако има sessionStorage ключ, значи вече сме заредили страницата преди
    const hasLoadedBefore = typeof window !== 'undefined' && sessionStorage.getItem('pageLoaded');
    
    if (hasLoadedBefore) {
      // Ако вече сме заредили страницата, не показваме loading screen
      setLoading(false);
      return;
    }

    // Опростена проверка - само дали DOM е готов
    // Не чакаме всички изображения, за да не забавяме скриването

    // Функция за скриване на loading screen
    const hideLoading = () => {
      // Минимално време за показване (за да се види анимацията)
      const minDisplayTime = 500; // 0.5 секунди (намалено от 0.8s)
      // Максимално време - принудително скриване след 1.5 секунди (намалено от 3s)
      const maxDisplayTime = 1500; // 1.5 секунди
      const startTime = Date.now();

      const tryHide = () => {
        const elapsed = Date.now() - startTime;
        // Опростена проверка - само дали DOM е готов, без да чакаме всички изображения
        const isLoaded = document.readyState === 'complete';

        // Ако е минало максималното време (1.5 секунди), скрий принудително
        if (elapsed >= maxDisplayTime) {
          setIsHiding(true);
          setTimeout(() => {
            setLoading(false);
            setIsHiding(false);
            // Маркираме, че страницата е заредена
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('pageLoaded', 'true');
            }
          }, 200); // Намалено от 300ms
          return;
        }

        // Ако страницата е заредена и е минало минималното време (0.5 секунди)
        // Скрий веднага, без да чака до 1.5 секунди
        if (isLoaded && elapsed >= minDisplayTime) {
          setIsHiding(true);
          setTimeout(() => {
            setLoading(false);
            setIsHiding(false);
            // Маркираме, че страницата е заредена
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('pageLoaded', 'true');
            }
          }, 200); // Намалено от 300ms
          return;
        }

        // Ако страницата все още не е заредена, провери отново след малко
        if (!isLoaded) {
          setTimeout(tryHide, 50); // Намалено от 100ms за по-бърза проверка
        } else {
          // Ако е заредена, но не е минало достатъчно време (минималното)
          setTimeout(tryHide, Math.max(0, minDisplayTime - elapsed));
        }
      };

      tryHide();
    };

    // Следим за зареждане на страницата
    const handleLoad = () => {
      hideLoading();
    };

    // Следим за промяна в readyState
    const handleReadyStateChange = () => {
      if (document.readyState === 'complete') {
        hideLoading();
      }
    };

    // Ако страницата вече е заредена при монтиране, започваме проверката
    if (document.readyState === 'complete') {
      hideLoading();
    } else {
      // Слушаме за зареждане
      window.addEventListener('load', handleLoad);
      document.addEventListener('readystatechange', handleReadyStateChange);
      // Също така започваме проверката веднага (за случай че страницата е бавна)
      hideLoading();
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('readystatechange', handleReadyStateChange);
    };
  }, []);

  if (!loading) return null;

  return (
    <LoadingOverlay isHiding={isHiding}>
      <LogoContainer>
        <AnimatedLogo>
          <Image
            src="/logo.png"
            alt="Loading"
            width={200}
            height={200}
            priority
            style={{
              objectFit: 'contain',
            }}
          />
        </AnimatedLogo>
        <LoadingText>Making connections</LoadingText>
        <Spinner />
      </LogoContainer>
    </LoadingOverlay>
  );
}

