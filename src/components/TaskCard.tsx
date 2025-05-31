import { Task } from "@prisma/client";
import { api } from "~/utils/api";
import Link from "next/link";

const PRIORITY_COLORS = {
  LOW: "bg-gray-200",
  MEDIUM: "bg-blue-200",
  HIGH: "bg-orange-200",
  URGENT: "bg-red-200"
};

export default function TaskCard({ task }: { task: Task }) {
  const utils = api.useUtils();
  const updateStatus = api.task.updateStatus.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <Link href={`/task/${task.id}`} className="hover:text-blue-600">
          <h4 className="font-medium">{task.title}</h4>
        </Link>
        <span className={`px-2 py-1 rounded text-xs ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
      )}
      {task.dueDate && (
        <p className="text-xs text-gray-500 mt-2">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <div className="mt-4 flex justify-end">
        <select
          className="text-sm border rounded p-1"
          value={task.status}
          onChange={(e) => updateStatus.mutate({
            taskId: task.id,
            status: e.target.value as Task["status"]
          })}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="BLOCKED">Blocked</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </div>
  );
}