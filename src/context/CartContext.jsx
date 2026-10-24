
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CartContext = createContext(null);

const getInitialCart = () => {
  try {
    const savedCart = localStorage.getItem("shopping-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
};

const getProductId = (product) => String(product._id || product.id);

const getUnitPrice = (product) => {
  const discount = Number(product.discountPrice);

  if (
    product.discountPrice !== null &&
    product.discountPrice !== undefined &&
    product.discountPrice !== "" &&
    Number.isFinite(discount) &&
    discount >= 0
  ) {
    return discount;
  }

  return Number(product.basePrice);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity = 1) => {
    const productId = getProductId(product);
    const unitPrice = getUnitPrice(product);
    const qty = Number(quantity);
    const stock = Number(product.stock);

    if (
      !productId ||
      productId === "undefined" ||
      !Number.isInteger(qty) ||
      qty < 1 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0 ||
      !Number.isInteger(stock) ||
      stock < 1
    ) {
      return false;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item._id === productId
      );

      if (existingItem) {
        const newQuantity = Math.min(
          existingItem.quantity + qty,
          stock
        );

        return currentItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: newQuantity, stock }
            : item
        );
      }

      return [
        ...currentItems,
        {
          _id: productId,
          title: product.title || "Product",
          sku: product.sku || "",
          productImg: product.productImg || product.image || "",
          basePrice: Number(product.basePrice),
          discountPrice: product.discountPrice,
          price: unitPrice,
          stock,
          quantity: Math.min(qty, stock),
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) return;

    setCartItems((items) =>
      items.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.min(qty, item.stock),
            }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((items) =>
      items.filter((item) => item._id !== productId)
    );
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const totalQuantity = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      isCartOpen,
      subtotal,
      totalQuantity,
      addToCart,
      updateQuantity,
      removeFromCart,
      closeCart,
      openCart,
    }),
    [
      cartItems,
      isCartOpen,
      subtotal,
      totalQuantity,
      addToCart,
      updateQuantity,
      removeFromCart,
      closeCart,
      openCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

