import { Upload, FileSpreadsheet, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "upload" | "view" | "delete";
  fileName: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const activityConfig = {
  upload: {
    icon: Upload,
    label: "Uploaded",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  view: {
    icon: Eye,
    label: "Viewed",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  delete: {
    icon: Trash2,
    label: "Deleted",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center text-center">
        <FileSpreadsheet className="mb-3 h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const config = activityConfig[activity.type];
        const Icon = config.icon;
        return (
          <div
            key={activity.id}
            className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
          >
            <div className={cn("rounded-lg p-2", config.bgColor)}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {config.label}{" "}
                <span className="text-muted-foreground">{activity.fileName}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
