import {createContext, useEffect, useState} from "react";
import toast from "react-hot-toast";

export const CartContext = createContext({});

function normalizeIds(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => String(id)).filter(Boolean);
}

export function CartContextProvider({children}) {
  const [cartProducts,setCartProducts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('cart');
      if (raw) {
        setCartProducts(normalizeIds(JSON.parse(raw)));
      }
    } catch (e) {
      window.localStorage.removeItem('cart');
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    if (cartProducts.length > 0) {
      window.localStorage.setItem('cart', JSON.stringify(cartProducts));
    } else {
      window.localStorage.removeItem('cart');
    }
  }, [cartProducts, ready]);

  function addProduct(productId) {
    const id = String(productId);
    setCartProducts(prev => [...prev, id]);
    try {
      toast.success('Продуктът е добавен в кошницата 🛒', {
        duration: 2200,
      });
    } catch (e) {}
  }

  function removeProduct(productId) {
    const id = String(productId);
    setCartProducts(prev => {
      const pos = prev.findIndex(value => String(value) === id);
      if (pos === -1) return prev;
      return prev.filter((_, index) => index !== pos);
    });
  }

  function clearCart() {
    setCartProducts([]);
  }

  function replaceProduct(oldId, newId) {
    const from = String(oldId);
    const to = String(newId);
    if (!from || !to || from === to) return;
    setCartProducts(prev => {
      const qtyFrom = prev.filter(id => String(id) === from).length;
      const qtyTo = prev.filter(id => String(id) === to).length;
      const rest = prev.filter(id => String(id) !== from && String(id) !== to);
      return [...rest, ...Array(qtyFrom + qtyTo).fill(to)];
    });
  }

  return (
    <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart,replaceProduct}}>
      {children}
    </CartContext.Provider>
  );
}
