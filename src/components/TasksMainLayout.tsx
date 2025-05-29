import { useState } from "react";
import { api } from "~/utils/api";
import CreateTask from "./CreateTask";
import TaskFilters from "./TaskFilters";
import TaskColumn from "./TaskColumn";
import { TaskStatus, TaskPriority } from "@prisma/client";

const STATUS_COLORS = {
  TODO: "bg-gray-100",
  IN_PROGRESS: "bg-blue-100",
  DONE: "bg-green-100",
  BLOCKED: "bg-red-100",
  ARCHIVED: "bg-gray-200"
};

export default function TasksMainLayout() {
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: TaskPriority;
    sortBy: "priority" | "createdAt" | "dueDate";
    sortOrder: "asc" | "desc";
  }>({
    status: undefined,
    priority: undefined,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const { data: tasks, isLoading } = api.task.getAll.useQuery(filters);

  const groupedTasks = tasks?.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status]!.push(task);
    return acc;
  }, {} as Record<string, typeof tasks>) ?? {};

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="mt-4">
          <CreateTask />
        </div>
        <div className="mt-4">
          <TaskFilters filters={filters} onFilterChange={setFilters} />
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-x-auto">
        <div className="flex space-x-4 min-h-full">
          {Object.entries(STATUS_COLORS).map(([status, bgColor]) => (
            <TaskColumn
              key={status}
              status={status as TaskStatus}
              tasks={groupedTasks[status as TaskStatus] ?? []}
              bgColor={bgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

