import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Niivue } from "@niivue/niivue";

export interface AnnotatorState {
  activeVolume: string | null,
  activeLabel: string | null,
  downloadLabel: boolean,
  reset: boolean
  save: boolean
  nvRef: null | Niivue

}

const initialState: AnnotatorState = {
  activeVolume: null,
  activeLabel: null,
  downloadLabel: false,
  reset: false,
  save: false,
  nvRef: null

}

export const annotatorSlice = createSlice({
  name: 'annotator',
  initialState,
  reducers: {

    setActiveVolume: (state, action: PayloadAction<string | null>) => {
      state.activeVolume = action.payload
    },
    setActiveLabel: (state, action: PayloadAction<string | null>) => {
      state.activeLabel = action.payload
    },
    setDownloadLabel: (state, action: PayloadAction<boolean>) => {
      state.downloadLabel = action.payload
    },
    setReset: (state, action: PayloadAction<boolean>) => {
      state.reset = action.payload
    },
    setSave: (state, action: PayloadAction<boolean>) => {
      state.save = action.payload
    },
    setNvRef: (state, action: PayloadAction<Niivue | null>) => {
      state.nvRef = action.payload as any
    },



  },
})

// Action creators are generated for each case reducer function
export const { setActiveVolume, setActiveLabel, setDownloadLabel, setReset, setSave, setNvRef } = annotatorSlice.actions

export default annotatorSlice.reducer