import { useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import HomeLayout from '@/components/Layout/HomeLayout';
import Dashboard from '@/components/Common/Dashboard';

const Home = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    // Handle magic link authentication from URL hash
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) {
          console.error('Authentication error:', error);
          router.push('/login');
          return;
        }

        // If there's a valid session, continue
        if (data.session) {
          console.log('Authentication successful');
          return;
        }

        // If no session but there are hash parameters, try to get the session
        if (window.location.hash) {
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken) {
            const { data: sessionData, error: sessionError } =
              await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });

            if (sessionError) {
              console.error('Session error:', sessionError);
              router.push('/login');
            } else {
              console.log('Session established successfully');
              // Clear the hash from URL
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname
              );
            }
          }
        }
      } catch (error) {
        console.error('Authentication handling error:', error);
        router.push('/login');
      }
    };

    handleAuthCallback();
  }, [supabaseClient, router]);

  return (
    <HomeLayout title="Home" restrict={true}>
      <Dashboard />
    </HomeLayout>
  );
};

export default Home;
