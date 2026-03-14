"use client"

import * as React from "react"
import Image from "next/image"
import { SettingsModal } from "./SettingsModal"

interface UserMenuProps {
    user?: {
        name: string
        email: string
        avatar?: string
    }
}

export function UserMenu({ user = { name: "User Name", email: "user@example.com" } }: UserMenuProps) {
    return (
        <SettingsModal user={user}>
            <button
                className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-black text-[14px] font-bold text-white transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                aria-label="User menu"
            >
                {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill sizes="48px" className="rounded-full object-cover" />
                ) : (
                    user.name.charAt(0).toUpperCase()
                )}
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
            </button>
        </SettingsModal>
    )
}
