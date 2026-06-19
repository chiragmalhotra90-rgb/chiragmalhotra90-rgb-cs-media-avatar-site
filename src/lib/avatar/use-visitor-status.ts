"use client";

import { useEffect, useState } from "react";

export type VisitorStatus = "first-time" | "returning";

const FIRST_VISIT_KEY = "cs-first-visit";
const SESSION_BOOTED_KEY = "cs-avatar-session-booted";
const RETURNING_THRESHOLD_MS = 5 * 60 * 1000;

export function useVisitorStatus(): VisitorStatus {
  const [status, setStatus] = useState<VisitorStatus>("first-time");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const firstVisit = window.localStorage.getItem(FIRST_VISIT_KEY);
      const bootedInTab =
        window.sessionStorage.getItem(SESSION_BOOTED_KEY) === "true";

      if (!firstVisit) {
        setStatus("first-time");
        window.sessionStorage.setItem(SESSION_BOOTED_KEY, "true");
        return;
      }

      const firstVisitTime = new Date(firstVisit).getTime();
      const validFirstVisit = Number.isFinite(firstVisitTime);
      const elapsed = validFirstVisit ? Date.now() - firstVisitTime : 0;

      setStatus(
        bootedInTab || (validFirstVisit && elapsed > RETURNING_THRESHOLD_MS)
          ? "returning"
          : "first-time"
      );
      window.sessionStorage.setItem(SESSION_BOOTED_KEY, "true");
    }, 0);

    // TODO: Wire this to /api/avatar/visitor-status when login is re-enabled
    // to detect returning visitors across devices via AvatarSession.email.
    return () => window.clearTimeout(timeout);
  }, []);

  return status;
}
