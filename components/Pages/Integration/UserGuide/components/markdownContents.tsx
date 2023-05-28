export const installation = `
## Installation:

bash
npm install face-guardian --save-dev


or

bash
yarn add -D face-guardian
`;

export const usage = `
## Usage :

Add \`FaceLogin\` to your component:

\`\`\`js
import React from 'react';
import ReactDOM from 'react-dom';
import { FaceLogin, useUserData } from 'face-guardian';

const App = () => {
  const userData = useUserData();

  return (
    <React.StrictMode>
      <FaceLogin
        appId="your-app-id"
        buttonStyles={{ background: 'red', fontSize: '20px' }}
        buttonText="Custom Button Text"
      />
      {userData && <div>Welcome, {userData.name}!</div>}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
\`\`\`
`;
