import { createSlice } from '@reduxjs/toolkit'
import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'

type State = {
  showUserProfile: boolean
  showModuleModal: boolean
  modalModule: ModtreeApiResponse.Module
}

export type ModalState = {
  modal: State
}

const initialState: State = {
  showUserProfile: false,
  showModuleModal: false,
  modalModule: EmptyResponse.Module,
}

export const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    hideUserProfile: (state) => {
      state.showUserProfile = false
    },
    showUserProfile: (state) => {
      state.showUserProfile = true
    },
    hideModuleModal: (state) => {
      state.showModuleModal = false
    },
    showModuleModal: (state) => {
      state.showModuleModal = true
    },
  },
})

export const {
  showUserProfile,
  hideUserProfile,
  showModuleModal,
  hideModuleModal,
} = modal.actions
export default modal.reducer
