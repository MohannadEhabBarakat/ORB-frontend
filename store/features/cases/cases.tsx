import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Defining the recursive type based on your structure
export type FileTreeItem = { name: string, url?: string, labels?:FileTreeItem[], items?: FileTreeItem[] }

export interface FileTreeState {
  fileTree: FileTreeItem[];
}

// Populating initial state with your provided nested data
const initialState: FileTreeState = {
  fileTree: [],
}
// const initialState: FileTreeState = {
//   fileTree: [
//     {
//       name: "Patient_001",
//       labels: [{ name: "volume.nii", url: "https://example.com/volume.nii" }],
//       items: [
//         {
//           name: "Study_MRI_Brain_2023-10-15",
//           labels: [{ name: "volume.nii", url: "https://example.com/volume.nii" }],
//           items: [
//             {
//               name: "Series_01_T1_Weighted",
//               labels: [{ name: "volume.nii", url: "https://example.com/volume.nii" }],
//               items: [{ name: "volume.nii", url: "https://example.com/volume.nii" }],
//             },
//             {
//               name: "Series_02_T2_FLAIR",
//               items: [
//                 { name: "slice_001.dicom", url: "https://example.com/slice_001.dicom"  },
//                 { name: "slice_002.dicom", url: "https://example.com/slice_002.dicom" },
//                 { name: "slice_003.dicom", url: "https://example.com/slice_003.dicom" },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Study_CT_Head_2024-01-20",
//           items: [
//             {
//               name: "Series_01_Axial_NonContrast",
//               items: [{ name: "reconstruction.nii", url: "https://example.com/reconstruction.nii" }],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Patient_002",
//       items: [
//         {
//           name: "Study_CT_Chest_2023-11-02",
//           items: [
//             {
//               name: "Series_01_HighRes_Chest",
//               items: [
//                 { name: "slice_001.dicom", url: "https://example.com/slice_001.dicom" },
//                 { name: "slice_002.dicom", url: "https://example.com/slice_002.dicom" },
//                 { name: "slice_003.dicom", url: "https://example.com/slice_003.dicom" },
//                 { name: "slice_004.dicom", url: "https://example.com/slice_004.dicom" },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Patient_003",
//       items: [
//         {
//           name: "Study_MRI_Spine_2024-02-10",
//           items: [
//             {
//               name: "Series_01_Sagittal_T2",
//               items: [{ name: "sagittal_spine.nii", url: "https://example.com/sagittal_spine.nii" }],
//             },
//             {
//               name: "Series_02_Axial_T2",
//               items: [{ name: "axial_spine.nii", url: "https://example.com/axial_spine.nii" }],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

