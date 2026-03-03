import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ToolsState {
  tool: string,
  size?: number,
  color?: string,
}

const initialState: ToolsState = {
    tool: "cursor",
    size: 30,
}

export const toolsSlice = createSlice({
  name: 'tools',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<string>) => {
      state.tool = action.payload
    },
    setSize: (state, action: PayloadAction<number>) => {
        state.size = action.payload
    },
    setColor: (state, action: PayloadAction<string>) => {
        state.color = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTool, setSize, setColor } = toolsSlice.actions

export default toolsSlice.reducer