import { getSession } from "next-auth/react";
import { GetServerSidePropsContext } from "next";
import { redirect } from "next/navigation";
import MainLayout from "~/components/MainLayout";
import { createCaller } from "~/server/api/root";
import { db } from "~/server/db";

interface HomeProps {
  session: any; 
  userInfo: any;
}

export default function Home({ session, userInfo }: HomeProps) {
  
  return (
    <MainLayout userInfo={userInfo} />
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
  
  return {
    props: {
      session,
      userInfo
    },
  };
}