CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, display_name TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "self insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email,'@',1)))
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
INSERT INTO public.profiles (id, email, display_name) SELECT id, email, split_part(email,'@',1) FROM auth.users ON CONFLICT DO NOTHING;

-- Shared Google connection (one per user, used by every app). Tokens readable only by the server.
CREATE TABLE public.gmail_credentials (
  user_id UUID NOT NULL PRIMARY KEY,
  google_email TEXT, access_token TEXT NOT NULL, refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL, scopes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.gmail_credentials TO service_role;
GRANT SELECT (user_id, google_email, expires_at, updated_at, scopes) ON public.gmail_credentials TO authenticated;
ALTER TABLE public.gmail_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self read status" ON public.gmail_credentials FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE VIEW public.gmail_connection_status WITH (security_invoker = true) AS
  SELECT user_id, google_email, expires_at, updated_at, scopes FROM public.gmail_credentials;
GRANT SELECT ON public.gmail_connection_status TO authenticated;

CREATE TABLE public.google_chat_links (
  space_id TEXT NOT NULL PRIMARY KEY, user_id UUID NOT NULL, display_name TEXT,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.google_chat_links TO authenticated;
GRANT ALL ON public.google_chat_links TO service_role;
ALTER TABLE public.google_chat_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self read links" ON public.google_chat_links FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "self delete links" ON public.google_chat_links FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.chat_link_codes (
  code TEXT NOT NULL PRIMARY KEY, user_id UUID NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 minutes'),
  consumed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.chat_link_codes TO authenticated;
GRANT ALL ON public.chat_link_codes TO service_role;
ALTER TABLE public.chat_link_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self codes" ON public.chat_link_codes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chat_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nouvelle conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self threads" ON public.chat_threads FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, role TEXT NOT NULL, parts JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_thread_idx ON public.chat_messages(thread_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self messages" ON public.chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Nouvelle conversation',
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_conversations TO authenticated;
GRANT ALL ON public.agent_conversations TO service_role;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self agent_conversations" ON public.agent_conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, role text NOT NULL, parts jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_messages TO authenticated;
GRANT ALL ON public.agent_messages TO service_role;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self agent_messages" ON public.agent_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_agent_messages_conv ON public.agent_messages(conversation_id, created_at);

CREATE TABLE public.agent_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
  tool_name text NOT NULL, args jsonb, result jsonb,
  status text NOT NULL DEFAULT 'success', source text NOT NULL DEFAULT 'web',
  task_id uuid, stage text NOT NULL DEFAULT 'execution', attempt integer NOT NULL DEFAULT 1,
  plan jsonb, verification_url text, error_detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_actions_log TO authenticated;
GRANT ALL ON public.agent_actions_log TO service_role;
ALTER TABLE public.agent_actions_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "self agent_actions_log" ON public.agent_actions_log FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX agent_actions_log_user_created_idx ON public.agent_actions_log (user_id, created_at DESC);
CREATE INDEX agent_actions_log_task_idx ON public.agent_actions_log (task_id, created_at ASC) WHERE task_id IS NOT NULL;

CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY,
  timezone TEXT NOT NULL DEFAULT 'Indian/Reunion',
  chat_memory_size INTEGER NOT NULL DEFAULT 20,
  ai_model text NOT NULL DEFAULT 'google/gemini-3-flash-preview',
  email_greeting text NOT NULL DEFAULT 'Bonjour',
  email_signature text NOT NULL DEFAULT '',
  email_tone text NOT NULL DEFAULT 'professionnel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings own" ON public.user_settings FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.google_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), space_id TEXT NOT NULL, user_id UUID NOT NULL,
  role TEXT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX gchat_msg_space_idx ON public.google_chat_messages(space_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.google_chat_messages TO authenticated;
GRANT ALL ON public.google_chat_messages TO service_role;
ALTER TABLE public.google_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gchat msgs own" ON public.google_chat_messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_actions_log, public.agent_messages;