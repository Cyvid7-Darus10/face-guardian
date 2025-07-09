-- =============================================================================
-- FACE GUARDIAN DATABASE SCHEMA
-- =============================================================================
-- Run this in your Supabase SQL editor to create all required tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================
-- Extends Supabase auth.users with additional profile information

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    authenticated BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profiles
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_authenticated ON public.profiles(authenticated);

-- =============================================================================
-- FACE DESCRIPTORS TABLE
-- =============================================================================
-- Stores facial recognition descriptors for each user

CREATE TABLE public.face_descriptors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    descriptors FLOAT8[] NOT NULL, -- Array of facial descriptors
    quality_score FLOAT4 DEFAULT NULL, -- Optional quality metric (0-1)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for face_descriptors
CREATE INDEX idx_face_descriptors_profile_id ON public.face_descriptors(profile_id);
CREATE INDEX idx_face_descriptors_quality ON public.face_descriptors(quality_score);

-- =============================================================================
-- PROFILE DEVICES TABLE
-- =============================================================================
-- Tracks trusted devices for each user

CREATE TABLE public.profile_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL, -- FingerprintJS device ID
    user_agent TEXT NOT NULL,
    device_name TEXT DEFAULT NULL,
    last_used_at TIMESTAMPTZ DEFAULT NOW(),
    is_trusted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for profile_devices
CREATE INDEX idx_profile_devices_profile_id ON public.profile_devices(profile_id);
CREATE INDEX idx_profile_devices_device_id ON public.profile_devices(device_id);
CREATE UNIQUE INDEX idx_profile_devices_unique ON public.profile_devices(profile_id, device_id);

-- =============================================================================
-- OAUTH APPS TABLE
-- =============================================================================
-- OAuth client applications that can integrate with Face Guardian

CREATE TABLE public.apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT NULL,
    domain TEXT NOT NULL, -- Allowed domain for OAuth
    redirect_to TEXT NOT NULL, -- OAuth redirect URL
    client_id TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    client_secret TEXT NOT NULL DEFAULT encode(gen_random_bytes(64), 'hex'),
    is_active BOOLEAN DEFAULT TRUE,
    scopes TEXT[] DEFAULT ARRAY['read:profile'], -- OAuth scopes
    logo_url TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for apps
CREATE INDEX idx_apps_owner_id ON public.apps(owner_id);
CREATE INDEX idx_apps_client_id ON public.apps(client_id);
CREATE INDEX idx_apps_domain ON public.apps(domain);
CREATE INDEX idx_apps_active ON public.apps(is_active);

-- =============================================================================
-- OAUTH TOKENS TABLE
-- =============================================================================
-- OAuth authorization codes and access tokens

CREATE TABLE public.tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    app_id UUID NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE, -- Authorization code
    token TEXT NOT NULL UNIQUE, -- Access token
    refresh_token TEXT DEFAULT NULL,
    redirect_at TEXT NOT NULL, -- Where to redirect after auth
    scopes TEXT[] DEFAULT ARRAY['read:profile'],
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour'), -- Token expiration
    expiration_date TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes'), -- Auth code expiration
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ DEFAULT NULL
);

-- Indexes for tokens
CREATE INDEX idx_tokens_profile_id ON public.tokens(profile_id);
CREATE INDEX idx_tokens_app_id ON public.tokens(app_id);
CREATE INDEX idx_tokens_code ON public.tokens(code);
CREATE INDEX idx_tokens_token ON public.tokens(token);
CREATE INDEX idx_tokens_expires_at ON public.tokens(expires_at);
CREATE INDEX idx_tokens_revoked ON public.tokens(is_revoked);

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_face_descriptors_updated_at 
    BEFORE UPDATE ON public.face_descriptors 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_apps_updated_at 
    BEFORE UPDATE ON public.apps 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_descriptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Face descriptors policies
CREATE POLICY "Users can view own face descriptors" 
    ON public.face_descriptors FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own face descriptors" 
    ON public.face_descriptors FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own face descriptors" 
    ON public.face_descriptors FOR UPDATE 
    USING (auth.uid() = profile_id);

-- Profile devices policies
CREATE POLICY "Users can view own devices" 
    ON public.profile_devices FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own devices" 
    ON public.profile_devices FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own devices" 
    ON public.profile_devices FOR UPDATE 
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own devices" 
    ON public.profile_devices FOR DELETE 
    USING (auth.uid() = profile_id);

-- Apps policies
CREATE POLICY "Users can view own apps" 
    ON public.apps FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own apps" 
    ON public.apps FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own apps" 
    ON public.apps FOR UPDATE 
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own apps" 
    ON public.apps FOR DELETE 
    USING (auth.uid() = owner_id);

-- Tokens policies
CREATE POLICY "Users can view own tokens" 
    ON public.tokens FOR SELECT 
    USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own tokens" 
    ON public.tokens FOR INSERT 
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own tokens" 
    ON public.tokens FOR UPDATE 
    USING (auth.uid() = profile_id);

-- =============================================================================
-- FUNCTIONS FOR PROFILE MANAGEMENT
-- =============================================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, authenticated)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email_confirmed_at IS NOT NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update profile authentication status
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE public.profiles 
        SET authenticated = TRUE, updated_at = NOW()
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update authentication status
CREATE TRIGGER on_auth_user_email_confirmed
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_user_email_confirmation();

-- =============================================================================
-- UTILITY FUNCTIONS
-- =============================================================================

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.tokens 
    WHERE expires_at < NOW() 
    OR expiration_date < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to revoke all tokens for a user
CREATE OR REPLACE FUNCTION public.revoke_user_tokens(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE public.tokens 
    SET is_revoked = TRUE, used_at = NOW()
    WHERE profile_id = user_id AND is_revoked = FALSE;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================================================

-- Uncomment the following to insert sample OAuth scopes
/*
INSERT INTO public.oauth_scopes (name, description) VALUES 
    ('read:profile', 'Read user profile information'),
    ('read:email', 'Read user email address'),
    ('write:profile', 'Update user profile information');
*/

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_tokens_profile_app ON public.tokens(profile_id, app_id);
CREATE INDEX idx_tokens_active ON public.tokens(profile_id) WHERE is_revoked = FALSE;
CREATE INDEX idx_face_descriptors_recent ON public.face_descriptors(profile_id, created_at DESC);

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.face_descriptors IS 'Facial recognition descriptors for biometric authentication';
COMMENT ON TABLE public.profile_devices IS 'Trusted devices for each user profile';
COMMENT ON TABLE public.apps IS 'OAuth client applications';
COMMENT ON TABLE public.tokens IS 'OAuth authorization codes and access tokens';

COMMENT ON COLUMN public.face_descriptors.descriptors IS 'Face-api.js descriptor array for facial recognition';
COMMENT ON COLUMN public.face_descriptors.quality_score IS 'Quality score (0-1) for the face capture';
COMMENT ON COLUMN public.profile_devices.device_id IS 'FingerprintJS device identifier';
COMMENT ON COLUMN public.apps.client_secret IS 'OAuth client secret (should be hashed in production)';
COMMENT ON COLUMN public.tokens.code IS 'OAuth authorization code (short-lived)';
COMMENT ON COLUMN public.tokens.token IS 'OAuth access token (longer-lived)';

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

-- Summary of created objects:
-- ✅ 5 Tables with proper relationships
-- ✅ Indexes for performance
-- ✅ Row Level Security policies
-- ✅ Triggers for automatic timestamps
-- ✅ Functions for user management
-- ✅ Cleanup utilities

SELECT 'Face Guardian database schema created successfully!' as status; 