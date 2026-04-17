"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Dictionary } from "@/lib/i18n";
import { toast } from "sonner";
import {
    createContactFormSchema,
    DEFAULT_CONTACT_SUBJECT_KEY,
    type ContactFormValues,
} from "@/features/contact/schemas";

interface ContactFormProps {
    t: Dictionary;
}

export function ContactForm({ t }: ContactFormProps) {
    const schema = useMemo(
        () =>
            createContactFormSchema({
                nameRequired: t.contactPage.errors.nameRequired,
                emailRequired: t.contactPage.errors.emailRequired,
                emailInvalid: t.contactPage.errors.emailInvalid,
                subjectRequired: t.contactPage.errors.subjectRequired,
                messageRequired: t.contactPage.errors.messageRequired,
                messageMin: t.contactPage.errors.messageMin,
            }),
        [t]
    );

    const subjectOptions = useMemo(
        () => [
            { label: t.contactPage.subjectOptions.technicalSupport, value: "technical_support" },
            { label: t.contactPage.subjectOptions.productFeedback, value: "product_feedback" },
            { label: t.contactPage.subjectOptions.billing, value: "billing" },
            { label: t.contactPage.subjectOptions.sales, value: "sales" },
            { label: t.contactPage.subjectOptions.other, value: "other" },
        ],
        [t]
    );

    const {
        register,
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            subjectKey: DEFAULT_CONTACT_SUBJECT_KEY,
            message: "",
            website: "",
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    name: values.name.trim(),
                    email: values.email.trim(),
                    message: values.message.trim(),
                }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    setError("root", { message: t.contactPage.validationError });
                    toast.error(t.contactPage.validationError);
                    return;
                }

                if (response.status === 429) {
                    setError("root", { message: t.contactPage.submitError });
                    toast.error(t.contactPage.submitError);
                    return;
                }

                setError("root", { message: t.contactPage.submitError });
                toast.error(t.contactPage.submitError);
                return;
            }

            toast.success(t.contactPage.successMessage);
            reset({
                name: "",
                email: "",
                subjectKey: DEFAULT_CONTACT_SUBJECT_KEY,
                message: "",
                website: "",
            });
        } catch {
            setError("root", { message: t.contactPage.submitError });
            toast.error(t.contactPage.submitError);
        }
    });

    return (
        <div className="neo-panel max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-left shadow-premium-md relative">
            <form className="space-y-6" onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                        {...register("name")}
                        label={t.contactPage.nameLabel}
                        placeholder={t.contactPage.namePlaceholder}
                        className="h-12"
                        error={errors.name?.message}
                        disabled={isSubmitting}
                    />
                    <Input
                        {...register("email")}
                        label={t.contactPage.emailLabel}
                        type="email"
                        placeholder={t.contactPage.emailPlaceholder}
                        className="h-12"
                        error={errors.email?.message}
                        disabled={isSubmitting}
                    />
                </div>
                <Controller
                    name="subjectKey"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label={t.contactPage.subjectLabel}
                            value={field.value}
                            onChange={field.onChange}
                            options={subjectOptions}
                            placeholder={t.contactPage.subjectPlaceholder}
                            triggerClassName="h-12 rounded-2xl"
                        />
                    )}
                />
                {errors.subjectKey?.message && (
                    <p className="text-[11px] font-medium text-danger -mt-3">{errors.subjectKey.message}</p>
                )}
                <Textarea
                    {...register("message")}
                    label={t.contactPage.messageLabel}
                    rows={8}
                    placeholder={t.contactPage.messagePlaceholder}
                    error={errors.message?.message || errors.root?.message}
                    disabled={isSubmitting}
                />

                <input
                    {...register("website")}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                />

                <div >
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full h-14 rounded-xl text-[1.05rem] shadow-premium-sm"
                        loading={isSubmitting}
                        loadingLabel={t.contactPage.sendingBtn}
                    >
                        {t.contactPage.sendBtn}
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
