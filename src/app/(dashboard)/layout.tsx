import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateProjectModel from "@/features/projects/components/create-project-model";
import CreateTaskModel from "@/features/tasks/components/create-task-model";
import CreateWorkspaceModel from "@/features/workspaces/components/create-workspace-model";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModel />
      <CreateProjectModel />
      <CreateTaskModel />
      <div className="flex w-full h-full">
        <div className="hidden fixed left-0 top-0 lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px] w-full">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Navbar />
            <main className="h-full py-8 px-6 flex flex-col">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
