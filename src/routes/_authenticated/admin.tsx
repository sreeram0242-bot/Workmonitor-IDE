import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminGate,
});

function AdminGate() {
  const { role } = useAuth();
  if (role && role !== "admin") return <Navigate to="/app" />;
  return <Outlet />;
}
