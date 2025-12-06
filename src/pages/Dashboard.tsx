import { useState } from "react";
import { FileSpreadsheet, Upload, TrendingUp, Users } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { DataTable } from "@/components/dashboard/DataTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockFiles = [
  { id: "1", name: "sales_data_2024.csv", size: 256000, rows: 1250, uploaded_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", name: "customer_analytics.xlsx", size: 512000, rows: 5420, uploaded_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  { id: "3", name: "inventory_report.csv", size: 128000, rows: 890, uploaded_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const mockActivities = [
  { id: "1", type: "upload" as const, fileName: "sales_data_2024.csv", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: "2", type: "view" as const, fileName: "customer_analytics.xlsx", timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
  { id: "3", type: "upload" as const, fileName: "inventory_report.csv", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
];

const mockChartData = [
  { name: "Mon", uploads: 4, views: 12 },
  { name: "Tue", uploads: 3, views: 8 },
  { name: "Wed", uploads: 7, views: 15 },
  { name: "Thu", uploads: 5, views: 10 },
  { name: "Fri", uploads: 8, views: 22 },
  { name: "Sat", uploads: 2, views: 6 },
  { name: "Sun", uploads: 1, views: 4 },
];

interface DashboardProps {
  userEmail?: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    toast({
      title: "File uploaded successfully",
      description: `${file.name} has been uploaded and processed.`,
    });
  };

  const handleView = (file: typeof mockFiles[0]) => {
    toast({ title: "Opening file", description: file.name });
  };

  const handleDownload = (file: typeof mockFiles[0]) => {
    toast({ title: "Downloading file", description: file.name });
  };

  const handleDelete = (file: typeof mockFiles[0]) => {
    toast({ title: "File deleted", description: file.name, variant: "destructive" });
  };

  const tabTitles: Record<string, string> = {
    dashboard: "Dashboard",
    upload: "Upload Files",
    data: "Your Data",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      
      <main className="ml-64">
        <Header title={tabTitles[activeTab]} userEmail={userEmail} />
        
        <div className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Files"
                  value={mockFiles.length}
                  change="+2 this week"
                  changeType="positive"
                  icon={FileSpreadsheet}
                  iconColor="text-primary"
                  delay={0}
                />
                <StatCard
                  title="Total Rows"
                  value="7.5K"
                  change="+1.2K this week"
                  changeType="positive"
                  icon={TrendingUp}
                  iconColor="text-success"
                  delay={100}
                />
                <StatCard
                  title="Uploads Today"
                  value={1}
                  icon={Upload}
                  iconColor="text-accent"
                  delay={200}
                />
                <StatCard
                  title="Storage Used"
                  value="856 KB"
                  change="12% of limit"
                  changeType="neutral"
                  icon={Users}
                  iconColor="text-warning"
                  delay={300}
                />
              </div>

              {/* Chart and Activity */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Weekly Activity</h2>
                  <AnalyticsChart data={mockChartData} />
                </div>
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
                  <RecentActivity activities={mockActivities} />
                </div>
              </div>

              {/* Recent Files */}
              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Files</h2>
                <DataTable
                  files={mockFiles}
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          )}

          {activeTab === "upload" && (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-8">
                <h2 className="mb-2 text-xl font-semibold text-foreground">Upload Data</h2>
                <p className="mb-6 text-muted-foreground">
                  Upload your CSV or Excel files to analyze and visualize your data.
                </p>
                <FileUploader onUpload={handleUpload} isLoading={isUploading} />
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div>
              <DataTable
                files={mockFiles}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                  title="Total Views"
                  value={77}
                  change="+12% from last week"
                  changeType="positive"
                  icon={TrendingUp}
                  iconColor="text-primary"
                  delay={0}
                />
                <StatCard
                  title="Avg. File Size"
                  value="298 KB"
                  icon={FileSpreadsheet}
                  iconColor="text-accent"
                  delay={100}
                />
                <StatCard
                  title="Processing Time"
                  value="1.2s"
                  change="Avg per file"
                  changeType="neutral"
                  icon={Upload}
                  iconColor="text-success"
                  delay={200}
                />
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Upload & View Trends</h2>
                <AnalyticsChart data={mockChartData} />
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">Settings</h2>
                <p className="text-muted-foreground">
                  Settings panel coming soon. Here you'll be able to manage your account, preferences, and integrations.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
