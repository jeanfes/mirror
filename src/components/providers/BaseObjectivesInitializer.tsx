import { createClient } from "@/lib/supabase/server"
import { initializeBaseObjectives } from "@/features/settings/services/user-settings.service"

/**
 * Server component that initializes the base objectives cache early in app startup.
 * This ensures that base objectives are available for all subsequent requests.
 */
export async function BaseObjectivesInitializer() {
    try {
        const supabase = await createClient()
        await initializeBaseObjectives(supabase)
    } catch (error) {
        console.warn(
            "[BaseObjectivesInitializer] Failed to initialize base objectives:",
            error
        )
        // Non-blocking: if initialization fails, app continues with fallback to static seeds
    }

    return null
}
