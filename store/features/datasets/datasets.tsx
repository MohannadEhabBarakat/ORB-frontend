import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { apiFetch, apiFetchMultipart } from '../../api';


export const fetchDatasets = createAsyncThunk(
  'datasets/fetchDatasets', // Action type prefix
  async () => {
    const response = await apiFetch<any[]>('/datasets');

    const datasets = response?.map((dataset: any) => dataset.name);
    console.log(datasets)
    return datasets;
  }
);

export const fetchWorklistSize = createAsyncThunk(
  'datasets/fetchWorklistSize',
  async ({ token, selectedDataset }: { token: string, selectedDataset: string }) => {
    const response = await apiFetch<any[]>('/annotators/token/' + token + '/worklist-size?dataset_name=' + selectedDataset);
    const worklist_size = response;

    if (typeof worklist_size === 'number') {
      return worklist_size;
    }
    return 0;
  }
);

export const fetchWorkItem = createAsyncThunk(
  'datasets/fetchWorkItem',
  async ({ token, dataset_name, idx }: { token: string, dataset_name: string, idx: number }) => {
    const response = await apiFetch<any[]>('/annotators/token/' + token + '/workitem?dataset_name=' + dataset_name + '&idx=' + idx);
    console.log("fetchWorkItem", response)
    return response;
  }
);

// "case": case_,
// "base_annotation": other_annotations,
// "my_annotations": my_annotations,
// "base_annotation_is_ready": base_annotation_is_ready,
// "my_original_annotation": my_original_annotation,
export type FileTreeItem = { name: string, url?: string, labels?: FileTreeItem[], items?: FileTreeItem[] }

export interface WorkItem {
  case: FileTreeItem[];
  base_annotation: FileTreeItem[];
  my_annotations: FileTreeItem[];
  base_annotation_is_ready: boolean;
  my_original_annotation: boolean;
}

export interface DatasetsState {
  datasets: string[],
  selectedDataset: string,
  token: string,
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  worklist_status: 'idle' | 'loading' | 'succeeded' | 'failed';
  workItemStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  worklist_size: number;
  currentPage: number;
  workItem: WorkItem | null;

}

const initialState: DatasetsState = {
  datasets: [],
  selectedDataset: "",
  token: "",
  status: 'idle',
  worklist_status: 'idle',
  error: null,
  worklist_size: 20,
  currentPage: 1,
  workItem: null,
  workItemStatus: 'idle',
}

export const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    selectDataset: (state, action: PayloadAction<string>) => {
      state.selectedDataset = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1 && action.payload <= state.worklist_size) {
        state.currentPage = action.payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.datasets = action.payload;
      })
      .addCase(fetchDatasets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchWorklistSize.pending, (state) => {
        state.worklist_status = 'loading';
      })
      .addCase(fetchWorklistSize.fulfilled, (state, action) => {
        state.worklist_status = 'succeeded';
        state.worklist_size = action.payload || 0;
        state.currentPage = 1;
      })
      .addCase(fetchWorklistSize.rejected, (state, action) => {
        state.worklist_status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchWorkItem.pending, (state) => {
        state.workItemStatus = 'loading';
      })
      .addCase(fetchWorkItem.fulfilled, (state, action) => {
        state.workItemStatus = 'succeeded';
        // @ts-ignore
        state.workItem = action.payload;
      })
      .addCase(fetchWorkItem.rejected, (state, action) => {
        state.workItemStatus = 'failed';
        state.error = action.error.message || null;
      });

  },
})

// Action creators are generated for each case reducer function
export const { selectDataset, setToken, setCurrentPage } = datasetsSlice.actions

export default datasetsSlice.reducer