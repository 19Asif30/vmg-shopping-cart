import { createSlice } from "@reduxjs/toolkit";
import { products } from "../data/data";

const initialState = {
  productList: loadCartData("cartList") || products.slice(0, 5),
  originalList: [...products],
  discount: loadCartData("discount") || 0, 
  selectedCurrency: loadCartData("currency") || "USD", 
};

function loadCartData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

function saveCartData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const product = state.productList.find((item) => item.id === id);
      if (product) {
        product.quantity = parseInt(quantity);
        saveCartData("cartList", state.productList);
      }
    },
    applyDiscount(state, action) {
      state.discount = parseFloat(action.payload);
      saveCartData("discount", state.discount); 
    },
    selectCurrency(state, action) {
      state.selectedCurrency = action.payload;
      saveCartData("currency", state.selectedCurrency);
    },
    addToCart(state, action) {
      const { id } = action.payload;
      const existingProduct = state.originalList.find((item) => item.id === id);
      state.productList.push(existingProduct);
      saveCartData("cartList", state.productList);
    },
    removeFromCart(state, action) {
      const idToRemove = action.payload;
      state.productList = state.productList.filter(
        (item) => item.id !== idToRemove
      );
      saveCartData("cartList", state.productList);
    },
  },
});

export const {
  updateQuantity,
  applyDiscount,
  selectCurrency,
  addToCart,
  removeFromCart,
} = cartSlice.actions;

export default cartSlice.reducer;
