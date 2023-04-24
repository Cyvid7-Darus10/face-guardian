export const installation = `# Face Guardian Package
[**Live Demo**](https://cyvid7-darus10.github.io/face-guardian-npm/)

## Installation:

bash
npm install face-guardian --save-dev


or

bash
yarn add -D face-guardian


## Usage :

Add \`FaceLogin\` to your component:

\`\`\`js
import React from 'react';
import ReactDOM from 'react-dom';
import { useFaceRecognition } from 'face-guardian';

const App = () => {
    const { FaceLogin, message, user } = useFaceRecognition();

    return (
    <React.StrictMode>
        <div>
        <h2>Face Guardian</h2>
        <FaceLogin />
        <p>Message: {message}</p>
        </div>
    </React.StrictMode>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
\`\`\`
`;
