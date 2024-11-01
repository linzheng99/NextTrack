import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="flex w-full h-full">
        {/* sidebar */}
        <div className="hidden fixed left-0 top-0 lg:block lg:w-[264px] h-full overflow-y-auto">
          <Sidebar />
        </div>
        <div className="lg:pl-[264px]">
          <div className="mx-auto max-w-screen-2xl h-full">
            {/* nav */}
            <div className="h-[60px] border"></div>
            <main>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
