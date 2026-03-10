import styled from "styled-components";
import HeartIcon from "@/components/icons/Heart";
import Link from "next/link";
import Image from "next/image";
import {useWishlist} from "@/components/WishlistContext";
import toast from "react-hot-toast";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";
import Button from "@/components/Button";
import {useContext} from "react";
import {CartContext} from "@/components/CartContext";

const ProductWrapper = styled.div`
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
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;
const PlaceholderThumb = styled.div`
  width: 80px;
  height: 80px;
  border: 1px dashed #d4d4d8;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: #f9fafb;
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
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
  const url = '/trip/'+(slug || _id);
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addProduct(_id);
    toast.success(`${title} е добавен в кошницата!`, {
      icon: '🛒',
      duration: 2500,
    });
  };

  return (
    <ProductWrapper>
      <WishlistButton 
        filled={inWishlist}
        onClick={handleWishlistClick}
        title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon filled={inWishlist} className="w-5 h-5" />
      </WishlistButton>
      <WhiteBox href={url}>
        <div>
          {images?.[0] ? (
              <Image 
              src={images[0]} 
              alt={title}
              width={120}
              height={80}
              style={{
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
              loading="lazy"
              unoptimized={images[0]?.includes('s3.amazonaws.com')}
            />
          ) : (
            <PlaceholderThumb>
              <BookPlaceholderIcon size={32} />
            </PlaceholderThumb>
          )}
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          {typeof price === 'number' && (
            <Price>
              {price.toFixed(2)} {currency || 'BGN'}
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