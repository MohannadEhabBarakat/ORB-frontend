import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Label {
  name: string,
  color: string,
  mask_value: number,
}
export interface LabelsState {
  labels: Label[],
  selectedLabel: string,
}

const initialState: LabelsState = {
  labels: [],
  selectedLabel: "",
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
    setSelectedLabel: (state, action: PayloadAction<string>) => {
      state.selectedLabel = action.payload;
    },

  },
})

// Action creators are generated for each case reducer function
export const { addLabel, removeLabel, setSelectedLabel } = labelsSlice.actions

export default labelsSlice.reducer