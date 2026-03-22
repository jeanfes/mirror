import { getAuthContext } from "./src/lib/supabase/auth-context";
import { createClient } from "./src/lib/supabase/client";

// This is a simple verification script to be run with tsx or node if compiled
async function verify() {
  console.log("Verifying singleton pattern...");

  const p1 = getAuthContext();
  const p2 = getAuthContext();

  if (p1 === p2) {
    console.log("✅ SUCCESS: getAuthContext returns the same promise instance.");
  } else {
    console.error("❌ FAILURE: getAuthContext returns different promise instances.");
  }

  const c1 = createClient();
  const c2 = createClient();

  if (c1 === c2) {
    console.log("✅ SUCCESS: createClient returns the same client instance.");
  } else {
    console.error("❌ FAILURE: createClient returns different client instances.");
  }
}

// Note: This script won't run directly in this environment without proper setup 
// but it serves as a logic check and could be used in a real dev environment.
// verify();
