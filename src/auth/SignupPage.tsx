import { useState } from "react";
import { login } from "wasp/client/auth";
import { api } from "wasp/client/api";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

export function Signup() {
  useRedirectIfLoggedIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/auth/email/signup", { email, password });
      await login({ email, password });
      // useRedirectIfLoggedIn handles navigation once useAuth updates
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Signup failed. Try again.";
      setError(msg);
      setIsLoading(false);
    }
  }

  return (
    <AuthPageLayout>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            minLength={8}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <WaspRouterLink
          to={routes.LoginRoute.to}
          className="text-primary underline underline-offset-2"
        >
          Log in
        </WaspRouterLink>
      </p>
    </AuthPageLayout>
  );
}
