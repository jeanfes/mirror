export interface TrashItem {
    id: string
    title: string
    kind: "profile" | "comment" | "draft"
    deletedAt: number
    summary: string
}

const STORAGE_KEY = "mirror_trash_v1"

function isClient() {
    return typeof window !== "undefined"
}

const initialTrash: TrashItem[] = [
    {
        id: "trash_profile_1",
        title: "Event Operator",
        kind: "profile",
        deletedAt: Date.now() - 1000 * 60 * 45,
        summary: "A more energetic voice profile that leaned too promotional for the current brand tone."
    },
    {
        id: "trash_comment_1",
        title: "Comment draft for Elena Torres",
        kind: "comment",
        deletedAt: Date.now() - 1000 * 60 * 60 * 7,
        summary: "A saved comment variation that was replaced by a sharper, more concise version."
    }
]

function readTrash(): TrashItem[] {
    if (!isClient()) return initialTrash.map((item) => ({ ...item }))

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialTrash.map((item) => ({ ...item }))

    try {
        const parsed = JSON.parse(raw) as TrashItem[]
        if (!Array.isArray(parsed)) return initialTrash.map((item) => ({ ...item }))
        return parsed
    } catch {
        return initialTrash.map((item) => ({ ...item }))
    }
}

function writeTrash(items: TrashItem[]) {
    if (!isClient()) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function listTrash(): Promise<TrashItem[]> {
    return readTrash().sort((a, b) => b.deletedAt - a.deletedAt)
}

export async function restoreTrashItem(id: string): Promise<TrashItem[]> {
    const next = readTrash().filter((item) => item.id !== id)
    writeTrash(next)
    return next.sort((a, b) => b.deletedAt - a.deletedAt)
}

export async function deleteTrashItem(id: string): Promise<TrashItem[]> {
    const next = readTrash().filter((item) => item.id !== id)
    writeTrash(next)
    return next.sort((a, b) => b.deletedAt - a.deletedAt)
}
