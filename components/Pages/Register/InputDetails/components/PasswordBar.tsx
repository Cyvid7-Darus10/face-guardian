import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const PasswordBar = ({
  passDetails,
}: {
  passDetails: { id: number; value: string };
}) => {
  return (
    <div className="w-full text-center">
      <div className="w-full">
        <LinearProgress
          variant="determinate"
          value={(passDetails.id * 100) / 3}
        />
      </div>
      <Typography variant="body2" color="text.secondary">
        {passDetails.value}
      </Typography>
    </div>
  );
};

export default PasswordBar;
