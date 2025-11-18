import * as React from "react";
import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const Empty: React.FC<EmptyProps> = ({ icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-10 text-slate-500", className)}>
      <div className="mb-3 text-slate-400">{icon ?? <FileQuestion className="h-8 w-8" />}</div>
      <div className="font-medium text-slate-600">{title}</div>
      {description ? <div className="text-sm mt-1">{description}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

Empty.displayName = "Empty";