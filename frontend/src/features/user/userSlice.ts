import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../app/store'
import { postLogin as postLoginApi } from './userAPI'

export const initialState = {
  isAuthenticated: false,
  user: null,
  loginLoading: false,
  loginLoaded: false,
  loginError: '',
}

export type postLoginActionInput = { email: string; password: string }

export const postLoginAction = createAsyncThunk(
  'user/post-login',
  async (credential: postLoginActionInput, { rejectWithValue }) => {
    // The value we return becomes the `fulfilled` action payload
    try {
      return await postLoginApi(credential)
    } catch (e) {
      return rejectWithValue(e.response.data)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user
    },
    login: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginAction.pending, (state) => {
        state.loginLoading = true
        state.loginLoaded = false
        state.loginError = ''
        return state
      })
      .addCase(postLoginAction.fulfilled, (state, action) => {
        state.loginLoading = false
        state.loginLoaded = true
        state.loginError = ''
        state.user = action.payload
      })
      .addCase(
        postLoginAction.rejected,
        (state, action: PayloadAction<any>) => {
          state.loginLoading = false
          state.loginLoaded = true
          state.loginError = action.payload.message
          state.user = null
        }
      )
  },
})

export const {
  setUser: setUserAction,
  login: loginAction,
  logout: logoutAction,
} = userSlice.actions

export const selectUser = (state: AppState) => [
  state.user.user,
  state.user.isAuthenticated,
]

export default userSlice.reducer
