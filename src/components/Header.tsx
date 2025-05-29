'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import UserProfileCard from './UserProfileCard';

interface HeaderLayoutProps {
  userInfo: any;
}

const Header = ({ userInfo }: HeaderLayoutProps) => {
  const { data: session } = useSession();
  const [showProfileCard, setShowProfileCard] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">Task Management</h1>
          </div>
          
          {session && (
            <div className="relative">
              <button
                onClick={() => setShowProfileCard(!showProfileCard)}
                className="flex items-center space-x-2"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {session.user?.name?.[0] || 'U'}
                    </span>
                  </div>
                )}
              </button>
              
              {showProfileCard && (
                <div className="absolute right-0 mt-2 w-72">
                  <UserProfileCard userInfo={userInfo} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 