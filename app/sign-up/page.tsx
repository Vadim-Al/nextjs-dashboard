"use client"
import {useSignUp} from "@clerk/nextjs"
import React from "react"
import { toast } from 'react-hot-toast';
const redirectUrl: string = process.env.NEXT_PUBLIC_SIGN_UP_EMAIL_LINK_REDIRECTED_URL ?? "http://localhost:3000/sign-up/verification" ;
export default function SignUp() {
	const [emailAddress, setEmailAddress] = React.useState("")
	const [expired, setExpired] = React.useState(false)
	const [verified, setVerified] = React.useState(false)
	const [isPendingVerify, setIsPendingVerify] = React.useState(false)
	const {signUp, isLoaded, setActive} = useSignUp()

	if (!isLoaded) {
		return null
	}

	const {startEmailLinkFlow} = signUp.createEmailLinkFlow()
	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setIsPendingVerify(true)
		setExpired(false)
		setVerified(false)
		if (!isLoaded) {
			return null
		}
		try {
			await signUp.create({emailAddress})

            toast("An email with the sign-in link has been sent to your email address")
			
			const su = await startEmailLinkFlow({
				redirectUrl: redirectUrl,
			})
			const verification = su.verifications.emailAddress

			if (verification.verifiedFromTheSameClient()) {
				setVerified(true)
				return
			} else if (verification.status === "expired") {
				setExpired(true)
			}

			if (su.status === "complete") {
				setActive({
					session: su.createdSessionId,
				})
				return
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
                toast.error(e.message)
			} else {
                toast.error("An unknown error occurred.")
			}
		} finally {
			setIsPendingVerify(false)
		}
	}

	if (expired) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="p-6 max-w-md bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-md">
					Email link has expired
				</div>
			</div>
		)
	}

	if (verified) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="p-6 max-w-md bg-green-100 border border-green-300 text-green-700 rounded-lg shadow-md">
					Signed in on other tab
				</div>
			</div>
		)
	}

	if (isPendingVerify) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="p-6 max-w-md bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg shadow-md">
					Waiting for verification
				</div>
			</div>
		)
	}
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<form
				onSubmit={submit}
				className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
			>
				<input
					type="email"
					value={emailAddress}
					placeholder="Enter your email"
					onChange={(e) => setEmailAddress(e.target.value)}
					className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition"
					type="submit"
				>
					Sign up with email link
				</button>
			</form>
		</div>
	)
}
