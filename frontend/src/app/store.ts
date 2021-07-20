import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import counterReducer from '../features/counter/counterSlice'
import clockReducer from '../features/clock/clockSlice'
import { useMemo } from 'react'

let store

export const makeStore = (preloadedState) => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      clock: clockReducer,
    },
    preloadedState: preloadedState ?? undefined,
  })
}

// const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>

export type AppState = ReturnType<AppStore['getState']>
// export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = AppStore['dispatch']
// export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({ ...store.getState(), ...preloadedState })

    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export const useStore = (initialState) => {
  return useMemo(() => initializeStore(initialState), [initialState])
}
