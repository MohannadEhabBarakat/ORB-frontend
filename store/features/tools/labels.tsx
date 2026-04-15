import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { apiFetch } from '@/store/api'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const getLabels = createAsyncThunk(
  'labels/getLabels',
  async ({ datasetName }: { datasetName: string }) => {
    const response = await apiFetch<any[]>(`/datasets/${datasetName}/labelsmap`);
    console.log("labels", response);
    return response;
  }
)

export const updateLabels = createAsyncThunk(
  'labels/updateLabels',
  async ({ datasetName, labels }: { datasetName: string, labels: Label[] }) => {
    const response = await apiFetch<any[]>(`/datasets/${datasetName}/labelsmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(labels),
    });
    return response;
  }
)

export interface Label {
  name: string,
  color: string,
  mask_value: number,
}
export interface LabelsState {
  labels: Label[],
  selectedLabel: string,
  opacity: number,
  localLabels: localLabel[],
}

export interface localLabel {
  name: string,
  mask: any,
}

const initialState: LabelsState = {
  labels: [],
  selectedLabel: "",
  opacity: 1,
  localLabels: [],
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
    setOpacity: (state, action: PayloadAction<number>) => {
      state.opacity = action.payload;
    },
    addLocalLabel: (state, action: PayloadAction<localLabel>) => {
      // add if not exists, update otherwise
      if (state.localLabels.find(label => label.name === action.payload.name)) {
        state.localLabels = state.localLabels.map(label => label.name === action.payload.name ? action.payload : label);
      } else {
        state.localLabels.push(action.payload)
      }
    },
    removeLocalLabel: (state, action: PayloadAction<string>) => {
      state.localLabels = state.localLabels.filter(label => label.name !== action.payload);
    },
    clearLocalLabels: (state) => {
      state.localLabels.forEach(label => {
        localStorage.removeItem(label.name);
      });
      state.localLabels = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabels.fulfilled, (state, action) => {
        state.labels = action.payload;
      })
      .addCase(updateLabels.fulfilled, (state, action) => {
        // state.labels = action.payload;
      })
      .addCase(getLabels.rejected, (state, action) => {
        state.labels = [];
      })
      .addCase(updateLabels.rejected, (state, action) => {
        state.labels = [];
      })
      .addCase(getLabels.pending, (state, action) => {
        state.labels = [];
      })
      .addCase(updateLabels.pending, (state, action) => {
        state.labels = [];
      })
  }
})

// Action creators are generated for each case reducer function
export const { addLabel, removeLabel, setSelectedLabel, setOpacity, addLocalLabel, removeLocalLabel, clearLocalLabels } = labelsSlice.actions

export default labelsSlice.reducer