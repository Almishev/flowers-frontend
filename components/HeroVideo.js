import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  @media (max-width: 768px) {
    body.menu-open & {
      display: none;
    }
  }
`;

const Video = styled.video`
  position: static;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  min-height: 400px;
  height: 77vh;
  
  @media (max-width: 768px) {
    min-height: 350px;
    height: 55vh;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Poster = styled.div`
  position: absolute;
  inset: 0;
  background-color: #000;
  transition: opacity 0.4s ease;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  pointer-events: none;
  /* Оптимизация за по-бързо зареждане */
  will-change: opacity;
`;

const TextOverlay = styled.div`
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translateX(-50%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  max-width: 90%;
  z-index: 1;

  h1 {
    font-size: 40px;
    line-height: 1.1;
    margin: 0;
    font-weight: 600;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 
                 0 0 8px rgba(0, 0, 0, 0.6),
                 0 0 12px rgba(0, 0, 0, 0.4);
  }

  p {
    margin: 0;
    font-size: 18px;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 
                 0 0 6px rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 768px) {
    top: 12%;
    gap: 8px;
    h1 { 
      font-size: 24px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8), 
                   0 0 6px rgba(0, 0, 0, 0.6);
    }
    p { 
      font-size: 14px;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8), 
                   0 0 4px rgba(0, 0, 0, 0.6);
    }
  }
`;

const ButtonOverlay = styled.div`
  position: absolute;
  left: 50%;
  bottom: 12%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  @media (max-width: 768px) {
    bottom: 10%;
  }
`;

const ButtonCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 28px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 
               0 0 6px rgba(0, 0, 0, 0.6);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  white-space: normal;
  text-align: center;
  line-height: 1.3;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: #fff;
    color: #16a34a;
    border-color: #fff;
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3);
    text-shadow: none;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 10px 16px;
    max-width: 85%;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8), 
                 0 0 4px rgba(0, 0, 0, 0.6);
    
    &:hover {
      transform: translateY(-2px) scale(1.03);
    }
  }
