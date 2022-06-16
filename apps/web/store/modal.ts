import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'

type State = {
  showUserProfile: boolean
  showModuleModal: boolean
  showDebugModal: boolean
  modalModule: ModtreeApiResponse.Module
}

export type ModalState = {
  modal: State
}

const initialState: State = {
  showUserProfile: false,
  showModuleModal: false,
  showDebugModal: false,
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
    hideDebugModal: (state) => {
      state.showDebugModal = false
    },
    showDebugModal: (state) => {
      state.showDebugModal = true
    },
    setModalModule: (
      state,
      action: PayloadAction<ModtreeApiResponse.Module>
    ) => {
      state.modalModule = action.payload
    },
  },
})

export const {
  showUserProfile,
  hideUserProfile,
  showModuleModal,
  hideModuleModal,
  setModalModule,
  hideDebugModal,
  showDebugModal,
} = modal.actions
export default modal.reducer
