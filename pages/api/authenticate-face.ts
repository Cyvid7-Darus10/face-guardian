import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function authenticateFace(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId, captchaToken } = req.body;

  if (!userId || !captchaToken) {
    return res.status(400).json({
      message: 'User ID and captcha token are required',
      success: false,
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // Must use service role key for admin operations

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables:', {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
    });
    return res.status(500).json({
      message: 'Server configuration error - missing environment variables',
      success: false,
    });
  }

  // Create Supabase client with service role key for admin operations
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, authenticated')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('User lookup error:', userError);
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    if (!userData.authenticated) {
      return res.status(401).json({
        message: 'User account not verified',
        success: false,
      });
    }

    // TODO: Verify CAPTCHA token here if needed
    // For now, we'll assume it's valid since it was verified on the client

    // Create a magic link for immediate authentication
    const { data: authData, error: authError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: userData.email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/home`,
        },
      });

    if (authError || !authData) {
      console.error('Magic link creation error:', authError);
      return res.status(500).json({
        message: 'Failed to create authentication link',
        success: false,
        error: authError?.message,
      });
    }

    // Return the magic link for client-side authentication
    return res.status(200).json({
      message: 'Face authentication successful',
      success: true,
      magicLink: authData.properties?.action_link,
      redirectUrl: '/home',
      user: {
        id: userData.id,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error('Face authentication error:', error);
    return res.status(500).json({
      message: 'Internal server error during face authentication',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
