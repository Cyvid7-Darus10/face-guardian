# Face Guardian

Passwordless authentication for the web. A user signs in by looking at their camera, and third-party apps consume that login through a standard OAuth2 flow.

I built this to see whether face recognition could be made into something a developer could actually drop into an app, rather than a demo that only works on the author's laptop. The face matching runs in the browser with Face-API.js, so raw images never reach the server. Only the numeric descriptors are stored, encrypted.

Built with Next.js 14, TypeScript, and Supabase.

## How it works

A user registers once by capturing their face. After that, any app that integrates Face Guardian can redirect to it, get the user authenticated by camera, and receive an OAuth2 token back.

```mermaid
sequenceDiagram
    participant User
    participant ThirdParty as Third-Party App
    participant FaceGuardian as Face Guardian
    participant Camera
    participant Database as Supabase

    User->>ThirdParty: 1. Access protected resource
    ThirdParty->>FaceGuardian: 2. Redirect to OAuth
    FaceGuardian->>User: 3. Show face authentication
    User->>Camera: 4. Capture face
    Camera->>FaceGuardian: 5. Face data
    FaceGuardian->>Database: 6. Verify face descriptors
    Database->>FaceGuardian: 7. Match confirmed
    FaceGuardian->>Database: 8. Create OAuth token
    Database->>FaceGuardian: 9. Token created
    FaceGuardian->>ThirdParty: 10. Redirect with auth code
    ThirdParty->>FaceGuardian: 11. Exchange code for token
    FaceGuardian->>ThirdParty: 12. Access token
    ThirdParty->>User: 13. Access granted
```

If you just want the client side of this, there's a React component published on npm: [face-guardian](https://www.npmjs.com/package/face-guardian). It wraps the whole flow in a `<FaceLogin />` component, and there's a [live demo](https://cyvid7-darus10.github.io/face-guardian-npm/).

## Architecture

```mermaid
graph TB
    subgraph "Third-Party Applications"
        APP1[Web App]
        APP2[Mobile App]
        APP3[Desktop App]
    end

    subgraph "Face Guardian System"
        subgraph "Frontend (Next.js)"
            UI[React Components]
            FACE[Face Recognition]
            DEVICE[Device Fingerprinting]
        end

        subgraph "API Routes"
            AUTH[Authentication API]
            OAUTH[OAuth2 Server]
            TOKEN[Token Management]
        end
    end

    subgraph "Supabase Backend"
        subgraph "Database"
            PROFILES[(Profiles)]
            FACES[(Face Descriptors)]
            DEVICES[(Devices)]
            APPS[(Apps)]
            TOKENS[(Tokens)]
        end

        subgraph "Services"
            RLS[Row Level Security]
            REALTIME[Real-time Updates]
            STORAGE[File Storage]
        end
    end

    subgraph "External Services"
        FINGERPRINT[FingerprintJS]
        FACEAPI[Face-API.js]
    end

    APP1 --> OAUTH
    APP2 --> OAUTH
    APP3 --> OAUTH

    OAUTH --> AUTH
    AUTH --> UI
    UI --> FACE
    FACE --> FACEAPI
    UI --> DEVICE
    DEVICE --> FINGERPRINT

    AUTH --> PROFILES
    AUTH --> FACES
    AUTH --> DEVICES
    TOKEN --> TOKENS
    OAUTH --> APPS

    PROFILES --> RLS
    FACES --> RLS
    DEVICES --> RLS
    APPS --> RLS
    TOKENS --> RLS

    REALTIME --> UI
    STORAGE --> FACE

    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class UI,FACE,DEVICE,AUTH,OAUTH,TOKEN frontend
    class PROFILES,FACES,DEVICES,APPS,TOKENS,RLS,REALTIME,STORAGE backend
    class FINGERPRINT,FACEAPI external
```

## Security

Face recognition as a login method has an obvious failure mode: a photo of someone's face. These are the layers that exist to make that harder, and to limit the damage if the database is ever read by someone who shouldn't have it.

- Raw face images are never stored. Face-API.js produces a numeric descriptor in the browser, and only that descriptor is persisted, encrypted with crypto-js.
- Authentication is checked against a device fingerprint (FingerprintJS) as well as the face, so a matching descriptor alone is not enough from an unrecognized device.
- hCaptcha guards the registration and login forms against automated submission.
- Every table sits behind Supabase Row Level Security, so authorization is enforced in the database rather than only in application code.
- Authentication events are logged, and sessions expire automatically.

## Tech stack

Next.js 14 with the App Router, TypeScript 5, and Tailwind CSS on the frontend. Face-API.js handles browser-based recognition and react-webcam handles capture. Supabase provides Postgres, auth, and real-time. FingerprintJS handles device identification, hCaptcha handles bot protection, and crypto-js handles descriptor encryption.

## Running it locally

You'll need Node.js 18+ and a Supabase project (the free tier is enough).

```bash
git clone https://github.com/Cyvid7-Darus10/face-guardian.git
cd face-guardian
npm install
```

Copy the example environment file and fill in your Supabase credentials:

```bash
cp env.example .env.local
```

Then apply the database schema. The SQL lives in `database/schema.sql`, and you can run it from the Supabase dashboard or with the CLI:

```bash
cat database/schema.sql | supabase db reset
```

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Documentation

| Section | Description |
|---|---|
| [database/README.md](./database/README.md) | Schema, setup, and security policies |
| [docs/env.md](./docs/env.md) | Configuration variables |
| [docs/api.md](./docs/api.md) | Endpoints and examples |
| [docs/frontend.md](./docs/frontend.md) | Components and usage |
| [docs/security.md](./docs/security.md) | Security practices and policies |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development guidelines |

## Contributing

Issues and pull requests are welcome. Fork the repo, work on a branch, and open a PR against `main`. [CONTRIBUTING.md](./CONTRIBUTING.md) has the details.

Bugs and feature requests both go to [GitHub issues](https://github.com/Cyvid7-Darus10/face-guardian/issues).

## License

MIT. See [LICENSE](./LICENSE).

Built by [Cyrus Pastelero](https://github.com/Cyvid7-Darus10).
