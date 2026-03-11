import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import {useContext, useEffect, useState} from "react";
import BarsIcon from "@/components/icons/Bars";
import CartIcon from "@/components/icons/CartIcon";
import {CartContext} from "@/components/CartContext";

const TopBar = styled.div`
  background-color: #16a34a;
  color: #e5e7eb;
  padding: 6px 0;
  font-size: 14px;
`;

const TopBarInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  @media screen and (max-width: 400px) {
    padding: 0 16px;
  }
`;

const StyledHeader = styled.header`
  background-color: #222;
  padding: 16px 0;
  overflow: visible;
`;
const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  overflow: visible;
  
  @media screen and (max-width: 400px) {
    padding: 0 16px;
  }
  
  @media screen and (max-width: 360px) {
    padding: 0 12px;
  }
`;
const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 600;
  transition: color 0.3s ease;
  overflow: visible;
  flex-shrink: 0;
  min-width: 0;
  
  &:hover {
    color: #fff;
  }
  
  @media screen and (max-width: 768px) {
    gap: 8px;
    font-size: 18px;
  }
  
  @media screen and (max-width: 400px) {
    gap: 6px;
    font-size: 16px;
  }
  
  @media screen and (max-width: 360px) {
    gap: 4px;
    font-size: 14px;
  }
`;

const LogoText = styled.span`
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 28px;
  letter-spacing: 1px;
  white-space: nowrap;
  
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
  
  @media screen and (max-width: 400px) {
    font-size: 16px;
    letter-spacing: 0.5px;
  }
  
  @media screen and (max-width: 360px) {
    font-size: 14px;
    letter-spacing: 0;
    display: none; /* Скриваме текста на много тесни екрани */
  }
`;

const LogoImage = styled(Image)`
  width: 200px !important;
  height: 80px !important;
  
  @media screen and (max-width: 768px) {
    width: 120px !important;
    height: 48px !important;
  }
  
  @media screen and (max-width: 400px) {
    width: 100px !important;
    height: 40px !important;
  }
  
  @media screen and (max-width: 360px) {
    width: 80px !important;
    height: 32px !important;
  }
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: 16px;
  min-width: 0;
  
  @media screen and (max-width: 400px) {
    gap: 12px;
  }
  
  @media screen and (max-width: 360px) {
    gap: 8px;
  }
`;
const NavArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-end;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  display: none;
  
  @media screen and (max-width: 768px) {
    display: ${props => props.mobileNavActive ? 'flex' : 'none'};
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 120px 20px 20px;
    background-color: #222;
    z-index: 9998;
    overflow-y: auto;
  }
`;

const StyledNav = styled.nav`
  display: flex;
  position: static;
  padding: 0;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  text-transform: none;
  transition: color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    color: #fff;
    transform: translateY(-2px);
  }
  
  @media screen and (max-width: 768px) {
    padding: 14px 0;
    font-size: 18px;
    
    &:hover {
      color: #fff;
      transform: none;
    }
  }
  
  @media screen and (min-width: 768px) {
    padding:0;
    text-align: left;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 44px;
  height: 44px;
  border:0;
  color: #fff;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  position: relative;
  z-index: 10000;
  flex-shrink: 0;
  
  @media screen and (max-width: 768px) {
    display: flex;
  }
  
  @media screen and (max-width: 400px) {
    width: 40px;
    height: 40px;
    padding: 6px;
  }
  
  @media screen and (max-width: 360px) {
    width: 36px;
    height: 36px;
    padding: 4px;
  }
  
  svg {
    width: 28px;
    height: 28px;
    
    @media screen and (max-width: 400px) {
      width: 24px;
      height: 24px;
    }
    
    @media screen and (max-width: 360px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
  
  button {
    background: transparent;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 4px 10px;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
  }
`;

const PhoneLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #e5e7eb;
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  
  &:hover {
    color: #ffffff;
  }
  
  @media screen and (max-width: 900px) {
    font-size: 13px;
  }
`;

const PhoneIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: 1px solid rgba(248, 250, 252, 0.5);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.35);
  
  &::before {
    content: '☎';
  }
`;


export default function Header() {
  const [mobileNavActive,setMobileNavActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const isLoggedIn = !!userEmail;
  const {cartProducts = []} = useContext(CartContext);
  const cartCount = cartProducts.length;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('menu-open', mobileNavActive);
    }
  }, [mobileNavActive]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedEmail = window.localStorage.getItem('userEmail');
    if (savedEmail) {
      setUserEmail(savedEmail);
      // опитваме да вземем името от бекенда
      fetch(`/api/user?email=${encodeURIComponent(savedEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data?.name) {
            setUserName(data.name);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userEmail');
      setUserEmail('');
      setUserName('');
    }
  };
  return (
    <>
      <TopBar>
        <TopBarInner>
          <PhoneLink href="tel:+359877382224">
            <PhoneIcon />
            <span>+359 877 382 224</span>
          </PhoneLink>
        </TopBarInner>
      </TopBar>
      <StyledHeader>
        <HeaderInner>
          <Wrapper>
          <Logo href={'/'}>
            <LogoText>Flowers Boutique MIA</LogoText>
          </Logo>
          <NavArea>
            <StyledNav>
              <NavLink href={'/'}>Начало</NavLink>
              <NavLink href={'/bouquets'}>Букети</NavLink>
              <NavLink href={'/categories'}>Категории</NavLink>
              <NavLink href={'/about'}>За нас</NavLink>
              <NavLink href={'/account'}>Акаунт</NavLink>
              <NavLink href={'/cart'}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                  <CartIcon className="w-5 h-5" />
                  Кошница{cartCount > 0 ? ` (${cartCount})` : ''}
                </span>
              </NavLink>
            </StyledNav>
            {isLoggedIn && (
              <UserArea>
                <span>Здравей, {userName || userEmail}</span>
                <button onClick={handleLogout}>Изход</button>
              </UserArea>
            )}
          </NavArea>
          <MobileNav mobileNavActive={mobileNavActive}>
            <NavLink href={'/'} onClick={() => setMobileNavActive(false)}>Начало</NavLink>
            <NavLink href={'/bouquets'} onClick={() => setMobileNavActive(false)}>Букети</NavLink>
            <NavLink href={'/categories'} onClick={() => setMobileNavActive(false)}>Категории</NavLink>
            <NavLink href={'/about'} onClick={() => setMobileNavActive(false)}>За нас</NavLink>
            <NavLink href={'/account'} onClick={() => setMobileNavActive(false)}>Акаунт</NavLink>
            <NavLink href={'/cart'} onClick={() => setMobileNavActive(false)}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                <CartIcon className="w-5 h-5" />
                Кошница{cartCount > 0 ? ` (${cartCount})` : ''}
              </span>
            </NavLink>
            {isLoggedIn && (
              <div style={{marginTop: '24px', textAlign: 'center', color: '#000'}}>
                <div style={{marginBottom: '8px'}}>
                  Здравей, {userName || userEmail}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileNavActive(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #000',
                    borderRadius: '4px',
                    padding: '6px 14px',
                    color: '#000',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Изход
                </button>
              </div>
            )}
          </MobileNav>
          <NavButton className="nav-toggle" mobileOpen={mobileNavActive} onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon className="w-8 h-8" />
          </NavButton>
        </Wrapper>
        </HeaderInner>
      </StyledHeader>
    </>
  );
}