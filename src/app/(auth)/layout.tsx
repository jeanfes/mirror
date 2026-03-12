export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8 md:px-6">
            <div className="neo-panel w-full max-w-md rounded-3xl p-5 md:p-6">{children}</div>
        </div>
    )
}
