import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import Footer from "@/components/Footer";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const PaymentMethodContainer = styled.div`
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 2px solid #eee;
`;

const PaymentMethodLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid ${props => props.selected ? '#222' : '#ddd'};
  background-color: ${props => props.selected ? '#f0f0f0' : '#fff'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #222;
    background-color: #f9f9f9;
  }
  
  input[type="radio"] {
    margin-right: 12px;
    cursor: pointer;
  }
  
  .payment-info {
    flex: 1;
    
    .payment-title {
      font-weight: 600;
      margin-bottom: 4px;
      color: #222;
    }
    
    .payment-description {
      font-size: 0.9rem;
      color: #666;
    }
  }
`;

export default function CartPage() {
  const {cartProducts,addProduct,removeProduct,clearCart} = useContext(CartContext);
  const [products,setProducts] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [city,setCity] = useState('');
  const [postalCode,setPostalCode] = useState('');
  const [streetAddress,setStreetAddress] = useState('');
  const [country,setCountry] = useState('');
  const [isSuccess,setIsSuccess] = useState(false);
  const [shippingPrice,setShippingPrice] = useState(5);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    axios.get('/api/settings')
      .then(response => {
        if (response.data.shippingPrice !== undefined && response.data.shippingPrice !== null) {
          setShippingPrice(Number(response.data.shippingPrice));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, [clearCart]);

  useEffect(() => {
    if (!isSuccess) return;
    let cancelled = false;
    (async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        if (cancelled) return;
        confetti({
          particleCount: 140,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          if (cancelled) return;
          confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
        }, 250);
      } catch (e) {}
    })();
    return () => { cancelled = true; };
  }, [isSuccess]);

  useEffect(() => {
    try {
      const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
      if (savedEmail) {
        setEmail(savedEmail);
        axios.get(`/api/user?email=${savedEmail}`).then(res => {
          if (res.data) {
            setName(res.data.name || '');
            setCity(res.data.city || '');
            setPostalCode(res.data.postalCode || '');
            setStreetAddress(res.data.streetAddress || '');
            setCountry(res.data.country || '');
          }
        }).catch(() => {});
      }
    } catch (e) {}
  }, []);

  function moreOfThisProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;
    
    const currentQuantity = cartProducts.filter(pid => pid === id).length;
    const availableStock = product.stock || 0;
    
    if (availableStock && currentQuantity >= availableStock) {
      alert(`Няма достатъчна наличност за "${product.title}". Налични: ${availableStock}`);
      return;
    }
    
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    if (!name || !email || !phone || !city || !postalCode || !streetAddress || !country) {
      alert('Моля, попълнете всички полета');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Моля, въведете валиден имейл адрес');
      return;
    }
    
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone) || phone.length < 8) {
      alert('Моля, въведете валиден телефонен номер');
      return;
    }
    
    try {
      const response = await axios.post('/api/checkout', {
        name,email,phone,city,postalCode,streetAddress,country,
        cartProducts,shippingPrice: Number(shippingPrice),
        paymentMethod: 'cash',
      });
      if (response.data.success) {
        if (response.data.url) {
          window.location.href = response.data.url;
          return;
        }
        setIsSuccess(true);
        clearCart();
      } else {
        alert('Грешка при създаване на поръчката: ' + response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Грешка при създаване на поръчката. Моля, опитайте отново.';
      alert(errorMessage);
    }
  }

  let subtotal = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    subtotal += price;
  }
  const total = subtotal + Number(shippingPrice || 0);

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Благодарим за поръчката!</h1>
              <p>Поръчката е създадена успешно.</p>
              <p>Ще ви изпратим имейл, когато поръчката бъде изпратена.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Кошница</h2>
            {!cartProducts?.length && (
              <div>Вашата кошница е празна</div>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Продукт</th>
                    <th>Количество</th>
                    <th>Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt=""/>
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
                        <QuantityLabel>
                          {cartProducts.filter(id => id === product._id).length}
                          {product.stock !== undefined && (
                            <span style={{fontSize: '0.85em', color: '#666', marginLeft: '8px'}}>
                              / {product.stock} налични
                            </span>
                          )}
                        </QuantityLabel>
                        <Button
                          onClick={() => moreOfThisProduct(product._id)}
                          disabled={product.stock !== undefined && product.stock > 0 && cartProducts.filter(id => id === product._id).length >= (product.stock || 0)}
                        >
                          +
                        </Button>
                      </td>
                      <td>
                        {cartProducts.filter(id => id === product._id).length * product.price} EUR
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Междинна сума:</td>
                    <td>{subtotal} EUR</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>Доставка:</td>
                    <td>{shippingPrice} EUR</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td><strong>Общо:</strong></td>
                    <td><strong>{total} EUR</strong></td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Информация за поръчката</h2>
              <Input
                type="text"
                placeholder="Име"
                value={name}
                name="name"
                onChange={ev => setName(ev.target.value)}
              />
              <Input
                type="email"
                placeholder="Имейл"
                value={email}
                name="email"
                onChange={ev => setEmail(ev.target.value)}
              />
              <Input
                type="tel"
                placeholder="Телефонен номер"
                value={phone}
                name="phone"
                onChange={ev => setPhone(ev.target.value)}
              />
              <CityHolder>
                <Input
                  type="text"
                  placeholder="Град"
                  value={city}
                  name="city"
                  onChange={ev => setCity(ev.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Пощенски код"
                  value={postalCode}
                  name="postalCode"
                  onChange={ev => setPostalCode(ev.target.value)}
                />
              </CityHolder>
              <Input
                type="text"
                placeholder="Адрес"
                value={streetAddress}
                name="streetAddress"
                onChange={ev => setStreetAddress(ev.target.value)}
              />
              <Input
                type="text"
                placeholder="Държава"
                value={country}
                name="country"
                onChange={ev => setCountry(ev.target.value)}
              />
              
              <PaymentMethodContainer>
                <h3 style={{marginTop: 0, marginBottom: '15px'}}>Метод на плащане</h3>
                <p style={{margin: 0, fontSize: '0.95rem', color: '#444'}}>
                  💰 Наложен платеж – плащате при получаване на поръчката.
                </p>
              </PaymentMethodContainer>
              
              <Button black block onClick={goToPayment}>
                Поръчай с наложен платеж
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
      <Footer />
    </>
  );
}

