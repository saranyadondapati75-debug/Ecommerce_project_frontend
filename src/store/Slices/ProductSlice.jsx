import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user/products`, {
        timeout: 15000,
      });
      const products = Array.isArray(res.data) ? res.data : res.data?.products;

      if (!Array.isArray(products)) {
        return rejectWithValue("The products server returned an invalid response.");
      }

      return products;
    } catch (error) {
      if (typeof error.response?.data?.message === "string") {
        return rejectWithValue(error.response.data.message);
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        return rejectWithValue("The products server timed out. Please try again later.");
      }

      return rejectWithValue(
        "Could not connect to the products server. Please try again later."
      );
    }
  }
);

const ProductSlice = createSlice({
  name: "Products",
  initialState: {
    items: [],
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Unable to load products.";
    });
  },
});

export default ProductSlice.reducer;