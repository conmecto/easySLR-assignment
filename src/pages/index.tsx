import { getSession, signOut } from "next-auth/react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next"; // Import for types

interface HomeProps {
  session: any; 
}

export default function Home({ session }: HomeProps) {
  return (
    <>
      <Head>
        <title>Welcome to T3 App</title>
        <meta name="description" content="Welcome page for T3 App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome, <span className="text-[hsl(280,100%,70%)]">{session?.user?.name || session?.user?.email || "User"}</span>!
          </h1>
          <p className="text-xl text-white/80">You are successfully logged in.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <button
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20 transition-colors duration-200"
              onClick={() => signOut()} 
            >
              <h3 className="text-2xl font-bold">Sign out</h3>
              <p className="text-lg">Click here to log out of your account.</p>
            </button>
          </div>
        </div>
      </main>
    </>
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

  return {
    props: {
      session,
    },
  };
}