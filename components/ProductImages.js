import styled from "styled-components";
import {useEffect, useState} from "react";
import Image from "next/image";
import BookPlaceholderIcon from "@/components/BookPlaceholderIcon";

// Image components са заменени с Next.js Image за lazy loading
const ImageButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;
const ImageButton = styled.div`
  border: 2px solid #ccc;
  ${props => props.active ? `
    border-color: #ccc;
  ` : `
    border-color: transparent;
  `}
  width: 40px;
  height: 40px;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
  flex: 0 0 40px;
`;
const BigImageWrapper = styled.div`
  text-align: center;
`;
const PlaceholderWrapper = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InnerPlaceholder = styled.div`
  width: 90%;
  height: 90%;
  border: 1px dashed #d4d4d8;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
`;

export default function ProductImages({images = []}) {
  const hasImages = images.length > 0;
  const [activeImage,setActiveImage] = useState(hasImages ? images[0] : null);

  useEffect(() => {
    setActiveImage(hasImages ? images[0] : null);
  }, [hasImages, images]);

  if (!hasImages) {
    return (
      <PlaceholderWrapper>
        <InnerPlaceholder>
          <BookPlaceholderIcon size={64} />
        </InnerPlaceholder>
      </PlaceholderWrapper>
    );
  }

  return (
    <>
      <BigImageWrapper>
        <Image 
          src={activeImage} 
          alt=""
          width={400}
          height={200}
          style={{
            maxWidth: '100%',
            maxHeight: '200px',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
          loading="lazy"
          unoptimized={activeImage?.includes('s3.amazonaws.com')}
        />
      </BigImageWrapper>
      <ImageButtons>
        {images.map(image => (
          <ImageButton
            key={image}
            active={image===activeImage}
            onClick={() => setActiveImage(image)}>
            <Image 
              src={image} 
              alt=""
              width={40}
              height={40}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              loading="lazy"
              unoptimized={image?.includes('s3.amazonaws.com')}
            />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}