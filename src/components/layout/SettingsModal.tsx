"use client"

import React, { memo, useCallback, useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import {
  BadgeCheck,
  Bell,
  Download,
  ExternalLink,
  LogOut,
  Shield,
  Trash2,
  Settings,
  Palette,
  User,
} from "lucide-react"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Select } from "@/components/ui/Select"
import { LoadingOverlay } from "@/components/ui/Loading"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Toggle } from "@/components/ui/Toggle"
import { Input } from "@/components/ui/Input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { ThemeSegmentedControl } from "@/components/ui/ThemeToggle"
import { useLogout } from "@/features/auth/hooks/useLogout"
import { useLanguageStore } from "@/store/useLanguageStore"
import { useUserSettings } from "@/features/settings/hooks/useUserSettings"
import { useTheme } from "../providers/ThemeProvider"
import { ChangePasswordModal } from "@/features/auth/components/ChangePasswordModal"
import type { ThemePreference } from "@/lib/theme"

interface SettingsModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

const SettingsModal = memo(function SettingsModal({
  children,
  open,
  onOpenChange,
  user = { name: "User", email: "" },
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general")
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const { logout, isPending: isLogoutPending } = useLogout()
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
      setIsUpdating(true)
      await updateSettings({ theme: nextPref === "system" ? "auto" : nextPref })
    } catch {
      setThemePreference(prev)
      toast.error("Error al guardar el tema")
    } finally {
      setIsUpdating(false)
    }
  }, [setThemePreference, updateSettings])

  const handleLanguageChange = useCallback(async (val: string) => {
    const prev = langRef.current
    const newLang = val as "en" | "es" | "pt" | "fr" | "de"
    setLanguage(newLang)
    try {
      setIsUpdating(true)
      await updateSettings({ language: newLang })
      toast.success("Idioma actualizado")
    } catch {
      setLanguage(prev)
      toast.error("Error al cambiar idioma")
    } finally {
      setIsUpdating(false)
    }
  }, [setLanguage, updateSettings])

  const handleToggleChange = useCallback(async (key: 'notificationsEnabled' | 'desktopAlertsEnabled', value: boolean) => {
    try {
      setIsUpdating(true)
      await updateSettings({ [key]: value })
    } catch {
      toast.error("Error al guardar preferencia")
    } finally {
      setIsUpdating(false)
    }
  }, [updateSettings])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  const handleDialogOpenChange = useCallback((nextOpen: boolean) => {
    if (!isLogoutPending && !isUpdating) onOpenChange?.(nextOpen)
  }, [isLogoutPending, isUpdating, onOpenChange])

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl p-0 h-[80vh] flex flex-col sm:h-162.5 overflow-hidden">
          <DialogTitle className="sr-only">{t.app.settingsModal.title}</DialogTitle>
          <DialogDescription className="sr-only">Gestiona tu cuenta y preferencias</DialogDescription>

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

                <TabsList className="flex-row sm:flex-col h-auto items-center sm:items-stretch justify-start rounded-none bg-transparent p-0 gap-2 sm:gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 border-0">
                  <SettingsTabTrigger value="general" icon={<User className="h-4 w-4" />} label="General" />
                  <SettingsTabTrigger value="appearance" icon={<Palette className="h-4 w-4" />} label="Apariencia" />
                  <SettingsTabTrigger value="security" icon={<Shield className="h-4 w-4" />} label="Seguridad" />
                  <SettingsTabTrigger value="notifications" icon={<Bell className="h-4 w-4" />} label="Alertas" />
                  <SettingsTabTrigger value="data" icon={<Download className="h-4 w-4" />} label="Exportar" />

                  <div className="hidden sm:block pt-8 mt-auto">
                    <Button
                      variant="dangerSoft"
                      className="w-full justify-start gap-2"
                      onClick={() => setIsLogoutConfirmOpen(true)}
                      disabled={isLogoutPending || isUpdating}
                    >
                      <LogOut className="h-4 w-4 stroke-[2.2]" />
                      <span>{isLogoutPending ? "Saliendo..." : "Cerrar sesión"}</span>
                    </Button>
                    <p className="px-4 py-4 text-[10px] font-bold text-secondary-text uppercase tracking-widest opacity-50">v1.0.4</p>
                  </div>
                </TabsList>
              </aside>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-base p-5 sm:px-10 sm:py-10">
                
                <TabsContent value="general" className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200 b-none">
                  {activeTab === "general" && (
                    <>
                      <SectionHeader title={t.app.settingsModal.generalInfoTitle} description={t.app.settingsModal.generalInfoDesc} />
                      <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-5">
                          <div className="relative h-20 w-20 shrink-0">
                            <div className="relative h-full w-full rounded-3xl bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden">
                              {user.avatar ? (
                                <Image 
                                  src={user.avatar} 
                                  alt="Avatar" 
                                  fill 
                                  sizes="80px"
                                  className="rounded-3xl object-cover" 
                                />
                              ) : (
                                user.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl bg-surface-elevated text-accent-purple shadow-sm ring-1 ring-border-soft">
                              <BadgeCheck className="h-4 w-4 fill-accent-purple text-white" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-primary-text">{user.name}</h4>
                            <p className="text-xs text-secondary-text font-medium">{user.email}</p>
                          </div>
                        </div>
                        <div className="grid gap-5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input disabled label="Nombre" defaultValue={user.name} />
                            <Input disabled label="Email" defaultValue={user.email} />
                          </div>
                          <Select
                            label="Idioma de la App"
                            value={language}
                            onChange={handleLanguageChange}
                            options={[
                              { label: "English", value: "en" }, { label: "Español", value: "es" },
                              { label: "Português", value: "pt" }, { label: "Français", value: "fr" },
                              { label: "Deutsch", value: "de" },
                            ]}
                          />
                        </div>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="appearance" className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                  {activeTab === "appearance" && (
                    <>
                      <SectionHeader title="Apariencia" description="Personaliza cómo se ve tu espacio de trabajo." />
                      <Card className="p-6 sm:p-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-text">Tema Activo</p>
                          <p className="mt-1 text-[14px] font-semibold text-primary-text capitalize">{themePreference} mode</p>
                        </div>
                        <ThemeSegmentedControl onChange={handleThemeChange} />
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="security" className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                  {activeTab === "security" && (
                    <>
                      <SectionHeader title="Seguridad" description="Gestiona tu contraseña y protege tu cuenta." />
                      <Card className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Shield className="h-5 w-5" /></div>
                          <div>
                            <p className="text-sm font-bold text-primary-text">Contraseña Maestra</p>
                            <p className="text-[10px] text-secondary-text uppercase">Actualizada hace poco</p>
                          </div>
                        </div>
                        <Button variant="secondary" onClick={() => setIsChangePasswordOpen(true)}>Actualizar</Button>
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="notifications" className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                  {activeTab === "notifications" && (
                    <>
                      <SectionHeader title="Notificaciones" description="Elige qué alertas quieres recibir." />
                      <Card className="p-4 space-y-4">
                        <Toggle 
                          label="Actualizaciones por Email" 
                          checked={settings?.notificationsEnabled ?? true} 
                          onChange={(v) => handleToggleChange('notificationsEnabled', v)}
                        />
                        <Toggle 
                          label="Alertas de Escritorio" 
                          checked={settings?.desktopAlertsEnabled ?? false} 
                          onChange={(v) => handleToggleChange('desktopAlertsEnabled', v)}
                        />
                      </Card>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="data" className="mt-0 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                  {activeTab === "data" && (
                    <>
                      <SectionHeader title="Datos y Privacidad" description="Exporta tu información o elimina tu cuenta." />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <Download className="h-5 w-5 text-blue-500" />
                            <p className="text-sm font-bold">Exportar Biblioteca</p>
                          </div>
                          <Button variant="secondary" className="w-full" onClick={() => toast.success("Backup iniciado")}>Empezar Backup</Button>
                        </Card>
                        <Card className="p-6 space-y-4 border-red-200 bg-red-50/30">
                          <div className="flex items-center gap-3">
                            <Trash2 className="h-5 w-5 text-red-500" />
                            <p className="text-sm font-bold text-red-600">Zona de Peligro</p>
                          </div>
                          <Button variant="dangerSoft" className="w-full" onClick={() => setIsDeleteAccountConfirmOpen(true)}>Eliminar Cuenta</Button>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

              </div>
            </div>
          </Tabs>

          <footer className="flex h-14 items-center justify-between border-t border-border-soft bg-surface-overlay px-8 shrink-0">
            <div className="flex gap-5">
              <FooterLink href="#" label="Status" />
              <FooterLink href="#" label="Docs" />
              <FooterLink href="#" label="Changelog" />
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="text-[10px] font-bold">Powered by MIRROR</span>
            </div>
          </footer>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title="¿Cerrar sesión?"
        description="Tendrás que volver a ingresar para acceder a tu espacio privado."
        confirmLabel="Salir"
        isPending={isLogoutPending}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      <ConfirmDialog
        open={isDeleteAccountConfirmOpen}
        title="¿Eliminar cuenta?"
        description="Esta acción es permanente y borrará todos tus datos."
        confirmLabel="Eliminar definitivamente"
        onConfirm={() => setIsDeleteAccountConfirmOpen(false)}
        onCancel={() => setIsDeleteAccountConfirmOpen(false)}
      />

      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
      <LoadingOverlay show={isLogoutPending || isUpdating} label={isLogoutPending ? "Saliendo..." : "Guardando cambios..."} />
    </>
  )
})


const SettingsTabTrigger = ({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) => (
  <TabsTrigger value={value} className="settings-nav-trigger shrink-0 gap-2">
    {icon} {label}
  </TabsTrigger>
)

const SectionHeader = ({ title, description }: { title: string, description: string }) => (
  <div className="space-y-1">
    <h3 className="settings-section-title">{title}</h3>
    <p className="settings-section-description">{description}</p>
  </div>
)

const FooterLink = ({ href, label }: { href: string, label: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="settings-footer-link flex items-center gap-1">
    {label} <ExternalLink className="h-2.5 w-2.5" />
  </a>
)

export default SettingsModal