import { configureStore } from "@reduxjs/toolkit"
import { createWrapper } from 'next-redux-wrapper'; 
import { baseApi } from "./api/base-api"
import { errorMiddleware } from "./middleware/error-middleware"
import uiReducer from "./slices/ui-slice"

export const makeStore : any   = () =>  configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
        ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware()
  .concat(baseApi.middleware)
  .concat(errorMiddleware),

})

const store = makeStore();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const wrapper = createWrapper<AppStore>(makeStore);