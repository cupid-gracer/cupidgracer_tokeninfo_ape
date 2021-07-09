import { createSlice } from '@reduxjs/toolkit'

export const searchTokenSlice = createSlice({
  name: 'searchToken',
  initialState: {
    value: "0x1ccc22cc1658ea8581adce07e273c3c92b6065d0",
  },
  reducers: {
    search: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { search } = searchTokenSlice.actions

export const selectSearchToken = state => state.searchToken.value;

export default searchTokenSlice.reducer