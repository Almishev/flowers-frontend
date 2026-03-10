import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Center from '@/components/Center';
import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

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

const FilterButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  ${props => props.style}
`;

const FilterButton = styled.button`
  padding: 10px 24px;
  border: 2px solid #16a34a;
  background-color: ${props => props.active ? '#16a34a' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#16a34a'};
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:hover {
    background-color: #16a34a;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
  }
  
  @media screen and (max-width: 768px) {
    padding: 8px 20px;
    font-size: 0.9rem;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
  
  @media screen and (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  ${props => props.style}
`;

const ImageCard = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background-color: #f3f3f3;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    
    &::after {
      opacity: 1;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f3f3f3;
  background-image: linear-gradient(90deg, #f0f0f0 0px, #f8f8f8 40px, #f0f0f0 80px);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
`;

const DestinationLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgba(22, 163, 74, 0.9);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ImageCard}:hover & {
    opacity: 1;
  }
  
  @media screen and (max-width: 768px) {
    opacity: 1;
    font-size: 0.75rem;
    padding: 4px 8px;
  }
`;

// Lightbox Modal
const LightboxOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImage = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 90vh;
  border-radius: 8px;
  overflow: hidden;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  z-index: 10001;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    transform: rotate(90deg);
  }
  
  @media screen and (max-width: 768px) {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
`;

const LightboxNav = styled.button`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  z-index: 10001;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #fff;
    transform: translateY(-50%) scale(1.1);
  }
  
  @media screen and (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
    ${props => props.direction === 'prev' ? 'left: 10px;' : 'right: 10px;'}
  }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: #000;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 10001;
  
  @media screen and (max-width: 768px) {
    bottom: 10px;
    font-size: 0.8rem;
    padding: 6px 12px;
  }
`;

// Галерия с букети и декорации по поводи
const memoriesData = [
  // Сватбени букети
  {
    id: 1,
    destination: 'Сватбени букети',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/svatbeni-buketi1.jpg',
    alt: 'Елегантен сватбен букет в нежни тонове'
  },
  {
    id: 2,
    destination: 'Сватбени букети',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/svatbeni-buketi2.jpg',
    alt: 'Класически сватбен букет за булка'
  },
  {
    id: 3,
    destination: 'Сватбени букети',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/svatbeni-buketi3.jpg',
    alt: 'Романтичен сватбен букет с цветя в пастелни цветове'
  },
  {
    id: 4,
    destination: 'Сватбени букети',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/svatbeni-buketi4.jpg',
    alt: 'Модерен сватбен букет за специалния ден'
  },

  // Букети за рожден ден
  {
    id: 6,
    destination: 'Букети за рожден ден',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/rojdenden1_n.jpg',
    alt: 'Красив букет за рожден ден'
  },
  {
    id: 7,
    destination: 'Букети за рожден ден',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/rojdenden2.jpg',
    alt: 'Пъстър букет за празничен повод'
  },
  {
    id: 8,
    destination: 'Букети за рожден ден',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/rojdenden3.jpg',
    alt: 'Елегантен букет за рожден ден'
  },
  {
    id: 9,
    destination: 'Букети за рожден ден',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/rojdenden4n.jpg',
    alt: 'Изискан букет за рожден ден'
  },
  
  {
    id: 10,
    destination: 'Декорации за дома',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/za-doma_n.jpg',
    alt: 'Елегантна цветна декорация за дома'
  },
  {
    id: 11,
    destination: 'Декорации за дома',
    image: 'https://flowers-aleksova1.s3.eu-central-1.amazonaws.com/za-doma.jpg',
    alt: 'Луксозна декорация с цветя за дома'
  },
];

export default function MemoriesSection() {
  const [activeFilter, setActiveFilter] = useState('Всички');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const titleAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 0 });
  const filterAnimation = useScrollAnimation({ animation: 'fadeIn', delay: 200 });
  const gridAnimation = useScrollAnimation({ animation: 'scale', delay: 400 });

  // Филтриране на снимките
  const filteredMemories = activeFilter === 'Всички' 
    ? memoriesData 
    : memoriesData.filter(memory => memory.destination === activeFilter);

  // Уникални дестинации за филтрите
  const destinations = ['Всички', ...new Set(memoriesData.map(m => m.destination))];

  const openLightbox = useCallback((memoryId) => {
    // Намираме индекса в филтрирания масив
    const index = filteredMemories.findIndex(m => m.id === memoryId);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Предотвратява скролване на body
  }, [filteredMemories]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateLightbox = useCallback((direction) => {
    if (direction === 'prev') {
      setLightboxIndex(prev => 
        prev > 0 ? prev - 1 : filteredMemories.length - 1
      );
    } else {
      setLightboxIndex(prev => 
        prev < filteredMemories.length - 1 ? prev + 1 : 0
      );
    }
  }, [filteredMemories.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, navigateLightbox]);

  return (
    <>
      <Section>
        <Center>
          <Title ref={titleAnimation.ref} style={titleAnimation.style}>
            Вдъхновение за вашия повод
          </Title>
          
          <FilterButtons ref={filterAnimation.ref} style={filterAnimation.style}>
            {destinations.map(dest => (
              <FilterButton
                key={dest}
                active={activeFilter === dest}
                onClick={() => setActiveFilter(dest)}
              >
                {dest}
              </FilterButton>
            ))}
          </FilterButtons>

          <GalleryGrid ref={gridAnimation.ref} style={gridAnimation.style}>
            {filteredMemories.map((memory, index) => (
              <ImageCard
                key={memory.id}
                onClick={() => openLightbox(memory.id)}
              >
                <ImageWrapper>
                  <Image
                    src={memory.image}
                    alt={memory.alt}
                    fill
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 280px"
                    style={{
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                    unoptimized={memory.image?.includes('s3.amazonaws.com')}
                    onError={(e) => {
                      // Fallback при грешка при зареждане на снимка
                      e.target.style.display = 'none';
                    }}
                  />
                </ImageWrapper>
                <DestinationLabel>{memory.destination}</DestinationLabel>
              </ImageCard>
            ))}
          </GalleryGrid>
        </Center>
      </Section>

      {/* Lightbox Modal */}
      <LightboxOverlay
        isOpen={lightboxOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeLightbox();
          }
        }}
      >
        <LightboxClose onClick={closeLightbox}>×</LightboxClose>
        
        {filteredMemories.length > 1 && (
          <>
            <LightboxNav direction="prev" onClick={() => navigateLightbox('prev')}>
              ‹
            </LightboxNav>
            <LightboxNav direction="next" onClick={() => navigateLightbox('next')}>
              ›
            </LightboxNav>
          </>
        )}

        <LightboxContent>
          <LightboxImage>
            {filteredMemories[lightboxIndex] && (
              <Image
                src={filteredMemories[lightboxIndex].image}
                alt={filteredMemories[lightboxIndex].alt}
                width={1200}
                height={800}
                sizes="90vw"
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  height: 'auto',
                  width: 'auto',
                  objectFit: 'contain',
                }}
                priority
                unoptimized={filteredMemories[lightboxIndex].image?.includes('s3.amazonaws.com')}
              />
            )}
          </LightboxImage>
        </LightboxContent>

        {filteredMemories.length > 1 && (
          <ImageCounter>
            {lightboxIndex + 1} / {filteredMemories.length}
          </ImageCounter>
        )}
      </LightboxOverlay>
    </>
  );
}

