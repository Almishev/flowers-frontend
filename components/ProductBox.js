import styled from "styled-components";
import HeartIcon from "@/components/icons/Heart";
import Link from "next/link";
import Image from "next/image";
import {useWishlist} from "@/components/WishlistContext";
import toast from "react-hot-toast";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";
import Button from "@/components/Button";
import {useContext, useEffect, useRef, useState} from "react";
import {CartContext} from "@/components/CartContext";
import { motion } from "framer-motion";

const ProductWrapper = styled(motion.div)`
  position: relative;
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }
  
  svg {
    color: ${props => props.filled ? '#e74c3c' : '#666'};
    transition: color 0.2s;
  }
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 16px;
  height: 160px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const ThumbWrapper = styled.div`
  width: 100%;
  max-width: 220px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PlaceholderThumb = styled.div`
  width: 100%;
  height: 100%;
  border: 1px dashed #d4d4d8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: .9rem;
  color: inherit;
  text-decoration: none;
  margin: 6px 0 0;
  display: block;
  /* Фиксирана височина за до 2 реда заглавие,
     за да са подравнени картите независимо от дължината */
  min-height: 2.6em;
  line-height: 1.3;
  overflow: hidden;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  margin-top: 6px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:600;
  color: #111827;
`;

const Subtitle = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 2px;
`;

const ZoomLens = styled.div`
  position: absolute;
  border-radius: 999px;
  border: 2px solid rgba(22, 163, 74, 0.9);
  box-shadow: 0 0 10px rgba(0,0,0,0.25);
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
`;

export default function ProductBox({
  _id,
  slug,
  title,
  price,
  currency,
  images,
}) {
  const {addProduct} = useContext(CartContext);
  const {addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();
  // Винаги използваме slug, ако съществува, иначе fallback към _id
  const url = '/bouquet/'+(slug || _id);
  const inWishlist = isInWishlist(_id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(_id);
      toast.success(`${title} е премахнат от желаните!`, {
        icon: '💔',
        duration: 3000,
      });
    } else {
      addToWishlist(_id);
      toast.success(`${title} е добавен в желаните!`, {
        icon: '❤️',
        duration: 3000,
      });
    }
  };

  const [isDesktop, setIsDesktop] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lensState, setLensState] = useState({
    visible: false,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const touchStartXRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mainImage = images?.[currentIndex] || images?.[0] || null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(_id);
    toast.success(`${title} е добавен в кошницата!`, {
      icon: '🛒',
      duration: 2500,
    });
  };

  function handleMouseMove(e) {
    if (!isDesktop || !mainImage) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const lensSize = 110;
    const half = lensSize / 2;
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(half, Math.min(rect.width - half, x));
    y = Math.max(half, Math.min(rect.height - half, y));

    setLensState({
      visible: true,
      x,
      y,
      width: rect.width,
      height: rect.height,
      size: lensSize,
    });
  }

  function handleMouseLeave() {
    if (!isDesktop) return;
    setLensState((prev) => ({ ...prev, visible: false }));
  }

  function handleTouchStart(e) {
    if (isDesktop || !images || images.length < 2) return;
    touchStartXRef.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (isDesktop || !images || images.length < 2) return;
    if (touchStartXRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const threshold = 40;
    if (Math.abs(deltaX) < threshold) {
      touchStartXRef.current = null;
      return;
    }

    // Спираме навигацията, ако е реален свайп
    e.preventDefault();
    e.stopPropagation();

    setCurrentIndex((prev) => {
      if (deltaX < 0) {
        // swipe наляво -> следваща снимка
        return (prev + 1) % images.length;
      }
      // swipe надясно -> предишна снимка
      return (prev - 1 + images.length) % images.length;
    });

    touchStartXRef.current = null;
  }

  return (
    <ProductWrapper
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <WishlistButton 
        filled={inWishlist}
        onClick={handleWishlistClick}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon filled={inWishlist} className="w-5 h-5" />
      </WishlistButton>
      <WhiteBox href={url}>
        <ThumbWrapper
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images?.[0] ? (
            <Image 
              src={mainImage} 
              alt={title}
              width={220}
              height={120}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              loading="lazy"
              unoptimized={mainImage?.includes('s3.amazonaws.com')}
            />
          ) : (
            <PlaceholderThumb>
              <BookPlaceholderIcon size={32} />
            </PlaceholderThumb>
          )}
          {isDesktop && lensState.visible && mainImage && (
            <ZoomLens
              style={{
                width: lensState.size,
                height: lensState.size,
                left: lensState.x - lensState.size / 2,
                top: lensState.y - lensState.size / 2,
                backgroundImage: `url(${mainImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: `${lensState.width * 2}px ${lensState.height * 2}px`,
                backgroundPosition: `${
                  -(lensState.x * 2 - lensState.size / 2)
                }px ${
                  -(lensState.y * 2 - lensState.size / 2)
                }px`,
              }}
            />
          )}
        </ThumbWrapper>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          {typeof price === 'number' && (
            <Price>
              {price.toFixed(2)} EUR
            </Price>
          )}
          <Subtitle>Ръчно подбран букет, подготвен при поръчка.</Subtitle>
          <Button primary size="s" onClick={handleAddToCart}>
            Добави в кошницата
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}