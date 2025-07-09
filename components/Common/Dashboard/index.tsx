import Button from '@mui/material/Button';
import Table from '../../Atom/Table';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();

  const logoutUser = async () => {
    await supabaseClient.auth.signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-row items-center w-full h-full lg:p-10 z-50 gap-5 max-w-[1440px] mx-auto">
      <div className="flex-col w-[200px] justify-start h-full hidden md:flex gap-10">
        <Button
          href="/home"
          variant="contained"
          color="info"
          className=" hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full"
        >
          Websites
        </Button>
        <Button
          onClick={logoutUser}
          variant="contained"
          color="primary"
          className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full"
        >
          Logout
        </Button>
      </div>
      <div className="w-full h-full">
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
