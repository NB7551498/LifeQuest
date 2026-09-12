"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl text-center text-slate-400">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  const nextParams = searchParams?.get("next");
  const nextPath = nextParams ? decodeURIComponent(nextParams) : "/app/dashboard";
  const errorParam = searchParams?.get("error");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    const startDemoMode = () => {
      document.cookie = `lifequest_demo=true; path=/; max-age=${60 * 60 * 24 * 30}`;
      if (typeof window !== "undefined") {
        const heroName = data.email ? data.email.split("@")[0] : "Hero";
        localStorage.setItem("lifequest_hero_name", heroName);
      }
      window.location.href = nextPath || "/app/dashboard";
    };

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Fallback to Demo Mode on any auth error so the user can enter the realm immediately
        startDemoMode();
        return;
      }

      router.refresh();
      window.location.href = nextPath || "/app/dashboard";
    } catch {
      startDemoMode();
    }
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Return to Your Quest</h2>
        <p className="text-slate-400 text-sm">Enter your credentials to continue your journey.</p>
      </div>

      {(error || errorParam) && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">
            {error || (errorParam === "auth_callback_error" ? "Authentication failed. Please try again." : "An error occurred.")}
          </p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...form.register("email")}
              type="email"
              placeholder="hero@example.com"
              className={cn(
                "w-full bg-slate-800/50 border rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all",
                form.formState.errors.email ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-700"
              )}
              disabled={isLoading}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-xs text-red-400 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "w-full bg-slate-800/50 border rounded-lg py-3 pl-10 pr-10 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all",
                form.formState.errors.password ? "border-red-500/50 focus:ring-red-500/50" : "border-slate-700"
              )}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-xs text-red-400 mt-1">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-white font-medium shadow-lg hover:shadow-orange-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <div className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entering Realm...</span>
              </>
            ) : (
              <span>Enter the Realm</span>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            document.cookie = "lifequest_demo=true; path=/; max-age=2592000";
            window.location.href = "/app/dashboard";
          }}
          className="w-full py-2.5 px-4 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 font-medium text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          🎮 Explore in Instant Demo Mode
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/signup" className="text-sm text-amber-500 hover:text-amber-400 transition-colors font-medium">
          New hero? Begin your adventure
        </Link>
      </div>
    </div>
  );
}
