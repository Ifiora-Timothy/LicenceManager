import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

export async function requireAuth(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { session } };
}