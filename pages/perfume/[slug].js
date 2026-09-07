import Center from "@/components/Center";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import {useContext, useEffect, useState} from "react";
import Button from "@/components/Button";
import OrderButton from "@/components/OrderButton";
import SEO from "@/components/SEO";
import {CartContext} from "@/components/CartContext";
import {getRecaptchaToken} from "@/lib/recaptcha";
import RecaptchaScript from "@/components/RecaptchaScript";
import {useRouter} from "next/router";
import {canonicalVariant, productPath} from "@/lib/productVariants";
import {buildProductStructuredData, perfumePageIntro, perfumeSeoDescription, perfumeSeoKeywords, perfumeSeoTitle, productPageIntro, productSeoDescription, productSeoKeywords, productSeoTitle} from "@/lib/seo";
import RecommendedProducts from "@/components/RecommendedProducts";
import {getProductPageProps} from "@/lib/loadProductPage";
import SalePrice from "@/components/SalePrice";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

const Specs = styled.div`
  margin-top: 12px;
  font-size: 1rem;
  color: #444;
  font-weight: 500;

  div + div {
    margin-top: 8px;
  }
`;

const ReviewsSection = styled.section`
  margin: 40px 0 60px;
`;
const ReviewsTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 16px;
`;
const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media screen and (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Card = styled(WhiteBox)`
  padding: 20px;
`;
const Stars = styled.div`
  display: flex;
  gap: 6px;
  margin: 6px 0 12px;
`;
const StarBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: ${props => props.active ? '#c9a227' : '#cbd5e1'};
  padding: 0;
  transition: color .15s ease;
  &:hover { color: ${props => props.active ? '#d4af37' : '#c9a227'}; }
`;
const InputEl = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #c9a227;
  }
`;
const TextareaEl = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  min-height: 90px;
  margin-bottom: 12px;
  resize: vertical;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #c9a227;
  }
`;
const SmallMuted = styled.div`
  font-size: .85rem;
  color: #9ca3af;
`;

const BrandLine = styled.p`
  margin: 4px 0 0;
  color: #6b6254;
  font-size: 1.05rem;
`;

const Intro = styled.p`
  margin: 18px 0 0;
  color: #374151;
  line-height: 1.7;
  font-size: 1rem;
`;

const VolumeSelect = styled.select`
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #c9a227;
  }
`;

const StorySection = styled.section`
  margin: 10px 0 50px;
`;

const StoryTitle = styled.h2`
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 0 14px;
`;

const StoryBlock = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px 22px;
  margin-bottom: 16px;
  line-height: 1.7;
  color: #374151;
`;

const NotesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  @media screen and (min-width: 700px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const NoteCard = styled.div`
  background: #faf8f2;
  border-radius: 10px;
  padding: 14px 16px;
  h3 {
    margin: 0 0 6px;
    font-size: 0.92rem;
    color: #c9a227;
    font-weight: 600;
  }
  p {
    margin: 0;
    color: #374151;
  }
`;

const FaqItem = styled.div`
  & + & {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid #eee;
  }
  strong {
    display: block;
    margin-bottom: 4px;
    color: #111;
  }
