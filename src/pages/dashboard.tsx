import { useSession } from 'next-auth/react';
import MainLayout from '~/components/MainLayout';
import { api } from '~/utils/api';
import { TaskStatus, TaskPriority } from '@prisma/client';

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading) {
    return (
      <MainLayout userInfo={session?.user || {}}>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  // Calculate analytics
  const totalTasks = tasks?.length || 0;
  const tasksByStatus = tasks?.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>) || {} as Record<TaskStatus, number>;
  
  const tasksByPriority = tasks?.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>) || {} as Record<TaskPriority, number>;

  const completedTasks = tasksByStatus['DONE'] || 0;
  const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const overdueTasks = tasks?.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE'
  ).length || 0;

  return (
    <MainLayout userInfo={session?.user || {}}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{completionRate.toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Overdue Tasks</h3>
            <p className="mt-2 text-3xl font-semibold text-red-600">{overdueTasks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Tasks</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {tasksByStatus['IN_PROGRESS'] || 0}
            </p>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(Object.entries(tasksByStatus) as [TaskStatus, number][]).map(([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">{status}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tasks by Priority</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.entries(tasksByPriority) as [TaskPriority, number][]).map(([priority, count]) => (
              <div key={priority} className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">{priority}</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {tasks?.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Status: {task.status} • Priority: {task.priority}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 