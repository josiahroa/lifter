import { createContext, useContext, useEffect, useState } from "react";
import type { UserSession } from "@lifter/auth";
import { auth } from "@/src/lib/auth-client";

export interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const session = await auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();

    const subscription = auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(null);
        return;
      }
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
