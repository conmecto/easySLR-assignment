import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MainLayout from '../../components/MainLayout';
import { Task, User, TaskAssignment, TaskStatus, TaskPriority } from '@prisma/client';
import { api } from '~/utils/api';

type TaskWithDetails = Task & {
  createdBy: User;
  assignments: (TaskAssignment & {
    assignee: User;
    assignedBy: User;
  })[];
};

export default function TaskDetail() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  const utils = api.useUtils();
  const taskId = router.query.id ? String(router.query.id) : undefined;
  const { data: task, isLoading } = api.task.getById.useQuery(
    taskId!,
    { enabled: !!taskId }
  );
  const { data: organizationMembers } = api.organization.getOrganizationMembers.useQuery();
  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      utils.task.getById.invalidate();
      setIsEditing(false);
    },
  });
  const assignUser = api.task.assignUser.useMutation({
    onSuccess: () => {
      utils.task.getById.invalidate();
      setSelectedAssignee('');
    },
  });

  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  const handleSave = async () => {
    if (!task) return;

    updateTask.mutate({
      taskId: task.id,
      title: editedTask.title || '',
      description: editedTask.description || '',
      status: editedTask.status as TaskStatus,
      priority: editedTask.priority as TaskPriority,
      dueDate: editedTask.dueDate ? new Date(editedTask.dueDate) : null,
    });
  };

  const handleAssignUser = async () => {
    if (!selectedAssignee || !task) return;

    assignUser.mutate({
      taskId: task.id,
      assigneeId: selectedAssignee,
    });
  };

  if (isLoading || !task) {
    return (
      <MainLayout userInfo={session?.user || {}}>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout userInfo={session?.user || {}}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedTask.title}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows={4}
              />
              <select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })}
                className="w-full p-2 border rounded"
              >
                {Object.values(TaskStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })}
                className="w-full p-2 border rounded"
              >
                {Object.values(TaskPriority).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={updateTask.isPending}
                >
                  {updateTask.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p>{task.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{task.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Priority</h3>
                  <p>{task.priority}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Created By</h3>
                  <p>{task.createdBy.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Due Date</h3>
                  <p>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Assigned Users</h3>
                <div className="space-y-2">
                  {task.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span>{assignment.assignee.name}</span>
                      <span className="text-sm text-gray-500">
                        Assigned by {assignment.assignedBy.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <select
                    value={selectedAssignee}
                    onChange={(e) => setSelectedAssignee(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a user to assign</option>
                    {organizationMembers?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignUser}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={assignUser.isPending}
                  >
                    {assignUser.isPending ? 'Assigning...' : 'Assign User'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 