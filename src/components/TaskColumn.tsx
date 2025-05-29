import { Task } from "@prisma/client";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: string;
  tasks: Task[];
  bgColor: string;
}

export default function TaskColumn({ status, tasks, bgColor }: TaskColumnProps) {
  return (
    <div className={`flex-1 min-w-[300px] rounded-lg p-4 ${bgColor}`}>
      <h3 className="font-semibold mb-4">
        {status.replace("_", " ")} ({tasks.length})
      </h3>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}