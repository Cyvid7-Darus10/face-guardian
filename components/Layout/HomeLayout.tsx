import { useEffect, ReactNode, useState } from 'react';
import Head from 'next/head';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import UnAuthorize from '../Common/UnAuthorize';
import Navbar from '../Atom/Navbar';
import useUserDataStore from '@/store/userDataStore';

const HomeLayout = ({
  children,
  title,
  restrict,
}: {
  children: ReactNode;
  title?: string;
  restrict?: boolean;
}) => {
  const session = useSession();
  const [restrictPage, setRestrictPage] = useState(true);
  const { setUserData } = useUserDataStore();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    if (session?.user?.email && restrict) {
      setRestrictPage(false);
    }
  }, [session, restrict]);

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id as string)
        .single();

      if (error) {
        console.error(error);
        return;
      } else if (data) {
        setUserData(data);
      }
    };

    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Facial authentication OAuth provider for secure and seamless authentication."
        />
        <meta
          name="keywords"
          content="facial authentication, OAuth provider, secure authentication"
        />
        <link rel="canonical" href="https://www.face-guardian.com/" />
        <meta
          property="og:title"
          content="Facial Authentication OAuth Provider - Face Guardian"
        />
        <meta
          property="og:description"
          content="Facial authentication OAuth provider for secure and seamless authentication."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.face-guardian.com/" />
        <meta property="og:image" content="/fg-logo.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:title"
          content="Facial Authentication OAuth Provider - Face Guardian"
        />
        <meta
          property="twitter:description"
          content="Facial authentication OAuth provider for secure and seamless authentication."
        />
        <meta property="twitter:image" content="/fg-logo.png" />
        <title>{title ? `${title} | Face Guardian` : 'Face Guardian'}</title>
      </Head>
      <div className="h-screen">
        <div className="h-[720px]">
          {!restrictPage && <Navbar />}
          {!restrictPage && children}
          {restrictPage && <UnAuthorize />}
        </div>
      </div>
    </>
  );
};

export default HomeLayout;
