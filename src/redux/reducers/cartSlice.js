import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmounts: 0,
    subTotalProductPrice: 0,

    // ! Keep this intact for futher development
    // items: [
    //   {
    //     productId: 4,
    //     product: {
    //       name: "Thai Tea",
    //       price: 15000,
    //       image:
    //         "https://dcostseafood.id/wp-content/uploads/2023/03/Thai-Tea-300x300.jpg",
    //       categoryId: 10,
    //       minOrder: 1,
    //       createdAt: 1698392482,
    //       id: 4,
    //     },
    //     subTotal: 30000,
    //     amounts: 2,
    //   },
    //   {
    //     productId: 3,
    //     product: {
    //       id: 3,
    //       name: "Es Jeruk Kelapa",
    //       categoryId: 10,
    //       price: 18000,
    //       minOrder: 1,
    //       image:
    //         "https://dcostseafood.id/wp-content/uploads/2021/12/ES-JERUK-murni-KELAPA-MUDA-300x300.jpg",
    //       createdAt: 1693537970,
    //     },
    //     subTotal: 18000,
    //     amounts: 1,
    //   },
    // ],
    // totalAmounts: 3,
    // subTotalProductPrice: 48000,
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
