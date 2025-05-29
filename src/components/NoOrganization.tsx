import CreateOrganization from "./CreateOrganization";

interface NoOrganizationProps {
  userInfo: any;
  invite?: any;
}

const NoOrganization = ({ userInfo, invite }: NoOrganizationProps) => {
  return (
    <div className="flex flex-col py-16">
      <div className="flex flex-col w-full mb-8">
        <h2 className="text-xl font-semibold mb-4 self-center text-gray-800">
          Invitation
        </h2>
        {
          invite ? (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded px-4 py-3 mb-2">
              <div>
                <div className="font-medium text-blue-900">
                  {userInfo.organization?.name || "Organization"}
                </div>
                <div className="text-sm text-blue-700">
                  Invited by: {invite.invitedBy?.name || invite.invitedBy?.email || "Admin"}
                </div>
              </div>
              <form action={`/api/organization/accept-invite`} method="POST">
                <input type="hidden" name="inviteId" value={invite.id} />
                <button
                  type="submit"
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Join
                </button>
              </form>
            </div>
          ) : (
            <div className="flex justify-center text-gray-500">
              No invite found
            </div>
          )
        }
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex flex-col items-center px-8 py-10">
        <CreateOrganization />
      </div>
    </div>
  );
};

export default NoOrganization;