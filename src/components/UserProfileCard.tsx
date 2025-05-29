'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { titleCase } from '~/utils/helpers';

interface UserProfileCardProps {
  userInfo: any;
}

const UserProfileCard = ({ userInfo }: UserProfileCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 z-50 relative">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium text-gray-900">{titleCase(session?.user?.name || '')}</h3>
            <p className="text-sm text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() =>  router.push("/organization")}
            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            {userInfo.organization?.name ? titleCase(userInfo.organization.name) : 'Create/Join Organization'}
          </button>

          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md mt-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard; 