import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GlobalState {
  isDark: boolean,
  isRadiologyMode: boolean,
  vieweMode: "axial" | "sagittal" | "coronal" | "multiplanar" | "row2d",
  show3D: boolean,

}

const initialState: GlobalState = {
  isDark: false,
  isRadiologyMode: false,
  vieweMode: "multiplanar",
  show3D: false,
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
    },
    setViewMode: (state, action: PayloadAction<"axial" | "sagittal" | "coronal" | "multiplanar" | "row2d">) => {
      state.vieweMode = action.payload
    },
    toggleShow3D: (state) => {
      state.show3D = !state.show3D
    },


  },
})

// Action creators are generated for each case reducer function
export const { toggleDarkMode, toggleRadiologyMode,
  setDarkMode, setRadiologyMode, setViewMode } = globalSlice.actions

export default globalSlice.reducer