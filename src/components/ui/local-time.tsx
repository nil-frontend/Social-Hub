"use client";

import React, { useEffect, useState } from "react";

interface LocalTimeProps {
  date: string | Date;
  className?: string;
  format?: "full" | "short" | "time";
}

/**
 * Renders dates and times converted accurately to the user's local device timezone.
 * Avoids React hydration mismatch by rendering the local time on the client.
 */
export function LocalTime({ date, className, format = "full" }: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    try {
      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) {
        setFormatted(String(date));
        return;
      }

      if (format === "short") {
        setFormatted(
          d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        );
      } else if (format === "time") {
        setFormatted(
          d.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
          })
        );
      } else {
        setFormatted(
          d.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    } catch {
      setFormatted(String(date));
    }
  }, [date, format]);

  if (!formatted) {
    return <span className={className}>...</span>;
  }

  return <span className={className}>{formatted}</span>;
}
