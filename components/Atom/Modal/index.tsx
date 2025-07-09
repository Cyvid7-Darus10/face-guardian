import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #ddf3ff',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
}) {
  const handleClose = () => setOpen(false);
  const handleDelete = () => {
    toast('Deleted successfully', {
      type: 'success',
      autoClose: 2000,
    });
    setOpen(false);
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmation
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are sure you want to delete?
          </Typography>
          <div className="flex flex-row gap-2 text-white text-center mt-10">
            <button
              onClick={handleClose}
              className="bg-[#5f9cbf] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md text-white"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#da2f29] hover:bg-[#ddf3ff] hover:text-[#5f9cbf] w-full lg:w-1/2 m-auto p-2 rounded-md text-white"
            >
              Yes
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
