"use client"

import React, { memo, useCallback, useRef, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bell,
  Download,
  LifeBuoy,
  LogOut,
  Shield,
  Settings,
  Palette,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/Button"
import { LoadingOverlay } from "@/components/ui/Loading"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { ROUTES } from "@/lib/routes"
import { createClient } from "@/lib/supabase/client"
import {
  deleteAccount,
  startDataExport,
} from "@/features/settings/services/account-data.service"
import { useTheme } from "../providers/ThemeProvider"
import { ChangePasswordModal } from "@/features/auth/components/ChangePasswordModal"
import type { ThemePreference } from "@/lib/theme"

import { GeneralTab } from "@/features/settings/components/GeneralTab"
import { AppearanceTab } from "@/features/settings/components/AppearanceTab"
import { SecurityTab } from "@/features/settings/components/SecurityTab"
import { NotificationsTab } from "@/features/settings/components/NotificationsTab"
import { DataTab } from "@/features/settings/components/DataTab"
import { ContactSupportModal } from "@/features/contact/components/ContactSupportModal"

interface SettingsModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  user?: {
    name: string
    email: string
    avatar?: string
    provider?: string
  }
}

const SettingsModal = memo(function SettingsModal({
  children,
  open,
  onOpenChange,
  user = { name: "User", email: "" },
}: SettingsModalProps) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [isExportingData, setIsExportingData] = useState(false)

  const { logout, isPending: isLogoutPending } = useLogout()
  const supabase = createClient()
  const { themePreference, setThemePreference } = useTheme()
  const t = useLanguageStore((state) => state.t)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const { data: settings, updateSettings } = useUserSettings()

  const themeRef = useRef(themePreference)
  const langRef = useRef(language)
  const settingsRef = useRef(settings)

  themeRef.current = themePreference
  langRef.current = language
  settingsRef.current = settings

  const handleThemeChange = useCallback(async (nextPref: ThemePreference) => {
    const prev = themeRef.current
    setThemePreference(nextPref)
    try {
      await updateSettings({ theme: nextPref })
    } catch {
      setThemePreference(prev)
      toast.error(t.app.settingsModal.themeSaveError)
    }
  }, [setThemePreference, updateSettings, t.app.settingsModal.themeSaveError])

  const handleLanguageChange = useCallback(async (val: string) => {
    const prev = langRef.current
    const newLang = val as "en" | "es" | "pt" | "fr" | "de"
    setLanguage(newLang)
    try {
      setIsUpdating(true)
      await updateSettings({ language: newLang })
      toast.success(t.app.settingsModal.languageUpdated)
    } catch {
      setLanguage(prev)
      toast.error(t.app.settingsModal.languageUpdateError)
    } finally {
      setIsUpdating(false)
    }
  }, [setLanguage, updateSettings, t.app.settingsModal.languageUpdated, t.app.settingsModal.languageUpdateError])

  const handleToggleChange = useCallback(async (key: 'notificationsEnabled' | 'desktopAlertsEnabled', value: boolean) => {
    try {
      await updateSettings({ [key]: value })
    } catch {
      toast.error(t.app.settings.preferencesError)
    }
  }, [updateSettings, t.app.settings.preferencesError])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const handleExportData = useCallback(async () => {
    try {
      setIsExportingData(true)
      const downloadUrl = await startDataExport(supabase)
      if (downloadUrl) {
        const link = document.createElement("a")
        link.href = downloadUrl
        link.download = `mirror-export-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 500)
      }
      toast.success(t.app.settingsModal.backupStarted)
    } catch {
      toast.error(t.app.common.exportError)
    } finally {
      setIsExportingData(false)
    }
  }, [supabase, t.app.settingsModal.backupStarted, t.app.common.exportError])

  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsDeletingAccount(true)
      await deleteAccount(supabase)
      setIsDeleteAccountConfirmOpen(false)
      await logout()
      toast.success(t.app.common.accountDeleted)
    } catch {
      toast.error(t.app.common.accountDeleteError)
    } finally {
      setIsDeletingAccount(false)
    }
  }, [logout, supabase, t.app.common.accountDeleted, t.app.common.accountDeleteError])

  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (!isLogoutPending && !isUpdating && !isDeletingAccount && !isExportingData) {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    }
  }, [isControlled, isExportingData, isLogoutPending, isUpdating, onOpenChange, isDeletingAccount])

  const closeModal = useCallback(() => {
    handleDialogOpenChange(false)
  }, [handleDialogOpenChange])

  const dialogOpen = isControlled ? open : internalOpen

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl p-0 h-[80vh] flex flex-col sm:h-162.5 overflow-hidden">
          <DialogTitle className="sr-only">{t.app.settingsModal.title}</DialogTitle>
          <DialogDescription className="sr-only">{t.app.settingsModal.subtitle}</DialogDescription>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">

              <aside className="w-full sm:w-64 shrink-0 border-b sm:border-b-0 sm:border-r border-border-soft bg-surface-overlay p-4 sm:p-5 flex flex-col z-10">
                <div className="hidden sm:flex items-center gap-3 px-2 mb-8 mt-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-elevated border border-border-soft text-primary-text shadow-sm">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold text-primary-dark">{t.app.settingsModal.title}</h2>
                    <p className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">{t.app.settingsModal.subtitle}</p>
                  </div>
                </div>

                <TabsList className="h-full flex-row sm:flex-col items-center sm:items-stretch justify-start rounded-none bg-transparent p-0 gap-2 sm:gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 border-0">
                  <SettingsTabTrigger value="general" icon={<User className="h-4 w-4" />} label={t.app.settingsModal.tabGeneral} />
                  <SettingsTabTrigger value="appearance" icon={<Palette className="h-4 w-4" />} label={t.app.settingsModal.tabAppearance} />
                  <SettingsTabTrigger value="security" icon={<Shield className="h-4 w-4" />} label={t.app.settingsModal.tabSecurity} />
                  <SettingsTabTrigger value="notifications" icon={<Bell className="h-4 w-4" />} label={t.app.settingsModal.tabAlerts} />
                  <SettingsTabTrigger value="data" icon={<Download className="h-4 w-4" />} label={t.app.settingsModal.tabExport} />

                  <div className="hidden sm:block pt-8 mt-auto">
                    <Button
                      variant="dangerSoft"
                      className="w-full justify-start gap-2"
                      onClick={() => setIsLogoutConfirmOpen(true)}
                      disabled={isLogoutPending || isUpdating}
                    >
                      <LogOut className="h-4 w-4 stroke-[2.2]" />
                      <span>{isLogoutPending ? t.app.settingsModal.loggingOut : t.app.settingsModal.logOut}</span>
                    </Button>
                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-secondary-text uppercase tracking-widest opacity-50">v1.0.0</p>
                      <ContactSupportModal>
                        <button
                          className="h-6 w-6 rounded-md flex items-center justify-center text-secondary-text hover:text-primary-dark hover:bg-surface-hover transition-colors"
                          aria-label={t.footer.helpCenter}
                          title={t.footer.helpCenter}
                        >
                          <LifeBuoy className="h-4 w-4" />
                        </button>
                      </ContactSupportModal>
                    </div>
                  </div>
                </TabsList>
              </aside>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-base p-5 sm:px-10 sm:py-10">

                <TabsContent value="general" className="mt-0 b-none">
                  {activeTab === "general" && (
                    <GeneralTab
                      user={user}
                      language={language}
                      onLanguageChange={handleLanguageChange}
                      t={{
                        generalInfoTitle: t.app.settingsModal.generalInfoTitle,
                        generalInfoDesc: t.app.settingsModal.generalInfoDesc,
                        fullName: t.app.settingsModal.fullName,
                        emailAddress: t.app.settingsModal.emailAddress,
                        appLanguage: t.app.settingsModal.appLanguage,
                        labelEn: t.app.settings.labelEn,
                        labelEs: t.app.settings.labelEs,
                        labelPt: t.app.settings.labelPt,
                        labelFr: t.app.settings.labelFr,
                        labelDe: t.app.settings.labelDe
                      }}
                    />
                  )}
                </TabsContent>

                <TabsContent value="appearance" className="mt-0">
                  {activeTab === "appearance" && (
                    <AppearanceTab
                      themePreference={themePreference}
                      onThemeChange={handleThemeChange}
                      title={t.app.settingsModal.appearanceTitle}
                      description={t.app.settingsModal.appearanceDesc}
                      activeLabel={t.app.settingsModal.activeTheme}
                    />
                  )}
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  {activeTab === "security" && (
                    <SecurityTab
                      onUpdatePassword={() => setIsChangePasswordOpen(true)}
                      title={t.app.settingsModal.securityTitle}
                      description={t.app.settingsModal.securityDesc}
                      provider={user.provider}
                    />
                  )}
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  {activeTab === "notifications" && (
                    <NotificationsTab
                      settings={settings}
                      onToggleChange={handleToggleChange}
                      title={t.app.settingsModal.notificationsTitle}
                      description={t.app.settingsModal.notificationsDesc}
                    />
                  )}
                </TabsContent>

                <TabsContent value="data" className="mt-0">
                  {activeTab === "data" && (
                    <DataTab
                      onDeleteAccount={() => setIsDeleteAccountConfirmOpen(true)}
                      onExportData={handleExportData}
                      isExporting={isExportingData}
                      title={t.app.settingsModal.dataControlsTitle}
                      description={t.app.settingsModal.dataControlsDesc}
                    />
                  )}
                </TabsContent>

              </div>
            </div>
          </Tabs>

          <footer className="flex h-14 items-center justify-between border-t border-border-soft bg-surface-overlay px-8 shrink-0">
            <div className="flex gap-5">
              <FooterLink href={ROUTES.private.terms} label={t.footer.termsOfUse} onClick={closeModal} />
              <FooterLink href={ROUTES.private.privacy} label={t.footer.privacyPolicy} onClick={closeModal} />
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-[10px] font-bold">{t.app.settingsModal.poweredBy} STAR HOLDINGS</span>
            </div>
          </footer>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title={t.app.settingsModal.logoutConfirmTitle}
        description={t.app.settingsModal.logoutConfirmDesc}
        confirmLabel={t.app.settingsModal.logOut}
        cancelLabel={t.app.common.cancel}
        isPending={isLogoutPending}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      <ConfirmDialog
        open={isDeleteAccountConfirmOpen}
        title={t.app.settingsModal.deleteConfirmTitle}
        description={t.app.settingsModal.deleteConfirmDesc}
        confirmLabel={t.app.settingsModal.deleteAccount}
        cancelLabel={t.app.common.cancel}
        isPending={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteAccountConfirmOpen(false)}
      />

      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
      <LoadingOverlay
        show={isLogoutPending || isUpdating || isDeletingAccount || isExportingData}
        label={isLogoutPending ? t.app.settingsModal.loggingOut : t.app.settingsModal.savingChanges}
      />
    </>
  )
})


const SettingsTabTrigger = ({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) => (
  <TabsTrigger value={value} className="settings-nav-trigger shrink-0 gap-2">
    {icon} {label}
  </TabsTrigger>
)

const FooterLink = ({ href, label, onClick }: { href: string, label: string, onClick?: () => void }) => (
  <Link href={href} className="settings-footer-link" onClick={onClick}>
    {label}
  </Link>
)

export default SettingsModal