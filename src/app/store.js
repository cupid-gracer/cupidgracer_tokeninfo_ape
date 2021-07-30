import { configureStore } from '@reduxjs/toolkit'
import searchTokenReducer from '../features/searchTokenSlice'
import tokenPairReducer from '../features/tokenPairSlice'
import enoughBalanceReducer from '../features/enoughBalanceSlice'

export default configureStore({
  reducer: {
      searchToken:searchTokenReducer,
      tokenPair:tokenPairReducer,
      enoughBalance:enoughBalanceReducer,
  },
})