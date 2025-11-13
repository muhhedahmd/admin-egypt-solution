import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarOpen: boolean
  notification: {
    type: "success" | "error" | "info" | "warning" | null
    message: string
  }
  loading: boolean
}

const initialState: UIState = {
  sidebarOpen: true,
  notification: {
    type: null,
    message: "",
  },
  loading: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    showNotification: (
      state,
      action: PayloadAction<{ type: "success" | "error" | "info" | "warning"; message: string }>,
    ) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = { type: null, message: "" }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, showNotification, clearNotification, setLoading } = uiSlice.actions

export default uiSlice.reducer
