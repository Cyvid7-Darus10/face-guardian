import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import Link from 'next/link';
import Modal from '../Modal';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useUserDataStore from '@/store/userDataStore';
import ConfirmationModal from '@/components/Atom/ConfirmationModal';
import { toast } from 'react-toastify';

export default function BasicTable() {
  const [open, setOpen] = useState(false);
  const [websiteList, setWebsiteList] = useState<any>([]);
  const supabaseClient = useSupabaseClient();
  const { userData } = useUserDataStore();

  useEffect(() => {
    const fetchApps = async () => {
      const { data, error } = await supabaseClient
        .from('tokens')
        .select('*, apps:app_id(*)')
        .eq('profile_id', userData?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      const uniqueApps = data?.reduce((acc, curr) => {
        if (!acc[curr.app_id]) {
          acc[curr.app_id] = curr;
        }
        return acc;
      }, {});

      const rowData = Object.values(uniqueApps || {}).map((app: any) => ({
        appId: app.app_id,
        name: app.apps.name,
        lastAccessed: app.created_at,
        url: app.apps.domain,
      }));

      setWebsiteList(rowData);
    };

    if (userData?.id) fetchApps();
  }, [supabaseClient, userData]);

  const deleteApp = async (appId: string) => {
    const { error } = await supabaseClient
      .from('tokens')
      .delete()
      .eq('app_id', appId)
      .eq('profile_id', userData?.id);

    if (error) {
      console.error(error);
      return;
    } else {
      toast.success('Successfully deleted token access to website');
      setWebsiteList((prev: any) =>
        prev.filter((app: any) => app.appId !== appId)
      );
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow className="bg-[#ddf3ff] ">
            <TableCell align="center">Website</TableCell>
            <TableCell align="center">Last Accessed</TableCell>
            <TableCell align="center" className="w-[150px]">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {websiteList.map((row: any) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" align="center">
                <Link
                  href={row.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5f9cbf]"
                >
                  {row.name}
                </Link>
              </TableCell>
              <TableCell align="center">
                {new Date(row.lastAccessed).toLocaleString()}
              </TableCell>
              <TableCell align="center">
                <ConfirmationModal
                  open={open}
                  title="Delete"
                  onConfirm={() => deleteApp(row.appId)}
                >
                  Are you sure you want to delete token accesses to {row.name}?
                </ConfirmationModal>
              </TableCell>
            </TableRow>
          ))}
          {websiteList.length === 0 && (
            <TableRow>
              <TableCell align="center" colSpan={3}>
                You have not granted any token access to any website yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal open={open} setOpen={setOpen} />
    </TableContainer>
  );
}
