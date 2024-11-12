import { Loader } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="text-sm text-neutral-500 animate-spin" />
    </div>
  )
}
