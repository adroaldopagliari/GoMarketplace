import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import getCurrentStorage from '../utils/getCurrentStorage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface ProductRequest {
  id: string;
  title: string;
  image_url: string;
  price: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: ProductRequest): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await getCurrentStorage();

      if (storageProducts) {
        setProducts(storageProducts);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async ({ id, title, image_url, price }) => {
      // TODO ADD A NEW ITEM TO THE CART
      const product = {
        id,
        title,
        image_url,
        price,
        quantity: 1,
      };

      await AsyncStorage.setItem(
        `@GoMarketplace:${id}`,
        JSON.stringify(product),
      );

      setProducts([...products, product]);
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const productsIncremented = products.map(item => {
        if (item.id === id) {
          // eslint-disable-next-line no-param-reassign
          item.quantity += 1;
        }
        return item;
      });

      const productUpdatedIndex = productsIncremented.findIndex(
        item => item.id === id,
      );

      await AsyncStorage.removeItem(`@GoMarketplace:${id}`);
      await AsyncStorage.setItem(
        `@GoMarketplace:${id}`,
        JSON.stringify(productsIncremented[productUpdatedIndex]),
      );

      setProducts(productsIncremented);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const productsDecremented = products.map(item => {
        if (item.id === id) {
          if (item.quantity > 1) {
            // eslint-disable-next-line no-param-reassign
            item.quantity -= 1;
          }
        }
        return item;
      });

      const productUpdatedIndex = productsDecremented.findIndex(
        item => item.id === id,
      );

      await AsyncStorage.removeItem(`@GoMarketplace:${id}`);
      await AsyncStorage.setItem(
        `@GoMarketplace:${id}`,
        JSON.stringify(productsDecremented[productUpdatedIndex]),
      );

      setProducts(productsDecremented);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