`;

const defaultSettings = {
  heroMediaType: 'video',
  heroVideoDesktop: '',
  heroVideoMobile: '',
  heroImage: '',
  heroTitle: 'Flowers Boutique MIA',
  heroSubtitle: 'Уникални естествени и изкуствени цветя, букети, кошници, украси, декорации за дома.',
};

export default function HeroVideo({ heroSettings }) {
  const initialSettings = {
    ...defaultSettings,
    ...(heroSettings || {}),
  };

  const [settings] = useState(initialSettings);
  const [currentVideo, setCurrentVideo] = useState(
    initialSettings.heroVideoDesktop || initialSettings.heroVideoMobile || ''
  );
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef(null);
  const videoWrapperRef = useRef(null);

  const updateVideoSource = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Ако е избрана снимка, не показваме видео
    if (settings.heroMediaType === 'image') {
      setCurrentVideo('');
      return;
    }
    
    // Ако е избрано видео, показваме според устройството
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && settings.heroVideoMobile) {
      setCurrentVideo(settings.heroVideoMobile);
    } else if (settings.heroVideoDesktop) {
      setCurrentVideo(settings.heroVideoDesktop);
    } else if (settings.heroVideoMobile) {
      // Fallback to mobile video if desktop is not available
      setCurrentVideo(settings.heroVideoMobile);
    } else {
      setCurrentVideo('');
    }
  }, [settings.heroMediaType, settings.heroVideoDesktop, settings.heroVideoMobile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    updateVideoSource();

    const handleResize = () => {
      updateVideoSource();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateVideoSource]);

  // Intersection Observer за lazy loading на видеото
  useEffect(() => {
    if (!videoWrapperRef.current || !currentVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoadVideo(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Започваме да зареждаме 50px преди да влезе в viewport
        threshold: 0.1,
      }
    );

    observer.observe(videoWrapperRef.current);

    return () => {
      if (videoWrapperRef.current) {
        observer.unobserve(videoWrapperRef.current);
      }
    };
  }, [currentVideo]);

  useEffect(() => {
    // Update video source when currentVideo changes и когато трябва да се зареди
    if (videoRef.current && currentVideo && shouldLoadVideo) {
      videoRef.current.load(); // Reload video with new source
    }
  }, [currentVideo, shouldLoadVideo]);

  // Ако е избран тип 'image' но няма снимка, показваме placeholder
  if (settings.heroMediaType === 'image' && !settings.heroImage) {
    return (
      <VideoWrapper ref={videoWrapperRef}>
        <ImageWrapper style={{ minHeight: '400px', height: '65vh', background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)' }}>
          <TextOverlay>
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
          </TextOverlay>
          <ButtonOverlay>
            <Link href="/bouquets" passHref legacyBehavior>
              <ButtonCTA>
                Разгледайте букетите
              </ButtonCTA>
            </Link>
          </ButtonOverlay>
        </ImageWrapper>
      </VideoWrapper>
    );
  }

  // Показваме снимка ако е избран тип 'image' и има снимка
  if (settings.heroMediaType === 'image' && settings.heroImage) {
    const isS3Image = settings.heroImage?.includes('s3.amazonaws.com') || 
                      settings.heroImage?.includes('s3.eu-central-1.amazonaws.com') ||
                      settings.heroImage?.includes('amazonaws.com');
    
    // За S3 снимки използваме стандартен <img> tag, защото Next.js Image има проблеми в production
    if (isS3Image) {
      return (
        <VideoWrapper ref={videoWrapperRef}>
          <ImageWrapper>
            <img
              src={settings.heroImage}
              alt={settings.heroTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                console.error('Error loading hero image:', settings.heroImage);
                e.target.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Hero image loaded successfully:', settings.heroImage);
              }}
            />
          </ImageWrapper>
          <TextOverlay>
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
          </TextOverlay>
          <ButtonOverlay>
            <Link href="/bouquets" passHref legacyBehavior>
              <ButtonCTA>
                Разгледайте букетите
              </ButtonCTA>
            </Link>
          </ButtonOverlay>
        </VideoWrapper>
      );
    }
    
    // За не-S3 снимки използваме Next.js Image
    return (
      <VideoWrapper ref={videoWrapperRef}>
        <ImageWrapper>
          <Image
            src={settings.heroImage}
            alt={settings.heroTitle}
            width={1920}
            height={1080}
            priority
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              console.error('Error loading hero image:', settings.heroImage);
              e.target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Hero image loaded successfully:', settings.heroImage);
            }}
          />
        </ImageWrapper>
        <TextOverlay>
            <h1>{settings.heroTitle}</h1>
            <p>{settings.heroSubtitle}</p>
        </TextOverlay>
        <ButtonOverlay>
          <Link href="/trips" passHref legacyBehavior>
            <ButtonCTA>
              Разгледайте екскурзиите
            </ButtonCTA>
          </Link>
        </ButtonOverlay>
      </VideoWrapper>
    );
  }

  // Ако няма нито видео, нито снимка, показваме placeholder
  if (!currentVideo && settings.heroMediaType !== 'image') {
    return (
      <VideoWrapper ref={videoWrapperRef}>
        <ImageWrapper style={{ minHeight: '400px', height: '65vh', background: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)' }}>
          <TextOverlay>
              <h1>{settings.heroTitle}</h1>
              <p>{settings.heroSubtitle}</p>
          </TextOverlay>
          <ButtonOverlay>
            <Link href="/bouquets" passHref legacyBehavior>
              <ButtonCTA>
                Разгледайте букетите
              </ButtonCTA>
            </Link>
          </ButtonOverlay>
        </ImageWrapper>
      </VideoWrapper>
    );
  }

  // Показваме видео ако е избран тип 'video-desktop' или 'video-mobile'
  return (
    <VideoWrapper ref={videoWrapperRef}>
      <Poster hidden={videoReady && shouldLoadVideo} />
      {currentVideo && shouldLoadVideo && (
        <Video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          key={currentVideo} // Force re-render when video changes
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={currentVideo} type="video/mp4" />
        </Video>
      )}
      <TextOverlay>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
      </TextOverlay>
      <ButtonOverlay>
        <Link href="/bouquets" passHref legacyBehavior>
          <ButtonCTA>
            Разгледайте букетите
          </ButtonCTA>
        </Link>
      </ButtonOverlay>
    </VideoWrapper>
  );
}


