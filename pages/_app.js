import {createGlobalStyle} from "styled-components";
import {WishlistProvider} from "@/components/WishlistContext";
import {CartContextProvider} from "@/components/CartContext";
import {Toaster} from "react-hot-toast";
import ViberChatButton from "@/components/ViberChatButton";
import LoadingScreen from "@/components/LoadingScreen";

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
  
  @media screen and (max-width: 768px) {
    body.menu-open {
      overflow: hidden;
    }
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <LoadingScreen />
      <WishlistProvider>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
        {/* <ViberChatButton phoneNumber="+359877382224" /> */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </WishlistProvider>
    </>
  );
}
