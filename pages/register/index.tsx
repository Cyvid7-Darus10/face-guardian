import { useState } from 'react';
import Face from '@/components/Pages/Register/Face';
import InputDetails from '@/components/Pages/Register/InputDetails';
import ParticleLayout from '@/components/Layout/ParticleLayout';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

const Register = ({ appData }: { appData?: string }) => {
  const [faceDescriptors, setFaceDescriptors] = useState(false);
  return (
    <ParticleLayout title="Register" restrict={true} appData={appData}>
      {faceDescriptors ? (
        <InputDetails faceDescriptors={faceDescriptors} />
      ) : (
        <Face setFaceDescriptors={setFaceDescriptors} />
      )}
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

export default Register;
