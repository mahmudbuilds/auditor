"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AudioLines, Disc3, Lock, Mail, ArrowRight, Radio } from "lucide-react";
import {
  Button,
  Field,
  INPUT,
  ImagePlaceholder,
  Panel,
} from "@/components/ui/kit";
import { useApp } from "@/components/providers/AppProvider";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Welcome back to AUDIOTAP!");
      router.push("/");
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    toast(`Connecting with ${provider}...`);
    setTimeout(() => {
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-[#ded7ca]">
      {/* Login Card Screen (Screen 1 in design) */}
      <Panel
        tone="cream"
        className="w-full max-w-4xl p-6 sm:p-10 shadow-[0_16px_48px_rgba(0,0,0,0.18)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Cassette Player Image Placeholder */}
          <div className="flex flex-col items-center justify-center text-center p-4 rounded-[6px] border border-[#bdb4a3] bg-gradient-to-b from-[#e5decf] to-[#d6cdbd]">
            <div className="w-full aspect-[4/3] flex items-center justify-center">
              <ImagePlaceholder
                slot="login-cassette-deck"
                label="Vintage Analog Cassette Tape Player"
                icon={Radio}
                className="w-full h-full min-h-[220px]"
                tone="cream"
              />
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-black tracking-[0.24em] text-[#1a1916] uppercase">
                AUDIOTAP
              </h2>
              <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-[#6b6455] uppercase">
                Record • Understand • Learn
              </p>
            </div>
          </div>

          {/* Right Column: Welcome Back & Authentication Form */}
          <div className="flex flex-col justify-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1916]">
                Welcome back
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#5f594c]">
                Your ideas, lectures and notes, all in one place.
              </p>
            </div>

            {/* OAuth Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <Button
                variant="light"
                size="md"
                onClick={() => handleOAuth("Google")}
                className="w-full justify-center text-xs sm:text-sm bg-white"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="light"
                size="md"
                onClick={() => handleOAuth("Apple")}
                className="w-full justify-center text-xs sm:text-sm bg-white"
              >
                <svg
                  className="w-4 h-4 mr-1 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.57.66-.99 1.74-.86 2.8.97.08 2.02-.54 2.59-1.27z" />
                </svg>
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#cdc4b3]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#e9e3d7] px-2 text-[#6b6455]">or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <Field label="Email address">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6455]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className={`${INPUT} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Password">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6455]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`${INPUT} pl-9`}
                  />
                </div>
              </Field>

              <Button
                variant="dark"
                size="lg"
                type="submit"
                disabled={loading}
                className="mt-2 w-full text-sm font-semibold"
              >
                {loading ? "Authenticating..." : "Log in"}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-[#5f594c]">
              Don&apos;t have an account?{" "}
              <Link
                href="/onboarding"
                className="font-semibold text-[#1a1916] underline underline-offset-2 hover:text-[#e0963a]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
