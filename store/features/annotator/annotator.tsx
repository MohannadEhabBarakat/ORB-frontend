import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AnnotatorState {
    activeVolume: string | null,
    activeLabel: string | null,
    
}

const initialState: AnnotatorState = {
    activeVolume: null,
    activeLabel: null,
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
        

  },
})

// Action creators are generated for each case reducer function
export const { setActiveVolume, setActiveLabel } = annotatorSlice.actions

export default annotatorSlice.reducer