import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "user";

export interface AuthState {
  loading: boolean;
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  profile: { full_name: string; position: string; avatar_url: string | null; badge?: string | null; notify_tasks?: boolean; notify_messages?: boolean; presence_hidden?: boolean } | null;
}

const AuthContext = createContext<AuthState | null>(null);
const emptyAuthState: AuthState = {
  loading: true,
  session: null,
  user: null,
  role: null,
  profile: null,
};

let cachedAuthState: AuthState = emptyAuthState;

function useAuthState(initialState?: AuthState): AuthState {
  const [state, setState] = useState<AuthState>(() => {
    if (initialState && (cachedAuthState.loading || cachedAuthState.user?.id !== initialState.user?.id)) {
      cachedAuthState = initialState;
    }
    return cachedAuthState;
  });

  useEffect(() => {
    let mounted = true;

    if (initialState && (cachedAuthState.loading || cachedAuthState.user?.id !== initialState.user?.id)) {
      cachedAuthState = initialState;
      setState(initialState);
    }

    function commit(nextState: AuthState) {
      cachedAuthState = nextState;
      if (mounted) setState(nextState);
    }

    async function hydrate(session: Session | null) {
      if (!session?.user) {
        commit({ ...emptyAuthState, loading: false });
        return;
      }

      if (
        cachedAuthState.session?.access_token === session.access_token &&
        cachedAuthState.user?.id === session.user.id &&
        cachedAuthState.role &&
        !cachedAuthState.loading
      ) {
        commit(cachedAuthState);
        return;
      }

      const [{ data: roleRow }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("profiles").select("full_name, position, avatar_url, badge, notify_tasks, notify_messages, presence_hidden").eq("id", session.user.id).maybeSingle(),
      ]);
      if (!mounted) return;
      commit({
        loading: false,
        session,
        user: session.user,
        role: (roleRow?.role as AppRole | undefined) ?? "user",
        profile: profile ?? { full_name: "", position: "", avatar_url: null },
      });
    }

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // Defer hydration to avoid deadlock inside the listener
      setTimeout(() => hydrate(session), 0);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [initialState?.user?.id]);

  return state;
}

export function AuthProvider({ children, initialState }: { children: ReactNode; initialState?: AuthState }) {
  const state = useAuthState(initialState);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const state = useContext(AuthContext);
  if (!state) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return state;
}
