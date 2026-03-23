"use client";

import { Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Dictionary } from "@/lib/i18n";
import { toast } from "sonner";

interface ContactFormProps {
    t: Dictionary;
}

export function ContactForm({ t }: ContactFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(t.contactPage.successMessage);
    };

    return (
        <div className="neo-panel max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 text-left shadow-premium-md relative">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                    <Input
                        label={t.contactPage.nameLabel}
                        required
                        placeholder={t.contactPage.namePlaceholder}
                        className="h-12"
                    />
                    <Input
                        label={t.contactPage.emailLabel}
                        type="email"
                        required
                        placeholder={t.contactPage.emailPlaceholder}
                        className="h-12"
                    />
                </div>
                <Input
                    label={t.contactPage.subjectLabel}
                    required
                    placeholder={t.contactPage.subjectPlaceholder}
                    className="h-12"
                />
                <Textarea
                    label={t.contactPage.messageLabel}
                    rows={5}
                    required
                    placeholder={t.contactPage.messagePlaceholder}
                />
                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full h-14 rounded-xl text-[1.05rem] shadow-premium-sm"
                    >
                        <Send className="h-5 w-5" />
                        {t.contactPage.sendBtn}
                    </Button>
                </div>
            </form>
        </div>
    );
}
