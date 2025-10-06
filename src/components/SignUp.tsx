"use client";

import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import Image from "next/image";
import { Loader2, X, UserPlus } from "lucide-react";
import { signUp, signIn } from "../lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<Card className="max-w-md w-full border-0 shadow-xl bg-white/95 backdrop-blur-sm">
			<CardHeader className="space-y-1 pb-4">
				<div className="flex items-center justify-center mb-2">
					<div className="flex items-center gap-2">
						<Image src="/images/postara-logo.png" alt="Postara Logo" width={40} height={40} className="h-10 w-10" />
						<span className="font-serif font-bold text-2xl text-slate-900">Postara</span>
					</div>
				</div>
				<CardTitle className="text-2xl font-bold text-center text-slate-900">Create your account</CardTitle>
				<CardDescription className="text-center text-slate-600">
					Get started with your marketing automation
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					{/* Social Sign Up - At the top */}
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
									onRequest: () => {
										setLoading(true);
									},
									onResponse: () => {
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
							<span className="bg-white px-2 text-slate-500">Or sign up with email</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first-name" className="text-slate-700">First name</Label>
							<Input
								id="first-name"
								placeholder="John"
								required
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
								className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="last-name" className="text-slate-700">Last name</Label>
							<Input
								id="last-name"
								placeholder="Doe"
								required
								onChange={(e) => {
									setLastName(e.target.value);
								}}
								value={lastName}
								className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
							/>
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
						<Label htmlFor="password" className="text-slate-700">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Create a strong password"
							className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password_confirmation" className="text-slate-700">Confirm Password</Label>
						<Input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Re-enter your password"
							className="border-slate-200 focus:border-amber-400 focus:ring-amber-400"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="image" className="text-slate-700">Profile Image (optional)</Label>
						<div className="flex items-end gap-4">
							{imagePreview && (
								<div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-amber-200">
									<Image
										src={imagePreview}
										alt="Profile preview"
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div className="flex items-center gap-2 w-full">
								<Input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full border-slate-200 focus:border-amber-400 focus:ring-amber-400"
								/>
								{imagePreview && (
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="hover:bg-red-50 hover:text-red-600"
										onClick={() => {
											setImage(null);
											setImagePreview(null);
										}}
									>
										<X className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full bg-amber-600 hover:bg-amber-700 text-white"
						disabled={loading || !email || !password}
						onClick={async () => {
							// Validation
							if (!email || !password) {
								toast.error("Please fill in all required fields");
								return;
							}

							if (password !== passwordConfirmation) {
								toast.error("Passwords do not match");
								return;
							}

							if (password.length < 8) {
								toast.error("Password must be at least 8 characters long");
								return;
							}

							setLoading(true);

							try {
								await signUp.email(
									{
										email,
										password,
										name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
										image: image ? await convertImageToBase64(image) : undefined,
									},
									{
										onRequest: () => {
											setLoading(true);
										},
										onResponse: () => {
											setLoading(false);
										},
										onError: (ctx) => {
											toast.error(ctx.error.message || "Failed to create account");
										},
										onSuccess: () => {
											toast.success("Account created successfully!");
											router.push("/dashboard");
										},
									},
								);
							} catch (error) {
								setLoading(false);
								toast.error("An unexpected error occurred");
							}
						}}
					>
						{loading ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<>
								<UserPlus className="mr-2 h-4 w-4" />
								Create Account
							</>
						)}
					</Button>
				</div>
			</CardContent>
			<CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
				<div className="text-center text-sm text-slate-600">
					Already have an account?{" "}
					<Link href="/signin" className="text-amber-600 hover:text-amber-700 font-semibold underline">
						Sign in
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}