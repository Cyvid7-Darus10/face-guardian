import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Email from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { passwordStrength } from 'check-password-strength';
import PasswordBar from './PasswordBar';

const InputFields = ({
  userData,
  setUserData,
  passDetails,
  setPassDetails,
}: {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  setUserData: (arg: any) => void;
  passDetails: { id: number; value: string };
  setPassDetails: (arg: any) => void;
}) => {
  const setPassword = (password: string) => {
    const strength = passwordStrength(password);
    setPassDetails({ id: strength.id, value: strength.value });
    setUserData({ ...userData, password });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center gap-2 justify-center">
        <AccountCircle />
        <TextField
          className="w-full"
          label="First Name"
          variant="standard"
          type="email"
          value={userData.firstName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, firstName: event.target.value })
          }
        />
      </div>
      <div className="flex flex-row items-center gap-2 justify-center">
        <AccountCircle />
        <TextField
          className="w-full"
          label="Last Name"
          variant="standard"
          type="email"
          value={userData.lastName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, lastName: event.target.value })
          }
        />
      </div>
      <div className="flex flex-row items-center gap-2 justify-center">
        <Email />
        <TextField
          className="w-full"
          label="Email"
          variant="standard"
          type="email"
          value={userData.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserData({ ...userData, email: event.target.value })
          }
        />
      </div>
      <div className="flex flex-row items-center gap-2 justify-center">
        <LockIcon />
        <TextField
          className="w-full"
          label="Password"
          variant="standard"
          type="password"
          value={userData.password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value)
          }
        />
      </div>
      {userData.password && (
        <div className="flex flex-row items-center justify-center mx-auto text-sm font-bold gap-2 w-1/2">
          <PasswordBar passDetails={passDetails} />
        </div>
      )}
    </div>
  );
};

export default InputFields;
