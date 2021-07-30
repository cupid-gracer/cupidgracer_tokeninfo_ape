import { createSlice } from '@reduxjs/toolkit'
import {thresholdBalance} from '../constants/constant'
export const enoughBalanceSlice = createSlice({
  name: 'enoughBalance',
  initialState: {
    value: 0,
  },
  reducers: {
    setBalance: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setBalance } = enoughBalanceSlice.actions

export const balance = state => state.enoughBalance.value;
export const enough = state => state.enoughBalance.value >= thresholdBalance;

export default enoughBalanceSlice.reducer