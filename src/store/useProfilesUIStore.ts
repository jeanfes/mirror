import { create } from "zustand"

interface ProfilesUIState {
  isDialogOpen: boolean
  editingProfileId: string | null
  openCreateDialog: () => void
  openEditDialog: (id: string) => void
  closeDialog: () => void
}

export const useProfilesUIStore = create<ProfilesUIState>((set) => ({
  isDialogOpen: false,
  editingProfileId: null,
  openCreateDialog: () =>
    set({
      isDialogOpen: true,
      editingProfileId: null
    }),
  openEditDialog: (id) =>
    set({
      isDialogOpen: true,
      editingProfileId: id
    }),
  closeDialog: () =>
    set({
      isDialogOpen: false,
      editingProfileId: null
    })
}))
