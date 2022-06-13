import { createSlice } from '@reduxjs/toolkit'

type State = {
  showUserProfile: boolean
}

export type ModalState = {
  modal: State
}

const initialState: State = {
  showUserProfile: false,
}

export const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    hideUserProfile: (state) => {
      state.showUserProfile = false
      console.log('show user profile')
    },
    showUserProfile: (state) => {
      state.showUserProfile = true
      console.log('hide user profile')
    },
  },
})

export const { showUserProfile, hideUserProfile } = modal.actions
export default modal.reducer
