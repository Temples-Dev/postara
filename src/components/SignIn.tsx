import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { signIn } from "../lib/auth-client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toaster";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  return (
    <Card className="max-w-md w-full border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center gap-2">
            <img src="/images/postara-logo.png" alt="Postara Logo" className="h-10 w-10" />
            <span className="font-serif font-bold text-2xl text-slate-900">Postara</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-slate-900">Welcome back</CardTitle>
        <CardDescription className="text-center text-slate-600">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Social Sign In - At the top */}
          <Button
            variant="outline"
            className="w-full gap-2 border-slate-200 hover:bg-amber-50 hover:border-amber-300 transition-colors"
            disabled={loading}
            onClick={async () => {
              await signIn.social(
                {
                  provider: "google",
                  callbackURL: "/dashboard"
                },
                {
                  onRequest: (ctx) => {
                    setLoading(true);
                  },
                  onResponse: (ctx) => {
                    setLoading(false);
                  },
                },
              );
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
              <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
              <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
              <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
              <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link
                  to="#"
                  className="text-sm text-amber-600 hover:text-amber-700 underline"
                >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              onClick={() => {
                setRememberMe(!rememberMe);
              }}
              className="border-slate-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
            <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
              Remember me 
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            disabled={loading || !email || !password}
            onClick={async () => {
              if (!email || !password) {
                toast.error("Please enter your email and password");
                return;
              }

              await signIn.email(
                {
                  email,
                  password,
                  callbackURL: "/dashboard"
                },
                {
                  onRequest: () => {
                    setLoading(true);
                  },
                  onResponse: () => {
                    setLoading(false);
                  },
                  onSuccess: () => {
                    toast.success("Welcome back!");
                    navigate("/dashboard");
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message || "Invalid email or password");
                  },
                },
              );
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Sign in with Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
        <div className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-semibold underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}