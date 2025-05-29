import { api } from "~/utils/api";

export default function ListTeamMember() {
  const { data: members, isLoading, error } = api.organization.getOrganizationMembers.useQuery();
  
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
          Team Members
        </h2>
      </div>
      <div className="mt-8 space-y-6">
        {members && members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {member.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-500">
                      Role: {member.role}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {new Date(member.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No team members found
          </div>
        )}
      </div>
    </div>
  );
}