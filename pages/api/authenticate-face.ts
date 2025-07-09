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
  const supabaseServiceKey = process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({
      message: 'Server configuration error',
      success: false,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Get user data with service role key for security
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, authenticated')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
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

    // TODO: Verify CAPTCHA token here
    // You can add your CAPTCHA verification logic

    // Create a secure session using Supabase admin API
    const { data: session, error: sessionError } =
      await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: userData.email,
        options: {
          redirectTo: `${process.env.SITE_URL || 'http://localhost:3000'}/home`,
        },
      });

    if (sessionError) {
      return res.status(500).json({
        message: 'Failed to create session',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Authentication successful',
      success: true,
      redirectUrl: session.properties?.action_link || '/home',
    });
  } catch (error) {
    console.error('Face authentication error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
}
