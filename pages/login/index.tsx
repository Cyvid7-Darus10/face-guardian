import Face from '@/components/Pages/Login/Face';
import ParticleLayout from '@/components/Layout/ParticleLayout';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

const Login = ({ appData }: { appData?: string }): JSX.Element => {
  return (
    <ParticleLayout title="Authenticate" restrict={true} appData={appData}>
      <Face appData={appData} />
    </ParticleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const appId = context.query.appId as string;
  const redirectTo = context.query.redirectUrl as string;

  if (appId) {
    const response = await fetch(
      'https://www.face-guardian.com/api/authenticate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId }),
      }
    );

    const data = await response.json();

    if (data.status) {
      return {
        props: {
          appData: { ...data.appData, redirectTo },
        },
      };
    }
  }

  return {
    props: {},
  };
};

export default Login;
