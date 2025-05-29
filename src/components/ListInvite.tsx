import { api } from "~/utils/api";

export default function ListInvite() {
  const { data: invites, isLoading, error } = api.invite.getInvites.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-red-500 text-center">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          Pending Invites
        </h2>
      </div>
      <div className="mt-8 space-y-6">
        {invites && invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex-1 items-center">
                  <p className="text-sm font-medium text-gray-900">
                    {invite.email}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs text-gray-500">
                    Invited by {invite.invitedBy.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No pending invites
          </div>
        )}
      </div>
    </div>
  );
}