import { redirect } from 'next/navigation';
import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from 'next';
import Header from '~/components/Header';
import { titleCase } from '~/utils/helpers';
import NoOrganization from '~/components/NoOrganization';
import ListTeamMember from '~/components/ListTeamMember';
import ListInvite from '~/components/ListInvite';
import InviteMember from '~/components/InviteMember';
import { createCaller } from "~/server/api/root";
import { db } from "~/server/db";

interface OrganizationPageProps {
  userInfo: any;
  invite?: any;
}

export default function OrganizationPage({ userInfo, invite }: OrganizationPageProps) {

  return (
    <div className="min-h-screen bg-white">
      <Header userInfo={userInfo} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#344055' }}>
            {userInfo.organization?.name ? titleCase(userInfo.organization.name) : "Organization"}
          </h1>
        </div>
        {
          !userInfo.organization?.id ? (
            <NoOrganization userInfo={userInfo} invite={invite}/>
          ) : (
            <ListTeamMember />
          )
        }
        {
          userInfo.organization?.id && userInfo.role === "ADMIN" && (
            <ListInvite />
          )
        }
        {
          userInfo.organization?.id && userInfo.role === "ADMIN" && (
            <div className="flex justify-end my-8">
              <InviteMember />
            </div>
          )
        }
      </main>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {    
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin", 
        permanent: false, 
      },
    };
  }

  const caller = createCaller({ session, db });
  const userInfo = await caller.user.getById({ id: session.user.id });
  if (!userInfo) {
    redirect('/auth/signin');
  }
  const invite = await caller.invite.checkInvite({ email: userInfo.email });

  return {
    props: {
      session,
      userInfo,
      ...(invite ? [{
        invite: {
          ...invite,
          createdAt: invite?.createdAt.toISOString(),
          updatedAt: invite?.updatedAt.toISOString(),
        }
      }] : []),
    },
  };
}