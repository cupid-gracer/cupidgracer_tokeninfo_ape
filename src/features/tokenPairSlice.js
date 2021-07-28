import { createSlice } from '@reduxjs/toolkit'

export const tokenPairSlice = createSlice({
  name: 'tokenPair',
  initialState: {
    value: "SAFEMOON/BNB",
  },
  reducers: {
    change: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { change } = tokenPairSlice.actions

export const selectTokenPair = state => state.tokenPair.value;

export default tokenPairSlice.reducer