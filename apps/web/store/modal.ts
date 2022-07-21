import { Pages } from 'types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { baseInitialState } from './initial-state'
import { IModuleFull } from '@modtree/types'
import type { ContextMenuProps } from 'types'

export const modal = createSlice({
  name: 'modal',
  initialState: baseInitialState.modal,
  reducers: {
    hideModuleStateGuide: (state) => {
      state.showModuleStateGuide = false
    },
    showModuleStateGuide: (state) => {
      state.showModuleStateGuide = true
    },
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
      state.modalModule = baseInitialState.modal.modalModule
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
  showModuleStateGuide,
  hideModuleStateGuide,
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
export const r = modal.actions
export default modal.reducer
