import { configureStore } from '@reduxjs/toolkit'
import navReducer from './features/sidebar/navSlice'
import globalReducer from './features/settings/global'
import toolsReducer from './features/tools/tools'
import labelReducer from './features/tools/labels'
import caseReducer from './features/cases/cases'
import annotatorReducer from './features/annotator/annotator'
import datasetsReducer from './features/datasets/datasets'

export const makeStore = () => {
  return configureStore({
    reducer: {
      nav: navReducer,
      global: globalReducer,
      tool: toolsReducer,
      labels: labelReducer,
      cases: caseReducer,
      annotator: annotatorReducer,
      datasets: datasetsReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['annotator/setNvRef'],
          ignoredPaths: ['annotator.nvRef'],
        },
      }),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']