export const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    // Replaces the entire tree at once
    setFileTree: (state, action: PayloadAction<FileTreeItem[]>) => {
      state.fileTree = action.payload;
    },
    // Adds a new item to the root level of the tree
    addPatient: (state, 
      action: PayloadAction<{patientName:string}> ) => {
      const {patientName} = action.payload
      const patient_found = state.fileTree.find((p) => p.name === patientName);
      if (patient_found || patientName===""){return}
      const patient = {name: patientName, items:[], labels:[]}
      state.fileTree.push(patient);
    },
    // Removes an item from the root level by its name
    removePatient: (state, action: PayloadAction<string>) => {
      state.fileTree = state.fileTree.filter((item) => item.name !== action.payload);
    },
    addStudy: (
      state,
      action: PayloadAction<{ patientName: string; studyName: string}>
    ) => {
      const { patientName, studyName } = action.payload;
      // addPatient({patientName, exists_ok})
      // casesSlice.caseReducers.addPatient(state, action)
      casesSlice.caseReducers.addPatient(state, { 
          ...action, 
          payload: { ...action.payload} 
        });

      const patient = state.fileTree.find((p) => p.name === patientName);
      if (!patient || !patient.items){return}
      const study_found = patient.items.find((s) => s.name === studyName);
      if (study_found || studyName===""){return}
      const study = {name: studyName, items:[], labels:[]}
      patient.items.push(study);
      
    },
    removeStudy: (
      state,
      action: PayloadAction<{ patientName: string; studyName: string }>
    ) => {
      const { patientName, studyName } = action.payload;
      const patient = state.fileTree.find((p) => p.name === patientName);
      
      if (!(patient && patient.items)) return
      patient.items = patient.items.filter((study) => study.name !== studyName);
      
    },
    addSeries: (
      state,
      action: PayloadAction<{ patientName: string; studyName: string, seriesName:string}>
    ) => {
      const { patientName, studyName, seriesName } = action.payload;
      console.log({ patientName, studyName, seriesName })
      // casesSlice.caseReducers.addStudy(state, action)
      casesSlice.caseReducers.addStudy(state, { 
          ...action, 
          payload: { ...action.payload } 
        });
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      if (!study || !study.items || seriesName===""){return}
      const series_found = study.items.find((ser) => ser.name === seriesName);
      if (series_found){return}
      const seires = {name: seriesName, items:[], labels:[]}
      study.items.push(seires);
    },
    removeSeries: (
      state,
      action: PayloadAction<{ patientName: string; studyName: string, seriesName:string }>
    ) => {
      const { patientName, studyName, seriesName } = action.payload;
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      
      if (!(study && study.items)) return
      study.items = study.items.filter((series) => series.name !== seriesName); 
    },
    addFile: (
      state,
      action: PayloadAction<{
        patientName: string;
        studyName: string;
        seriesName: string;
        fileName: string; 
        url: string;
      }>
    ) => {
      const { patientName, studyName, seriesName, fileName, url } = action.payload;
      console.log({ patientName, studyName, seriesName, fileName, url } )
      // addSeries({patientName, studyName, seriesName, exists_ok:true })
      casesSlice.caseReducers.addSeries(state, { 
          ...action, 
          payload: { ...action.payload } 
        });
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      const series = study?.items?.find((ser) => ser.name === seriesName);

      if (series && series.items) {
        series.items.push({ name: fileName, url: url, labels:[]});
      } else if(series){      
        series.items = [{ name: fileName, url: url, labels:[]}];
      }
    },
    removeFile: (
      state,
      action: PayloadAction<{
        patientName: string;
        studyName: string;
        seriesName: string;
        fileName: string;
      }>
    ) => {
      const { patientName, studyName, seriesName, fileName } = action.payload;

      // Drill down to the specific series
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      const series = study?.items?.find((ser) => ser.name === seriesName);

      if (series && series.items) {
        series.items = series.items.filter((file) => file.name !== fileName);
      }
        
      
    },

    addLabel: (
      state,
      action: PayloadAction<{
        patientName: string;
        studyName: string;
        seriesName: string;
        fileName: string; 
        url: string;
      }>
    ) => {
      const { patientName, studyName, seriesName, fileName, url } = action.payload;
      console.log({ patientName, studyName, seriesName, fileName, url } )
      // addSeries({patientName, studyName, seriesName, exists_ok:true })
      casesSlice.caseReducers.addSeries(state, { 
          ...action, 
          payload: { ...action.payload} 
        });
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      const series = study?.items?.find((ser) => ser.name === seriesName);

      if (series && series.labels) {
        series.labels.push({ name: fileName, url: url});
        return
      } else if(series){      
        series.labels = [{ name: fileName, url: url}];
        return
      }
      if(study && study.labels){
        study.labels.push({ name: fileName, url: url});
        return
      }
      else if(study){
        study.labels = [{ name: fileName, url: url}];
        return
      }
      if(patient && patient.labels){
        patient.labels.push({ name: fileName, url: url});
        return
      }
      else if(patient){
        patient.labels = [{ name: fileName, url: url}];
        return
      }
    },
    removeLabel: (
      state,
      action: PayloadAction<{
        patientName: string;
        studyName: string;
        seriesName: string;
        fileName: string;
      }>
    ) => {
      const { patientName, studyName, seriesName, fileName } = action.payload;

      // Drill down to the specific series
      const patient = state.fileTree.find((p) => p.name === patientName);
      const study = patient?.items?.find((s) => s.name === studyName);
      const series = study?.items?.find((ser) => ser.name === seriesName);

      if (series && series.labels) {
        series.labels = series.labels.filter((label) => label.name !== fileName);
      }
        
      
    },
    
  },
});

// Action creators are generated for each case reducer function
export const { setFileTree, addPatient, removePatient, addStudy, 
  removeStudy, addSeries, removeSeries, addFile, removeFile, 
  addLabel, removeLabel } = casesSlice.actions;

export default casesSlice.reducer;



import { RootState } from '../../store'
import { label } from 'motion/react-client';


// --- SELECTORS ---

// 1. Get ALL patients (the whole tree)
export const selectAllPatients = (state: RootState) => state.cases.fileTree;

// 2. Get a specific patient by their name
export const selectPatientByName = (state: RootState, patientName: string) => {
  return state.cases.fileTree.find((patient) => patient.name === patientName);
};

// 3. Get all studies for a specific patient
export const selectPatientStudies = (state: RootState, patientName: string) => {
  const patient = state.cases.fileTree.find((p) => p.name === patientName);
  return patient?.items || [];
};

// 4. Get a specific study by name for a specific patient
export const selectStudyByName = (state: RootState, patientName: string, studyName: string) => {
  const patient = state.cases.fileTree.find((p) => p.name === patientName);  
  return patient?.items?.find((study) => study.name === studyName);
};

export const selectAllSeries = (state: RootState, patientName: string, studyName: string) => {
  const patient = state.cases.fileTree.find((p) => p.name === patientName);
  const study = patient?.items?.find((s) => s.name === studyName);
  return study?.items || []; // This returns the array of Series
};

export const selectSeriesByName = (
  state: RootState, 
  patientName: string, 
  studyName: string, 
  seriesName: string
) => {
  const allSeries = selectAllSeries(state, patientName, studyName);
  return allSeries.find((series) => series.name === seriesName);
};

export const selectAllFiles = (
  state: RootState, 
  patientName: string, 
  studyName: string, 
  seriesName: string
) => {
  const series = selectSeriesByName(state, patientName, studyName, seriesName);
  return series?.items || []; // This returns the array of Files
  
};

export const selectFileByName = (
  state: RootState, 
  patientName: string, 
  studyName: string, 
  seriesName: string,
  fileName: string
) => {
  const files = selectAllFiles(state, patientName, studyName, seriesName);
  return files.find((file) => file.name === fileName);
};