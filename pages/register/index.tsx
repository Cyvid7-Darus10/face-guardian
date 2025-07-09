import ParticleLayout from '@/components/Layout/ParticleLayout';
import RegisterPage from '@/components/Pages/Register';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

const Register = ({ appData }: { appData?: any }) => {
  return (
    <ParticleLayout
      title="Create Account - Face Guardian"
      restrict={false}
      appData={appData}
    >
      <RegisterPage appData={appData} />
    </ParticleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const appId = context.query.appId as string;
  const redirectTo = context.query.redirectUrl as string;

  if (appId) {
    try {
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
    } catch (error) {
      console.error('Error fetching app data:', error);
    }
  }

  return {
    props: {},
  };
};

export default Register;
