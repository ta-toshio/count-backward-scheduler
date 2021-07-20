import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ClockState {
  lastUpdate: number
  light: boolean
}

const initialState: ClockState = {
  lastUpdate: 0,
  light: false,
}

export const clockSlice = createSlice({
  name: 'clock',
  initialState,
  reducers: {
    tick: (state, action: PayloadAction<number>) => {
      state.lastUpdate = action.payload
      state.light = !!state.light
    },
  },
})

export const { tick } = clockSlice.actions

export default clockSlice.reducer
