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
  color: ${props => props.active ? '#16a34a' : '#cbd5e1'};
  padding: 0;
  transition: color .15s ease;
  &:hover { color: ${props => props.active ? '#9a7209' : '#94a3b8'}; }
`;
const InputEl = styled.input`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
`;
const TextareaEl = styled.textarea`
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  min-height: 90px;
  margin-bottom: 12px;
  resize: vertical;
`;
const SmallMuted = styled.div`
  font-size: .85rem;
  color: #9ca3af;
`;

export default function BouquetPage({product}) {
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
      const res = await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product:product._id,rating:Number(rating),title:titleText.trim(),content:content.trim(),email:userEmail})});
      if (res.ok){
        setTitleText(''); setContent(''); setRating(5);
        const list = await fetch(`/api/reviews?product=${product._id}`).then(r=>r.json());
        setReviews(list);
      }
    } finally { setSubmitting(false); }
  }
  
  const tripDescription = product.description 
    ? `${product.description.substring(0, 150)}...` 
    : `Букет "${product.title}" от Flowers Boutique MIA.`;
  
  let tripImage = '/logo-shop-flowers.png';
  if (product.images?.[0]) {
    tripImage = product.images[0];
  }
  const slugOrId = product.slug || product._id;
  const breadcrumbs = [
    { name: 'Начало', url: '/' },
    { name: 'Всички букети', url: '/bouquets' },
    { name: product.title, url: `/bouquet/${slugOrId}` },
  ];

  return (
    <>
      <SEO 
        title={product.title}
        description={tripDescription}
        image={tripImage}
        url={`/bouquet/${slugOrId}`}
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
            <div style={{marginTop: '12px', fontSize: '1rem', color: '#444', fontWeight: 500}}>
              {typeof product.price === 'number' && (
                <div><strong>Цена:</strong> {product.price.toFixed(2)} EUR</div>
              )}
              {typeof product.stock === 'number' && (
                <div style={{marginTop: '8px', color: product.stock > 0 ? '#16a34a' : '#dc2626'}}>
                  {product.stock > 0 ? `Наличност: ${product.stock} бр.` : 'Изчерпан продукт'}
                </div>
              )}
            </div>
            {product.description && (
              <p style={{marginTop: '16px'}}>{product.description}</p>
            )}
            <PriceRow style={{marginTop: '24px'}}>
              <Button 
                primary 
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
                <Button primary disabled={submitting}>
                  {submitting ? 'Изпращане...' : 'Изпрати ревю'}
                </Button>
              </form>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">Всички ревюта</h3>
              {reviews.length === 0 && <div>Няма ревюта.</div>}
              {reviews.map(r => (
                <div key={r._id} style={{borderTop:'1px solid #eee', paddingTop:12, marginTop:12}}>
                  <div style={{color:'#16a34a'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
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
  
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}

