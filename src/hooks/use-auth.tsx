import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useUser } from "@clerk/tanstack-react-start";
import { getMyProfile } from "@/lib/auth.functions";

export type AppRole = "admin" | "user";

export interface AuthState {
  loading: boolean;
  session: any | null; // Placeholder to avoid breaking other types temporarily
  user: { id: string; email?: string } | null;
  role: AppRole | null;
  profile: {
    full_name: string;
    position: string;
    avatar_url: string | null;
    badge?: string | null;
    notify_tasks?: boolean;
    notify_messages?: boolean;
    presence_hidden?: boolean;
  } | null;
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
  const { isLoaded, user } = useUser();
  const [state, setState] = useState<AuthState>(initialState || cachedAuthState);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!isLoaded) return;
      if (!user) {
        const nextState = { ...emptyAuthState, loading: false };
        cachedAuthState = nextState;
        if (mounted) setState(nextState);
        return;
      }

      // Immediately set user state from Clerk so UI doesn't wait 2 seconds or freeze
      const immediateProfile = cachedAuthState.profile || {
        full_name: user.fullName || user.primaryEmailAddress?.emailAddress || "User",
        position: "",
        avatar_url: user.imageUrl,
      };

      const immediateState: AuthState = {
        loading: false,
        session: { user: { id: user.id } },
        user: { id: user.id, email: user.primaryEmailAddress?.emailAddress },
        role: cachedAuthState.role || "user",
        profile: immediateProfile,
      };

      cachedAuthState = immediateState;
      if (mounted) setState(immediateState);

      // Fetch role/profile from our DB via server function in background
      try {
        const dbData = await getMyProfile();
        if (!mounted) return;

        const nextState: AuthState = {
          loading: false,
          session: { user: { id: user.id } },
          user: { id: user.id, email: user.primaryEmailAddress?.emailAddress },
          role: (dbData?.role as AppRole) || "user",
          profile: dbData?.profile || immediateProfile,
        };

        cachedAuthState = nextState;
        setState(nextState);
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, [isLoaded, user?.id]);

  return state;
}

export function AuthProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: AuthState;
}) {
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
