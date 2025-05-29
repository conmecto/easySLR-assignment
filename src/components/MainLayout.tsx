import Link from 'next/link';
import Header from './Header';

interface MainLayoutProps {
  userInfo: any;
}

const MainLayout = ({ userInfo }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-10"> 
        <Header userInfo={userInfo} />
      </div>
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        {
          userInfo.organization ? 
          (
            <></>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="mb-4 text-lg font-semibold text-gray-700">
                Please join or create your organization
              </p>
              <Link
                href="/organization"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
              >
                Organization
              </Link>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default MainLayout; 