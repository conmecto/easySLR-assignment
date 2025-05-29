import { TaskPriority, TaskStatus } from "@prisma/client";

interface TaskFiltersProps {
  filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  onFilterChange: (filters: any) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex space-x-4 justify-end">
      <select
        className="rounded border p-2"
        value={filters.status ?? ""}
        onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
      >
        <option value="">All Status</option>
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
        <option value="BLOCKED">Blocked</option>
        <option value="ARCHIVED">Archived</option>
      </select>

      <select
        className="rounded border p-2"
        value={filters.priority ?? ""}
        onChange={(e) => onFilterChange({ ...filters, priority: e.target.value || undefined })}
      >
        <option value="">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <select
        className="rounded border p-2"
        value={filters.sortBy}
        onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
      >
        <option value="createdAt">Created Date</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      <button
        className="rounded border p-2"
        onClick={() => onFilterChange({
          ...filters,
          sortOrder: filters.sortOrder === "asc" ? "desc" : "asc"
        })}
      >
        {filters.sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}