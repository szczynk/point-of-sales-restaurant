import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmounts: 0,
    subTotalProductPrice: 0,
  },
  reducers: {
    addItem: (state, { payload }) => {
      const { productId, subTotal } = payload;

      const isItemExist = state.items.find(
        (item) => item.productId === productId,
      );

      if (!isItemExist) {
        state.items = [...state.items, payload];
        state.totalAmounts += 1;
        state.subTotalProductPrice += subTotal;
      } else {
        // onIncrement
        state.items = state.items.map((item) =>
          item.productId === productId
            ? {
                ...item,
                amounts: item.amounts + 1,
                subTotal: item.subTotal + subTotal,
              }
            : item,
        );

        state.totalAmounts += 1;
        state.subTotalProductPrice += subTotal;
      }
    },

    removeItem: (state, { payload }) => {
      const { id: productId, amounts, subTotal } = payload;

      state.items = state.items.filter((item) => item.productId !== productId);
      state.totalAmounts -= amounts;
      state.subTotalProductPrice -= subTotal;
    },

    removeAllItems: (state) => {
      state.items = [];
      state.totalAmounts = 0;
      state.subTotalProductPrice = 0;
    },

    onIncrement: (state, { payload }) => {
      const { id: productId, price } = payload;

      state.items = state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              amounts: item.amounts + 1,
              subTotal: item.subTotal + price,
            }
          : item,
      );

      state.totalAmounts += 1;
      state.subTotalProductPrice += price;
    },

    onDecrement: (state, { payload }) => {
      const { id: productId, price } = payload;

      state.items = state.items.map((item) =>
        item.productId === productId
          ? {
              ...item,
              amounts: item.amounts - 1,
              subTotal: item.subTotal - price,
            }
          : item,
      );

      state.totalAmounts -= 1;
      state.subTotalProductPrice -= price;
    },
  },
});

export const { addItem, removeItem, removeAllItems, onIncrement, onDecrement } =
  cartSlice.actions;
export default cartSlice.reducer;
