import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NavState {
  active: string,
  isSidebarOpen: boolean,
}

const initialState: NavState = {
  active: "workbench",
  isSidebarOpen: true,
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
        state.isSidebarOpen = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActive, setSidebarOpen } = navSlice.actions

export default navSlice.reducer