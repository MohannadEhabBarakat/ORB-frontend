import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Label {
    name: string,
    color: string,
}
export interface LabelsState {
  labels: Label[],
}

const initialState: LabelsState = {
    labels: [],
}

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    addLabel: (state, action: PayloadAction<Label>) => {
      state.labels.push(action.payload)
    },
    removeLabel: (state, action: PayloadAction<string>) => {
        state.labels = state.labels.filter(label => label.name !== action.payload);
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { addLabel, removeLabel } = labelsSlice.actions

export default labelsSlice.reducer