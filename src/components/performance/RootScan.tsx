"use client";
import { scan } from "react-scan";
import { useEffect } from "react";

export function ReactScan() {
  useEffect(() => {
    scan({
      enabled: true, 
      log: true,
      showToolbar: true, 
    });
    console.log("🚀 React Scan activado"); 
  }, []);

  return null;
}