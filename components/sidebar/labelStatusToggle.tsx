"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type WorkStatus = "not_started" | "in_progress" | "done";

interface LabelStatusToggleProps {
  status: WorkStatus;
  onChange: (status: WorkStatus) => void;
  isLoading?: boolean;
}

const statusOptions: { value: WorkStatus; label: string }[] = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export function LabelStatusToggle({
  status,
  onChange,
  isLoading = false,
}: LabelStatusToggleProps) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <Label htmlFor="status-toggle" className="text-xs font-medium text-muted-foreground">
        Label Status
      </Label>
      <Select
        value={status}
        onValueChange={(value) => onChange(value as WorkStatus)}
        disabled={isLoading}
      >
        <SelectTrigger id="status-toggle" className="h-8 w-full text-sm">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <StatusDot status={option.value} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function StatusDot({ status }: { status: WorkStatus }) {
  const colors = {
    not_started: "bg-muted-foreground/30",
    in_progress: "bg-blue-500",
    done: "bg-green-500",
  };

  return <div className={`size-2 rounded-full ${colors[status]}`} />;
}