`;

export default function PerfumePage({
  product,
  variants = [],
  recommendedProducts = [],
  isPerfume = true,
  pathPrefix = '/perfume',
  breadcrumbs: crumbItems,
}) {
  const router = useRouter();
  const [reviews,setReviews] = useState([]);
  const [rating,setRating] = useState(5);
  const [titleText,setTitleText] = useState('');
  const [content,setContent] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [userEmail,setUserEmail] = useState('');
  const {addProduct} = useContext(CartContext);
  useEffect(() => {
    fetch(`/api/reviews?product=${product._id}`).then(r=>r.json()).then(setReviews);
  }, [product._id]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedEmail = window.localStorage.getItem('userEmail');
    if (savedEmail) setUserEmail(savedEmail);
  }, []);
  async function submitReview(e){
    e.preventDefault();
    if (!userEmail) {
      alert('Моля, влезте в акаунта си, за да оставите ревю.');
      return;
    }
    if (!titleText.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const recaptchaToken = await getRecaptchaToken('review');
      const res = await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:product._id,rating:Number(rating),title:titleText.trim(),content:content.trim(),email:userEmail,recaptchaToken})});
      if (res.ok){
        setTitleText(''); setContent(''); setRating(5);
        const list = await fetch(`/api/reviews?product=${product._id}`).then(r=>r.json());
        setReviews(list);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Грешка при изпращане на ревюто.');
      }
    } catch (error) {
      alert(error?.message || 'Грешка при изпращане на ревюто.');
    } finally { setSubmitting(false); }
  }
  
  const productDescription = isPerfume
    ? perfumeSeoDescription(product, variants)
    : productSeoDescription(product);
  
  let productImage = '/parfumes_sell.png';
  if (product.images?.[0]) {
    productImage = product.images[0];
  }
  const canonical = canonicalVariant(variants, product);
  const canonicalPath = productPath({ ...canonical, pathPrefix });
  const breadcrumbs = crumbItems?.length
    ? crumbItems
    : [
        { name: 'Начало', url: '/' },
        { name: isPerfume ? 'Оригинални парфюми' : 'Категории', url: isPerfume ? '/category/parfyumi' : '/categories' },
        { name: product.title, url: canonicalPath },
      ];

  return (
    <>
      <RecaptchaScript />
      <SEO 
        title={isPerfume ? perfumeSeoTitle(product) : productSeoTitle(product)}
        description={productDescription}
        keywords={isPerfume ? perfumeSeoKeywords(product) : productSeoKeywords(product)}
        image={productImage}
        url={canonicalPath}
        type="product"
        breadcrumbs={breadcrumbs}
        structuredData={buildProductStructuredData(product, variants, { perfume: isPerfume })}
      />
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            {product.brand && (
              <BrandLine>{isPerfume ? `Оригинален парфюм ${product.brand}` : product.brand}</BrandLine>
            )}
            <Specs>
              {product.brand && (
                <div><strong>Марка:</strong> {product.brand}</div>
              )}
              {(variants.filter(item => item.volume).length > 1 || product.volume) && (
                <div>
                  <strong>Обем:</strong>
                  {variants.filter(item => item.volume).length > 1 ? (
                    <VolumeSelect
                      value={String(product._id)}
                      onChange={(e) => {
                        const next = variants.find(item => String(item._id) === e.target.value);
                        if (!next) return;
                        router.push(productPath({ ...next, pathPrefix }));
                      }}
                    >
                      {variants.map(item => (
                        <option key={item._id} value={String(item._id)}>
                          {item.volume}
                          {typeof item.price === 'number' ? ` — ${item.price.toFixed(2)} EUR` : ''}
                        </option>
                      ))}
                    </VolumeSelect>
                  ) : (
                    <> {product.volume}</>
                  )}
                </div>
              )}
              {product.concentration && (
                <div><strong>Концентрация:</strong> {product.concentration}</div>
              )}
              {product.gender && (
                <div><strong>За кого е:</strong> {product.gender}</div>
              )}
              {typeof product.price === 'number' && (
                <div>
                  <strong>Цена:</strong>
                  <div style={{marginTop: 6}}>
                    <SalePrice
                      price={product.price}
                      compareAtPrice={product.compareAtPrice}
                      currency={product.currency || 'EUR'}
                    />
                  </div>
                </div>
              )}
              {typeof product.stock === 'number' && (
                <div style={{color: product.stock > 0 ? '#c9a227' : '#dc2626'}}>
                  {product.stock > 0 ? `Наличност: ${product.stock} бр.` : 'Изчерпан продукт'}
                </div>
              )}
            </Specs>
            <Intro>{isPerfume ? perfumePageIntro(product, variants) : productPageIntro(product)}</Intro>
            <PriceRow style={{marginTop: '24px'}}>
              <OrderButton
                size="l"
                onClick={() => addProduct(product._id)}
                outOfStock={product.stock !== undefined && product.stock <= 0}
              />
            </PriceRow>
          </div>
        </ColWrapper>
        <StorySection>
          {isPerfume && (product.topNotes || product.heartNotes || product.baseNotes) && (
            <StoryBlock>
              <StoryTitle>Ароматна композиция</StoryTitle>
              <NotesGrid>
                {product.topNotes && (
                  <NoteCard>
                    <h3>Връхни нотки</h3>
                    <p>{product.topNotes}</p>
                  </NoteCard>
                )}
                {product.heartNotes && (
                  <NoteCard>
                    <h3>Сърдечни нотки</h3>
                    <p>{product.heartNotes}</p>
                  </NoteCard>
                )}
                {product.baseNotes && (
                  <NoteCard>
                    <h3>Базови нотки</h3>
                    <p>{product.baseNotes}</p>
                  </NoteCard>
                )}
              </NotesGrid>
            </StoryBlock>
          )}
          {isPerfume && (product.scentFamily || product.concentration || product.gender) && (
            <StoryBlock>
              <StoryTitle>Характеристики</StoryTitle>
              {product.scentFamily && <p>Ароматно семейство: {product.scentFamily}.</p>}
              {product.concentration && <p>Концентрация: {product.concentration}.</p>}
              {product.gender && <p>Подходящ като {product.gender.toLowerCase()} аромат.</p>}
              {product.volume && <p>Наличен обем: {product.volume}.</p>}
            </StoryBlock>
          )}
          <StoryBlock>
            <StoryTitle>Често задавани въпроси</StoryTitle>
            {isPerfume ? (
              <>
                <FaqItem>
                  <strong>Оригинален ли е този парфюм?</strong>
                  Да. {product.title}{product.brand ? ` от ${product.brand}` : ''} се предлага като оригинален тестер в оригинална опаковка.
                </FaqItem>
                <FaqItem>
                  <strong>Подходящ ли е за подарък?</strong>
                  Да. Оригиналният парфюм в оригинална кутия е сигурен избор за подарък.
                </FaqItem>
                <FaqItem>
                  <strong>Как да го съхранявам?</strong>
                  На хладно и тъмно място, далеч от пряко слънце и радиатор, най-добре в кутията.
                </FaqItem>
              </>
            ) : (
              <>
                <FaqItem>
                  <strong>Оригинален ли е този продукт?</strong>
                  Да. {product.title}{product.brand ? ` от ${product.brand}` : ''} е оригинален продукт.
                </FaqItem>
                <FaqItem>
                  <strong>Подходящ ли е за подарък?</strong>
                  Да. Подходящ е за подарък.
                </FaqItem>
              </>
            )}
            <FaqItem>
              <strong>Доставяте ли в цяла България?</strong>
              Да. Поръчвате онлайн и изпращаме с куриер до посочения адрес.
            </FaqItem>
          </StoryBlock>
        </StorySection>
        <ReviewsSection>
          <ReviewsTitle>Ревюта</ReviewsTitle>
          <ReviewsGrid>
            <Card>
              <h3 className="font-semibold mb-2">Добави ревю</h3>
              <form onSubmit={submitReview}>
                <Stars>
                  {[1,2,3,4,5].map(n => (
                    <StarBtn key={n} type="button" active={n <= rating} onClick={()=>setRating(n)} aria-label={`Рейтинг ${n}`}>
                      {n <= rating ? '★' : '☆'}
                    </StarBtn>
                  ))}
                </Stars>
                <InputEl type="text" placeholder="Заглавие на ревюто" value={titleText} onChange={e=>setTitleText(e.target.value)} />
                <TextareaEl placeholder="Беше ли добро? Плюсове? Минуси?" value={content} onChange={e=>setContent(e.target.value)} />
                <Button black disabled={submitting}>
                  {submitting ? 'Изпращане...' : 'Изпрати ревю'}
                </Button>
                <SmallMuted style={{marginTop: '12px'}}>
                  Този сайт е защитен с reCAPTCHA и важат{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Поверителност</a>
                  {' '}и{' '}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Условия</a> на Google.
                </SmallMuted>
              </form>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">Всички ревюта</h3>
              {reviews.length === 0 && <div>Няма ревюта.</div>}
              {reviews.map(r => (
                <div key={r._id} style={{borderTop:'1px solid #eee', paddingTop:12, marginTop:12}}>
                  <div style={{color:'#c9a227'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <div className="font-semibold">{r.title}</div>
                  <SmallMuted>{new Date(r.createdAt).toLocaleString()}</SmallMuted>
                  <div className="mt-1">{r.content}</div>
                </div>
              ))}
            </Card>
          </ReviewsGrid>
        </ReviewsSection>
        <RecommendedProducts products={recommendedProducts} />
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  return getProductPageProps(context, 'perfume');
}
