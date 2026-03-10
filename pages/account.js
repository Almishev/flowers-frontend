import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {useState, useEffect} from "react";
import axios from "axios";
import {useWishlist} from "@/components/WishlistContext";
import ProductBox from "@/components/ProductBox";
import ProductsGrid from "@/components/ProductsGrid";
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

const TabsWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 10px 0;
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: ${props => props.active ? '#000' : '#666'};
  border-bottom-color: ${props => props.active ? '#000' : 'transparent'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    color: #000;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 10px;
  
  &:hover {
    background-color: #333;
  }
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const {wishlistProducts, loading: wishlistLoading} = useWishlist();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  

  useEffect(() => {
    // Зареждаме данните от localStorage за вече логнат потребител
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setIsAuthenticated(true);
      fetchUserData(savedEmail);
    }
  }, []);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await axios.get(`/api/user?email=${userEmail}`);
      if (response.data) {
        setName(response.data.name || '');
        setCity(response.data.city || '');
        setPostalCode(response.data.postalCode || '');
        setStreetAddress(response.data.streetAddress || '');
        setCountry(response.data.country || '');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Моля, въведете имейл и парола');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });
      const userEmail = res.data.email;
      localStorage.setItem('userEmail', userEmail);
      setEmail(userEmail);
      setIsAuthenticated(true);
      await fetchUserData(userEmail);
    } catch (error) {
      console.error('Login error:', error);
      alert(error?.response?.data?.message || 'Грешка при влизане');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword) {
      alert('Моля, въведете имейл и парола');
      return;
    }
    setAuthLoading(true);
    try {
      const res = await axios.post('/api/auth/register', {
        email: registerEmail,
        password: registerPassword,
      });
      const userEmail = res.data.email;
      localStorage.setItem('userEmail', userEmail);
      setEmail(userEmail);
      setIsAuthenticated(true);
      // Все още няма попълнени детайли за акаунта – потребителят ще ги попълни по-долу
      await fetchUserData(userEmail);
      alert('Регистрацията е успешна. Моля, попълнете детайлите за акаунта си.');
    } catch (error) {
      console.error('Register error:', error);
      alert(error?.response?.data?.message || 'Грешка при регистрация');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSave = async () => {
    if (!email || !name || !city || !postalCode || !streetAddress || !country) {
      alert('Моля, попълнете всички полета');
      return;
    }

    setSaving(true);
    try {
      await axios.post('/api/user', {
        email,
        name,
        city,
        postalCode,
        streetAddress,
        country
      });
      alert('Детайлите за акаунта са запазени успешно!');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert('Грешка при запазване на детайлите за акаунта');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setLoginEmail('');
    setLoginPassword('');
    setRegisterEmail('');
    setRegisterPassword('');
    setEmail('');
    setName('');
    setCity('');
    setPostalCode('');
    setStreetAddress('');
    setCountry('');
    window.location.href = '/';
  };

  return (
    <>
      <Header />
      <Center>
        {!isAuthenticated && (
          <Box style={{ marginTop: '40px' }}>
            <TabsWrapper>
              <Tab
                active={authTab === 'login'}
                onClick={() => setAuthTab('login')}
              >
                Вход
              </Tab>
              <Tab
                active={authTab === 'register'}
                onClick={() => setAuthTab('register')}
              >
                Регистрация
              </Tab>
            </TabsWrapper>

            {authTab === 'login' && (
              <div>
                <h2>Вход в акаунта</h2>
                <Input
                  type="email"
                  placeholder="Имейл"
                  value={loginEmail}
                  onChange={ev => setLoginEmail(ev.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Парола"
                  value={loginPassword}
                  onChange={ev => setLoginPassword(ev.target.value)}
                />
                <Button onClick={handleLogin} disabled={authLoading}>
                  {authLoading ? 'Моля, изчакайте...' : 'Вход'}
                </Button>
              </div>
            )}

            {authTab === 'register' && (
              <div>
                <h2>Създаване на акаунт</h2>
                <Input
                  type="email"
                  placeholder="Имейл"
                  value={registerEmail}
                  onChange={ev => setRegisterEmail(ev.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Парола"
                  value={registerPassword}
                  onChange={ev => setRegisterPassword(ev.target.value)}
                />
                <Button onClick={handleRegister} disabled={authLoading}>
                  {authLoading ? 'Моля, изчакайте...' : 'Регистрация'}
                </Button>
              </div>
            )}
          </Box>
        )}

        {isAuthenticated && (
          <ColumnsWrapper>
          <Box>
            <TabsWrapper>
              <Tab 
                active={activeTab === 'wishlist'} 
                onClick={() => setActiveTab('wishlist')}
              >
                Любими продукти
              </Tab>
            </TabsWrapper>

            {activeTab === 'wishlist' && (
              <div>
                <h2>Вашите любими продукти</h2>
                {wishlistLoading ? (
                  <div>Зареждане на любими продукти...</div>
                ) : wishlistProducts.length === 0 ? (
                  <div>Все още няма продукти в любими.</div>
                ) : (
                  <ProductsGrid products={wishlistProducts} />
                )}
              </div>
            )}
          </Box>

          <Box>
            <h2>Детайли за акаунта</h2>
            <Input
              type="text"
              placeholder="Име"
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
            <Input
              type="email"
              placeholder="Имейл"
              value={email}
              disabled
            />
            <Input
              type="text"
              placeholder="Град"
              value={city}
              onChange={ev => setCity(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Пощенски код"
              value={postalCode}
              onChange={ev => setPostalCode(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Адрес"
              value={streetAddress}
              onChange={ev => setStreetAddress(ev.target.value)}
            />
            <Input
              type="text"
              placeholder="Държава"
              value={country}
              onChange={ev => setCountry(ev.target.value)}
            />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Запазване...' : 'Запази'}
            </Button>
            <LogoutButton onClick={handleLogout}>Изход</LogoutButton>
          </Box>
        </ColumnsWrapper>
        )}
      </Center>
      <Footer />
    </>
  );
}
