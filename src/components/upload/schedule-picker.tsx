"use client";

import React from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface SchedulePickerProps {
  value: string; // ISO or datetime-local string
  onChange: (isoString: string) => void;
  disabled?: boolean;
}

export const SchedulePicker: React.FC<SchedulePickerProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  // Compute minimum selectable date (now + 15 minutes) formatted for datetime-local
  const getMinDateTime = (): string => {
    const minDate = new Date(Date.now() + 15 * 60 * 1000);
    const offset = minDate.getTimezoneOffset();
    const localMin = new Date(minDate.getTime() - offset * 60 * 1000);
    return localMin.toISOString().slice(0, 16);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const localVal = e.target.value;
    if (!localVal) {
      onChange("");
      return;
    }
    const dateObj = new Date(localVal);
    onChange(dateObj.toISOString());
  };

  // Convert current ISO string to datetime-local format for the input
  const getInputValue = (): string => {
    if (!value) return "";
    try {
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) return "";
      const offset = dateObj.getTimezoneOffset();
      const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
      return localDate.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  // Format readable display date
  const getFormattedDate = (): string => {
    if (!value) return "";
    try {
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };

  const timeZoneName =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "Local Time";

  return (
    <div className="p-4 rounded-xl bg-apple-pearl border border-apple-hairline space-y-3">
      <div className="flex items-center justify-between text-xs text-apple-ink-muted">
        <span className="flex items-center gap-1.5 font-medium text-apple-ink">
          <Clock className="w-3.5 h-3.5 text-apple-blue" />
          <span>Release Schedule</span>
        </span>
        <span className="text-[11px]">{timeZoneName}</span>
      </div>

      <input
        type="datetime-local"
        min={getMinDateTime()}
        value={getInputValue()}
        onChange={handleDateChange}
        disabled={disabled}
        className="w-full bg-apple-canvas text-apple-ink text-[14px] border border-apple-hairline rounded-xl px-3.5 py-2.5 outline-none focus:border-apple-blue-focus focus:ring-2 focus:ring-apple-blue/20 transition-all cursor-pointer"
      />

      {value && (
        <div className="text-xs text-apple-blue flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>Will automatically publish on {getFormattedDate()}</span>
        </div>
      )}

      <p className="text-[11px] text-apple-ink-muted leading-relaxed">
        YouTube keeps the video private until the scheduled release date/time, then publishes it automatically.
      </p>
    </div>
  );
};
