import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface NavState {
  active: string
}

const initialState: NavState = {
  active: "workbench",
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActive } = navSlice.actions

export default navSlice.reducer