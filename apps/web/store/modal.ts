import { ModtreeApiResponse } from '@modtree/types'
import { EmptyResponse } from '@modtree/utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type State = {
  showUserProfile: boolean
  showModuleModal: boolean
  showDebugModal: boolean
  showContextMenu: boolean
  contextMenuProps: { top: number; left: number }
  modalModule: ModtreeApiResponse.Module
}

export type ModalState = {
  modal: State
}

const initialState: State = {
  contextMenuProps: {
    top: 0,
    left: 0,
  },
  showUserProfile: false,
  showContextMenu: false,
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
    hideContextMenu: (state) => {
      state.showContextMenu = false
    },
    showContextMenu: (
      state,
      action: PayloadAction<State['contextMenuProps']>
    ) => {
      state.showContextMenu = true
      state.contextMenuProps = action.payload
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
  hideContextMenu,
  showContextMenu,
} = modal.actions
export default modal.reducer
