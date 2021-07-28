import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from '../../app/withRedux'

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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.clock,
      }
    },
  },
})

export const { tick } = clockSlice.actions

export default clockSlice.reducer
