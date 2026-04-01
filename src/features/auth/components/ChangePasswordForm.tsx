"use client"

import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useLanguageStore } from "@/store/useLanguageStore"
import { createChangePasswordSchema, type ChangePasswordValues } from "../schemas"
import { useRecovery } from "../hooks/useRecovery"
import { usePasswordVisibility } from "../hooks/usePasswordVisibility"

interface ChangePasswordFormProps {
  onCancel?: () => void
}

export function ChangePasswordForm({ onCancel }: ChangePasswordFormProps) {
  const { t } = useLanguageStore()
  const schema = useMemo(
    () => createChangePasswordSchema(t.auth.errors),
    [t.auth.errors]
  )
  const { resetPassword, isPending } = useRecovery()
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  })

  const onSubmit = handleSubmit(async (data) => {
    const err = await resetPassword(data)
    if (err) {
      if (err === "weak_password") {
        toast.error(t.auth.errors.passwordWeak)
      } else if (err === "auth_unavailable") {
        toast.error(t.auth.errors.authUnavailable)
      } else if (err === "connection_error") {
        toast.error(t.auth.errors.connectionError)
      } else {
        toast.error(t.auth.errors.generic_error || "Error")
      }
    } else {
      toast.success(t.auth.passwordChangedSubtitle)
      reset()
    }
  })

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate aria-busy={isPending}>
      <Input
        {...register("currentPassword")}
        label={t.auth.currentPasswordLabel}
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        disabled={isPending}
        error={errors.currentPassword?.message}
        placeholder={t.auth.passwordPlaceholder}
      />

      <Input
        {...register("password")}
        label={t.auth.newPasswordLabel}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        disabled={isPending}
        error={errors.password?.message}
        placeholder={t.auth.passwordPlaceholder}
        suffix={
          <button
            type="button"
            className="flex items-center justify-center p-1 text-secondary-text hover:text-primary-text transition-colors"
            onClick={togglePasswordVisibility}
            disabled={isPending}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />

      <Input
        {...register("confirmPassword")}
        label={t.auth.confirmPasswordLabel}
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        disabled={isPending}
        error={errors.confirmPassword?.message}
        placeholder={t.auth.passwordPlaceholder}
      />

      <div className="flex justify-end px-1">
        <button
          type="button"
          onClick={() => (window.location.href = "/auth/forgot-password")}
          className="text-[12px] font-bold text-accent-blue hover:text-accent-blue-deep transition-colors"
        >
          {t.auth.forgotPasswordLink}
        </button>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <Button
          variant="primary"
          className="w-full h-11 text-[15px] shadow-premium-sm"
          type="submit"
          disabled={isPending}
          loading={isPending}
        >
          {t.auth.changePasswordBtn}
        </Button>

        {onCancel && (
          <Button
            variant="secondary"
            className="w-full h-10 text-[14px]"
            type="button"
            onClick={onCancel}
            disabled={isPending}
          >
            {t.auth.back}
          </Button>
        )}
      </div>
    </form>
  )
}
