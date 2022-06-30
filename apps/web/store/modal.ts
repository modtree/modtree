import { Pages } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { ContextMenuProps } from './types'
import { IModuleFull } from '@modtree/types'

export const modal = createSlice({
  name: 'modal',
  initialState: baseInitialState.modal,
  reducers: {
    hideUserProfile: (state) => {
      state.showUserProfile = false
    },
    showUserProfile: (state) => {
      state.showUserProfile = true
    },
    setUserProfilePage: (
      state,
      action: PayloadAction<Pages['UserProfile']>
    ) => {
      state.userProfilePage = action.payload
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
    showContextMenu: (state, action: PayloadAction<ContextMenuProps>) => {
      state.showContextMenu = true
      state.contextMenuProps = action.payload
    },
    setModalModule: (state, action: PayloadAction<IModuleFull>) => {
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
  setUserProfilePage,
} = modal.actions
export default modal.reducer
