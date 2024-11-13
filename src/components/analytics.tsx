import { type ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics"

import AnalyticsCard from "./analytics-card"
import DottedSeparator from "./dotted-separator"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

export default function Analytics({ data }: ProjectAnalyticsResponseType) {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row gap-2">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="总任务"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical"  />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="已分配任务"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="完成任务"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="逾期任务"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="未完成任务"
            value={data.inCompletedTaskCount}
            variant={data.inCompletedTaskDifference > 0 ? 'up' : 'down'}
            increaseValue={data.inCompletedTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
