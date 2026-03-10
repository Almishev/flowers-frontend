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
import {useEffect, useState} from "react";
import Button from "@/components/Button";
import SEO from "@/components/SEO";

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
  color: ${props => props.active ? '#b8860b' : '#cbd5e1'};
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

const CTASection = styled.div`
  margin-top: 30px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
`;

const CTATitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #212529;
`;

const CTAText = styled.p`
  font-size: 0.95rem;
  color: #495057;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media screen and (min-width: 769px) {
    display: none;
  }
  
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const PhoneNumber = styled.div`
  display: none;
  
  @media screen and (min-width: 769px) {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.4rem;
    font-weight: 600;
    color: #212529;
  }
`;

const PhoneLink = styled.a`
  color: #b8860b;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #9a7209;
    text-decoration: underline;
  }
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
`;

export default function TripPage({product}) {
  const [reviews,setReviews] = useState([]);
  const [rating,setRating] = useState(5);
  const [titleText,setTitleText] = useState('');
  const [content,setContent] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [userEmail,setUserEmail] = useState('');
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
    : `Екскурзия "${product.title}" до ${product.destinationCountry || ''} ${product.destinationCity || ''}.`;
  
  // Взимаме първото изображение или fallback към логото
  // Ако изображението е от S3 или друг външен източник, използваме го директно
  let tripImage = '/logo.png';
  if (product.images?.[0]) {
    tripImage = product.images[0];
  }
  const breadcrumbs = [
    { name: 'Начало', url: '/' },
    { name: 'Всички екскурзии', url: '/trips' },
    { name: product.title, url: `/trip/${product.slug || product._id}` },
  ];

  return (
    <>
      <SEO 
        title={product.title}
        description={tripDescription}
        image={tripImage}
        url={`/trip/${product.slug || product._id}`}
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
            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.95rem', color: '#666'}}>
              {(product.destinationCountry || product.destinationCity) && (
                <div>
                  <strong>Дестинация:</strong>{' '}
                  {product.destinationCountry || ''}
                  {product.destinationCity ? `, ${product.destinationCity}` : ''}
                </div>
              )}
              {product.departureCity && (
                <div><strong>Отпътуване от:</strong> {product.departureCity}</div>
              )}
              {product.startDate && (
                <div><strong>Начална дата:</strong> {new Date(product.startDate).toLocaleDateString('bg-BG')}</div>
              )}
              {product.endDate && (
                <div><strong>Крайна дата:</strong> {new Date(product.endDate).toLocaleDateString('bg-BG')}</div>
              )}
              {product.durationDays && (
                <div><strong>Продължителност:</strong> {product.durationDays} дни</div>
              )}
              {typeof product.price === 'number' && (
                <div><strong>Цена:</strong> {product.price.toFixed(2)} {product.currency || 'BGN'}</div>
              )}
            </div>
            {product.description && (
              <p style={{marginTop: '16px'}}>{product.description}</p>
            )}
            <PriceRow>
              <div>
                {(product.maxSeats !== undefined || product.availableSeats !== undefined) && (
                  <div style={{fontSize: '1.1rem', color: (product.availableSeats ?? 0) > 0 ? '#16a34a' : '#dc2626', marginTop: '16px', fontWeight: '500'}}>
                    {(product.availableSeats ?? 0) > 0
                      ? '✓ Има свободни места'
                      : '✗ Няма свободни места'}
                  </div>
                )}
              </div>
            </PriceRow>
            
            <CTASection>
              <CTATitle>Искате да резервирате?</CTATitle>
              <CTAText>
                Свържете се с нас за резервация или за повече информация за тази екскурзия. Отговаряме бързо и ще помогнем с всичко необходимо!
              </CTAText>
              <PhoneNumber>
                <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <IconWrapper>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '24px', height: '24px', color: '#b8860b'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102c-.125-.501-.575-.852-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </IconWrapper>
                    <PhoneLink href="tel:+359896270105">0896 270 105</PhoneLink>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <IconWrapper>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '24px', height: '24px', color: '#b8860b'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102c-.125-.501-.575-.852-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </IconWrapper>
                    <PhoneLink href="tel:+359896178447">0896 178 447</PhoneLink>
                  </div>
                </div>
              </PhoneNumber>
              <CTAButtons>
                <a 
                  href="tel:+359896270105" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    backgroundColor: '#b8860b',
                    color: '#000',
                    border: '1px solid #b8860b',
                    flex: '1',
                    minWidth: '160px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  <IconWrapper>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102c-.125-.501-.575-.852-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </IconWrapper>
                  Обадете се на 0896 270 105
                </a>
                <a 
                  href="tel:+359896178447" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    backgroundColor: '#b8860b',
                    color: '#000',
                    border: '1px solid #b8860b',
                    flex: '1',
                    minWidth: '160px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  <IconWrapper>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{width: '20px', height: '20px'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102c-.125-.501-.575-.852-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </IconWrapper>
                  Обадете се на 0896 178 447
                </a>
                <a 
                  href="viber://chat?number=%2B359896270105" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #665CAC 0%, #7B6FBF 100%)',
                    border: 'none',
                    color: 'white',
                    flex: '1',
                    minWidth: '160px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 12px rgba(102, 92, 172, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 92, 172, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 92, 172, 0.3)';
                  }}
                >
                  <IconWrapper>
                    <svg viewBox="0 0 24 24" fill="white" style={{width: '20px', height: '20px'}}>
                      <path d="M12.5 0C5.6 0 0 5.1 0 11.4c0 3.2 1.6 6 4 7.7V24l5.3-2.9c1.4.4 2.9.6 4.2.6 6.9 0 12.5-5.1 12.5-11.4S19.4 0 12.5 0zm6.9 15.4c-.2.6-1.1 1.1-1.5 1.2-.4.1-.9.2-2.1-.4-1.7-.8-3.9-2.7-5.4-4.3-2.1-2.1-3.5-4.6-3.9-5.4-.4-.8-.4-1.2.1-1.6.4-.3.9-.4 1.2-.4.3 0 .6 0 .9.1.3.1.7.4.9.7.2.3.4.7.6 1.1.2.4.3.7.5 1 .2.3.1.6 0 .8-.1.2-.2.4-.4.6-.2.2-.4.5-.6.7-.2.2-.4.4-.2.7.2.3.4.6.8 1 .4.4.8.8 1.2 1.1.5.4 1 .7 1.4.9.4.2.7.2.9 0 .2-.2.4-.5.7-.8.3-.3.6-.5.9-.7.3-.2.6-.1.8 0 .2.1.5.2.7.4.2.2.3.4.4.6.1.2.1.5 0 .7z"/>
                    </svg>
                  </IconWrapper>
                  Пишете във Viber (0896 270 105)
                </a>
                <a 
                  href="viber://chat?number=%2B359896178447" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 16px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #665CAC 0%, #7B6FBF 100%)',
                    border: 'none',
                    color: 'white',
                    flex: '1',
                    minWidth: '160px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Poppins, sans-serif',
                    boxShadow: '0 4px 12px rgba(102, 92, 172, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 92, 172, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 92, 172, 0.3)';
                  }}
                >
                  <IconWrapper>
                    <svg viewBox="0 0 24 24" fill="white" style={{width: '20px', height: '20px'}}>
                      <path d="M12.5 0C5.6 0 0 5.1 0 11.4c0 3.2 1.6 6 4 7.7V24l5.3-2.9c1.4.4 2.9.6 4.2.6 6.9 0 12.5-5.1 12.5-11.4S19.4 0 12.5 0zm6.9 15.4c-.2.6-1.1 1.1-1.5 1.2-.4.1-.9.2-2.1-.4-1.7-.8-3.9-2.7-5.4-4.3-2.1-2.1-3.5-4.6-3.9-5.4-.4-.8-.4-1.2.1-1.6.4-.3.9-.4 1.2-.4.3 0 .6 0 .9.1.3.1.7.4.9.7.2.3.4.7.6 1.1.2.4.3.7.5 1 .2.3.1.6 0 .8-.1.2-.2.4-.4.6-.2.2-.4.5-.6.7-.2.2-.4.4-.2.7.2.3.4.6.8 1 .4.4.8.8 1.2 1.1.5.4 1 .7 1.4.9.4.2.7.2.9 0 .2-.2.4-.5.7-.8.3-.3.6-.5.9-.7.3-.2.6-.1.8 0 .2.1.5.2.7.4.2.2.3.4.4.6.1.2.1.5 0 .7z"/>
                    </svg>
                  </IconWrapper>
                  Пишете във Viber (0896 178 447)
                </a>
              </CTAButtons>
            </CTASection>
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
  
  // Първо опитваме да намерим по slug
  let product = await Product.findOne({ slug }).populate({
    path: 'category',
    model: Category,
  });
  
  // Ако не намери по slug, опитваме по ID (за обратна съвместимост със стари линкове)
  if (!product) {
    // Проверяваме дали slug изглежда като ObjectId (24 символа hex)
    if (slug && /^[0-9a-fA-F]{24}$/.test(slug)) {
      product = await Product.findById(slug).populate({
        path: 'category',
        model: Category,
      });
    }
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

