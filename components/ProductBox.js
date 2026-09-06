import styled from "styled-components";
import HeartIcon from "@/components/icons/Heart";
import Link from "next/link";
import Image from "next/image";
import {useWishlist} from "@/components/WishlistContext";
import toast from "react-hot-toast";
import ProductPlaceholderIcon from "@/components/ProductPlaceholderIcon";
import Button from "@/components/Button";
import {useContext, useEffect, useRef, useState} from "react";
import {CartContext} from "@/components/CartContext";
import {productPath} from "@/lib/productVariants";
import {isS3ImageUrl} from "@/lib/isS3Image";
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
    box-shadow: 0 0 0 2px #c9a227;
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

  @media (max-width: 768px) {
    height: 190px;
  }
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

  @media (max-width: 768px) {
    max-width: 260px;
    height: 160px;
  }
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
  transition: color 0.2s ease;

  &:hover {
    color: #c9a227;
  }
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

const Volume = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
`;

const VolumeSelect = styled.select`
  width: 100%;
  margin-top: 2px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #c9a227;
  }
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
  volume,
  stock,
  variants,
  pathPrefix,
  category,
}) {
  const allVariants = (variants?.length
    ? variants
    : [{ _id, slug, volume, price, stock, images }]
  ).filter(Boolean);
  const hasVolumeOptions = allVariants.filter(item => item.volume).length > 1;

  const [selectedId, setSelectedId] = useState(String(_id));
  const selected = allVariants.find(item => String(item._id) === selectedId) || allVariants[0] || {
    _id, slug, volume, price, stock, images,
  };

  useEffect(() => {
    setSelectedId(String(_id));
  }, [_id]);

  const {addProduct} = useContext(CartContext);
  const {addToWishlist, removeFromWishlist, isInWishlist} = useWishlist();
  const url = productPath({
    ...selected,
    pathPrefix: selected.pathPrefix || pathPrefix,
    category: selected.category || category,
  });
  const inWishlist = isInWishlist(selected._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(selected._id);
      toast.success(`${title} е премахнат от желаните!`, {
        icon: '💔',
        duration: 3000,
      });
    } else {
      addToWishlist(selected._id);
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

  const selectedImages = selected.images?.length ? selected.images : images;
  const mainImage = selectedImages?.[currentIndex] || selectedImages?.[0] || null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(selected._id);
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
    if (isDesktop || !mainImage) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const lensSize = 110;
    const half = lensSize / 2;
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

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

    touchStartXRef.current = touch.clientX;
  }

  function handleTouchMove(e) {
    if (isDesktop || !mainImage) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const lensSize = 110;
    const half = lensSize / 2;
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;

    x = Math.max(half, Math.min(rect.width - half, x));
    y = Math.max(half, Math.min(rect.height - half, y));

    setLensState((prev) => ({
      ...prev,
      visible: true,
      x,
      y,
      width: rect.width,
      height: rect.height,
      size: lensSize,
    }));
  }

  function handleTouchEnd(e) {
    if (isDesktop || !selectedImages) return;
    if (touchStartXRef.current !== null && selectedImages.length >= 2) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const threshold = 40;
      if (Math.abs(deltaX) >= threshold) {
        e.preventDefault();
        e.stopPropagation();

        setCurrentIndex((prev) => {
          if (deltaX < 0) {
            return (prev + 1) % selectedImages.length;
          }
          return (prev - 1 + selectedImages.length) % selectedImages.length;
        });
      }
    }

    touchStartXRef.current = null;
    setLensState((prev) => ({ ...prev, visible: false }));
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
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {selectedImages?.[0] ? (
            <Image 
              src={mainImage} 
              alt={title}
              width={260}
              height={160}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              loading="lazy"
              unoptimized={isS3ImageUrl(mainImage)}
            />
          ) : (
            <PlaceholderThumb>
              <ProductPlaceholderIcon size={32} />
            </PlaceholderThumb>
          )}
          {lensState.visible && mainImage && (
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
        {hasVolumeOptions ? (
          <VolumeSelect
            value={String(selected._id)}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setCurrentIndex(0);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {allVariants.map(item => (
              <option key={item._id} value={String(item._id)}>
                {item.volume || 'Обем'}
                {typeof item.price === 'number' ? ` — ${item.price.toFixed(2)} EUR` : ''}
              </option>
            ))}
          </VolumeSelect>
        ) : (
          (selected.volume || volume) && <Volume>{selected.volume || volume}</Volume>
        )}
        <PriceRow>
          {typeof selected.price === 'number' && (
            <Price>
              {selected.price.toFixed(2)} EUR
            </Price>
          )}
          <Button
            black
            size="s"
            onClick={handleAddToCart}
            disabled={selected.stock !== undefined && selected.stock <= 0}
          >
            {selected.stock !== undefined && selected.stock <= 0 ? 'Изчерпан' : 'Добави в кошницата'}
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}