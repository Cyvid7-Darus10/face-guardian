import { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import FileCopy from '@mui/icons-material/FileCopy';
import Tooltip from '@mui/material/Tooltip';

const HiddenInput = ({ content }: { content: string }) => {
  const [showContent, setShowContent] = useState(false);
  const handleClickShowContent = () => setShowContent(show => !show);

  const handleMouseDownContent = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <>
      <Input
        className="w-full rounded-lg"
        type={showContent ? 'text' : 'password'}
        value={content}
        disabled
        endAdornment={
          <InputAdornment position="end">
            <div className="flex items-center">
              {showContent && (
                <Tooltip title="Copy to clipboard" arrow>
                  <IconButton
                    aria-label="copy secret key"
                    onClick={handleCopyContent}
                    edge="end"
                  >
                    <FileCopy />
                  </IconButton>
                </Tooltip>
              )}
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowContent}
                onMouseDown={handleMouseDownContent}
                edge="end"
              >
                {showContent ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
          </InputAdornment>
        }
        placeholder="Content"
      />
    </>
  );
};

export default HiddenInput;
