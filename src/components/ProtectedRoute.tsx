import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated && !auth.activeNavigator) {
      void auth.signinRedirect();
    }
  }, [
    auth.isLoading,
    auth.isAuthenticated,
    auth.activeNavigator,
    auth.signinRedirect,
  ]);

  if (auth.isLoading || auth.activeNavigator) {
    return <div className="p-6">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <div className="p-6">Redirecting to sign in...</div>;
  }

  return <>{children}</>;
}