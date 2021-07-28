import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppState } from '../../app/store'
import { getUser, postLogin as postLoginApi } from './userAPI'
import { HYDRATE } from '../../app/withRedux'

export const initialState = {
  isAuthenticated: false,
  user: null,
  loginLoading: false,
  loginLoaded: false,
  loginError: '',
  getUserLoading: false,
  getUserLoaded: false,
  getUserError: '',
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

export const getUserAction = createAsyncThunk(
  'user/get-user',
  async (params: { getParam?: {} } | void, { rejectWithValue }) => {
    try {
      return await getUser(params && params.getParam)
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
      .addCase(HYDRATE, (state, action: any) => {
        state = action.payload.user
        return state
      })
      .addCase(postLoginAction.pending, (state) => {
        state.loginLoading = true
        state.loginLoaded = false
        state.loginError = ''
      })
      .addCase(postLoginAction.fulfilled, (state, action) => {
        state.loginLoading = false
        state.loginLoaded = true
        state.loginError = ''
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(
        postLoginAction.rejected,
        (state, action: PayloadAction<any>) => {
          state.loginLoading = false
          state.loginLoaded = true
          state.loginError = action.payload.message
          state.isAuthenticated = false
          state.user = null
        }
      )
      .addCase(getUserAction.pending, (state) => {
        state.getUserLoading = true
        state.getUserLoaded = false
        state.getUserError = ''
      })
      .addCase(getUserAction.fulfilled, (state, action) => {
        state.getUserLoading = false
        state.getUserLoaded = true
        state.getUserError = ''
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(getUserAction.rejected, (state, action: PayloadAction<any>) => {
        state.getUserLoading = false
        state.getUserLoaded = true
        state.getUserError = action.payload.message
        state.isAuthenticated = false
        state.user = null
      })
  },
})

export const {
  setUser: setUserAction,
  login: loginAction,
  logout: logoutAction,
} = userSlice.actions

export const selectRootUser = (state: AppState) => state.user

export default userSlice.reducer
