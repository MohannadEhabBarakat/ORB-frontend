import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GlobalState {
    isDark: boolean,
    isRadiologyMode: boolean,
    
}

const initialState: GlobalState = {
    isDark: false,
    isRadiologyMode: false,
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDark = !state.isDark
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
        state.isDark = action.payload
    },
    toggleRadiologyMode: (state) => {
        state.isRadiologyMode = !state.isRadiologyMode
    },
    setRadiologyMode: (state, action: PayloadAction<boolean>) => {
        state.isRadiologyMode = action.payload
    }


  },
})

// Action creators are generated for each case reducer function
export const { toggleDarkMode, toggleRadiologyMode, setDarkMode, setRadiologyMode } = globalSlice.actions

export default globalSlice.reducer