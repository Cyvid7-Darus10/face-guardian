import { NextRouter } from 'next/router';
import { SupabaseClient } from '@supabase/supabase-js';

const signIn = (router: NextRouter) => {
  router.push('/login');
};

const signOut = async (router: NextRouter, supabaseClient: SupabaseClient) => {
  await supabaseClient.auth.signOut();
  router.push('/');
};

export { signIn, signOut };
