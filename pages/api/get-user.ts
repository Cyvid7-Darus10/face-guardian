import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  // Use server-side environment variables (without NEXT_PUBLIC_ prefix)
  const supabaseUrl = process.env.SUPABASE_URL as string;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      message: 'Server configuration error',
      status: false,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // check if the token exists in the database
    let { data, error } = await supabase
      .from('tokens')
      .select('profile_id, profiles (id, first_name, last_name, email)')
      .eq('token', token)
      .single();

    if (error) {
      return res.status(500).json({ message: error.message, status: false });
    }

    if (!data) {
      return res
        .status(404)
        .json({ message: 'Token not found', status: false });
    }

    return res
      .status(200)
      .json({ message: 'User data retrieved', status: true, data });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}
