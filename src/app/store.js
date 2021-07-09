import { configureStore } from '@reduxjs/toolkit'
import searchTokenReducer from '../features/searchTokenSlice'
import tokenPairReducer from '../features/tokenPairSlice'

export default configureStore({
  reducer: {
      searchToken:searchTokenReducer,
      tokenPair:tokenPairReducer,
  },
})