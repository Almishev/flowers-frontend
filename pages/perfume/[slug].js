import Center from "@/components/Center";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import {useContext, useEffect, useState} from "react";
import Button from "@/components/Button";
import SEO from "@/components/SEO";
import {CartContext} from "@/components/CartContext";
import {getRecaptchaToken} from "@/lib/recaptcha";
import {useRouter} from "next/router";
import {findSiblingVariants} from "@/lib/productVariants";

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

export default function PerfumePage({product, variants = []}) {
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
  
  const productDescription = product.description
    ? `Оригинален парфюм ${product.brand ? `${product.brand} ` : ''}${product.title}. ${product.description.substring(0, 140)}`
    : `Оригинален парфюм ${product.brand ? `${product.brand} ` : ''}"${product.title}" от DÉLIE. Купете онлайн с доставка в цяла България.`;
  
  let productImage = '/parfumes_sell.png';
  if (product.images?.[0]) {
    productImage = product.images[0];
  }
  const slugOrId = product.slug || product._id;
  const breadcrumbs = [
    { name: 'Начало', url: '/' },
    { name: 'Всички парфюми', url: '/perfumes' },
    { name: product.title, url: `/perfume/${slugOrId}` },
  ];

  return (
    <>
      <SEO 
        title={`${product.title}${product.brand ? ` ${product.brand}` : ''} – оригинален парфюм | DÉLIE`}
        description={productDescription}
        keywords={[product.title, product.brand, product.volume, 'оригинален парфюм', 'оригинални парфюми', 'DÉLIE'].filter(Boolean).join(', ')}
        image={productImage}
        url={`/perfume/${slugOrId}`}
        breadcrumbs={breadcrumbs}
      />
      <Header />
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
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
                        router.push(`/perfume/${next.slug || next._id}`);
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
                <div><strong>Цена:</strong> {product.price.toFixed(2)} EUR</div>
              )}
              {typeof product.stock === 'number' && (
                <div style={{color: product.stock > 0 ? '#c9a227' : '#dc2626'}}>
                  {product.stock > 0 ? `Наличност: ${product.stock} бр.` : 'Изчерпан продукт'}
                </div>
              )}
            </Specs>
            {product.description && (
              <p style={{marginTop: '16px'}}>{product.description}</p>
            )}
            <PriceRow style={{marginTop: '24px'}}>
              <Button 
                black 
                onClick={() => addProduct(product._id)}
                disabled={product.stock !== undefined && product.stock <= 0}
              >
                Добави в кошницата
              </Button>
            </PriceRow>
          </div>
        </ColWrapper>
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
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {slug} = context.query;
  
  let product = await Product.findOne({ slug }).populate({
    path: 'category',
    model: Category,
  });
  
  if (!product && slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
    product = await Product.findById(slug).populate({
      path: 'category',
      model: Category,
    });
  }
  
  if (!product) {
    return {
      notFound: true,
    };
  }

  const variants = await findSiblingVariants(Product, product);
  
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(variants)),
    }
  }
}
