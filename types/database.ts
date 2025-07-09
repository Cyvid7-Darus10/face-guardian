// =============================================================================
// FACE GUARDIAN DATABASE TYPES
// =============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      face_descriptors: {
        Row: FaceDescriptor;
        Insert: FaceDescriptorInsert;
        Update: FaceDescriptorUpdate;
      };
      profile_devices: {
        Row: ProfileDevice;
        Insert: ProfileDeviceInsert;
        Update: ProfileDeviceUpdate;
      };
      apps: {
        Row: App;
        Insert: AppInsert;
        Update: AppUpdate;
      };
      tokens: {
        Row: Token;
        Insert: TokenInsert;
        Update: TokenUpdate;
      };
    };
  };
}

// =============================================================================
// PROFILE TYPES
// =============================================================================

export interface Profile {
  id: string; // UUID, primary key (linked to auth.users)
  email: string;
  first_name: string;
  last_name: string;
  password: string; // Encrypted password (legacy field)
  authenticated: boolean; // Email verification status
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string; // Must match auth.users.id
  email: string;
  first_name: string;
  last_name: string;
  password?: string; // Encrypted password (legacy field)
  authenticated?: boolean;
}

export interface ProfileUpdate {
  email?: string;
  first_name?: string;
  last_name?: string;
  password?: string; // Encrypted password (legacy field)
  authenticated?: boolean;
  updated_at?: string;
}

// =============================================================================
// FACE DESCRIPTOR TYPES
// =============================================================================

export interface FaceDescriptor {
  id: string; // UUID, primary key
  profile_id: string; // Foreign key to profiles.id
  descriptors: string; // Face recognition descriptors (stored as text/json)
  created_at: string;
  updated_at: string;
}

export interface FaceDescriptorInsert {
  id?: string;
  profile_id: string;
  descriptors: string; // Face recognition descriptors
}

export interface FaceDescriptorUpdate {
  descriptors?: string;
  updated_at?: string;
}

// =============================================================================
// PROFILE DEVICE TYPES
// =============================================================================

export interface ProfileDevice {
  id: string; // UUID, primary key
  profile_id: string; // Foreign key to profiles.id
  device_id: string; // FingerprintJS device ID
  user_agent: string; // Browser user agent
  active: boolean; // Device active status
  created_at: string;
}

export interface ProfileDeviceInsert {
  id?: string;
  profile_id: string;
  device_id: string;
  user_agent: string;
  active?: boolean;
}

export interface ProfileDeviceUpdate {
  active?: boolean;
  user_agent?: string;
}

// =============================================================================
// OAUTH APP TYPES
// =============================================================================

export interface App {
  id: string; // UUID, primary key
  profile_id: string; // Foreign key to profiles.id (owner)
  name: string;
  domain: string; // Allowed domain for OAuth
  redirect_to: string; // OAuth redirect URL
  created_at: string;
  updated_at: string;
}

export interface AppInsert {
  id?: string;
  profile_id: string; // Owner profile ID
  name: string;
  domain: string;
  redirect_to: string;
}

export interface AppUpdate {
  name?: string;
  domain?: string;
  redirect_to?: string;
  updated_at?: string;
}

// =============================================================================
// OAUTH TOKEN TYPES
// =============================================================================

export interface Token {
  id: string; // UUID, primary key
  profile_id: string; // Foreign key to profiles.id
  app_id: string; // Foreign key to apps.id
  code: string; // Authorization code
  token: string; // Access token
  redirect_at: string; // Redirect URL after auth
  expiration_date: string; // Authorization code expiration
  created_at: string;
}

export interface TokenInsert {
  id?: string;
  profile_id: string;
  app_id: string;
  code: string;
  token: string;
  redirect_at: string;
  expiration_date?: string; // Default 10 minutes for auth code
}

export interface TokenUpdate {
  expiration_date?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type ProfileWithDevices = Profile & {
  profile_devices: ProfileDevice[];
};

export type ProfileWithFaceDescriptors = Profile & {
  face_descriptors: FaceDescriptor[];
};

export type AppWithTokens = App & {
  tokens: Token[];
};

export type TokenWithProfileAndApp = Token & {
  profiles: Profile;
  apps: App;
};

// =============================================================================
// ENUMS
// =============================================================================

export enum OAuthScope {
  READ_PROFILE = 'read:profile',
  READ_EMAIL = 'read:email',
  WRITE_PROFILE = 'write:profile',
}

export enum DeviceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  redirectUrl?: string;
  user?: Profile;
}

export interface FaceMatchResult {
  userId: string;
  confidence: number;
  isMatch: boolean;
}

// =============================================================================
// LEGACY COMPATIBILITY
// =============================================================================

// For backward compatibility with existing code
export type { Profile as ProfileType };
export type { FaceDescriptor as FaceDescriptorType };
export type { ProfileDevice as ProfileDeviceType };
export type { App as AppType };
export type { Token as TokenType };
