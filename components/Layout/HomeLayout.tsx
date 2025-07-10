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
  const [isLoading, setIsLoading] = useState(true);
  const { setUserData } = useUserDataStore();
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    // Give some time for session to be established
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log('HomeLayout session check:', {
      session: !!session,
      email: session?.user?.email,
      restrict,
      isLoading,
    });

    if (session?.user?.email && restrict && !isLoading) {
      setRestrictPage(false);
    } else if (restrict && !isLoading) {
      setRestrictPage(true);
    } else {
      setRestrictPage(false);
    }
  }, [session, restrict, isLoading]);

  useEffect(() => {
    const getUserData = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          } else if (data) {
            setUserData(data);
          }
        } catch (error) {
          console.error('Unexpected error fetching user data:', error);
        }
      }
    };

    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Show loading state while checking authentication
  if (isLoading && restrict) {
    return (
      <>
        <Head>
          <title>{title ? `${title} | Face Guardian` : 'Face Guardian'}</title>
        </Head>
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Authenticating...</span>
          </div>
        </div>
      </>
    );
  }

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
