"use client"

import * as React from "react"
import {EmailLinkFactor, OAuthStrategy, SignInFirstFactor} from "@clerk/types"
import {useSignIn, useSignUp} from "@clerk/nextjs"
import { toast } from 'react-hot-toast';

function isEmailLinkFactor(factor: SignInFirstFactor): factor is EmailLinkFactor {
	return (
		factor.strategy === "email_link" &&
		"emailAddressId" in factor
	);
}

export default function OauthSignIn() {
	const {signUp} = useSignUp()
	const [emailAddress, setEmailAddress] = React.useState("")
	const [expired, setExpired] = React.useState(false)
	const [verified, setVerified] = React.useState(false)
	const [isPendingVerify, setIsPendingVerify] = React.useState(false)
	const {signIn, isLoaded, setActive} = useSignIn()

	if (!isLoaded) {
		return null
	}

	if (!signIn || !signUp) return null
	const {startEmailLinkFlow} = signIn.createEmailLinkFlow()

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setIsPendingVerify(true)
		setExpired(false)
		setVerified(false)
		if (!signIn) return
		const si = await signIn.create({identifier: emailAddress})
		toast("An email with the sign-in link has been sent to your email address")
		if(!si || !si.supportedFirstFactors) return
		const factor = si.supportedFirstFactors.find((ff) =>
		ff.strategy === "email_link" &&
		ff.safeIdentifier === emailAddress)
		if (!factor || !isEmailLinkFactor(factor))return 
		const res = await startEmailLinkFlow({
			emailAddressId: factor.emailAddressId,
			redirectUrl: "http://localhost:3000/verification",
		})
		const verification = res.firstFactorVerification
		if (verification.verifiedFromTheSameClient()) {
			setVerified(true)
			return
		} else if (verification.status === "expired") {
			setExpired(true)
		}
		if (res.status === "complete") {
			setActive({session: res.createdSessionId})
			return
		}
	}

	const signInWith = (strategy: OAuthStrategy) => {
		return signIn.authenticateWithRedirect({
			strategy,
			redirectUrl: "/sign-up/sso-callback",
			redirectUrlComplete: "/dashboard",
			continueSignUp:true
		})
	}

	async function handleSignIn(strategy: OAuthStrategy) {
		if (!signIn || !signUp) return null

		const userExistsButNeedsToSignIn =
			signUp.verifications.externalAccount.status === "transferable" &&
			signUp.verifications.externalAccount.error?.code ===
				"external_account_exists"
		if (userExistsButNeedsToSignIn) {
			const res = await signIn.create({transfer: true})
			console.log(res)
			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				})
			}
		}

		const userNeedsToBeCreated = signIn.firstFactorVerification.status === "transferable"
		if (userNeedsToBeCreated) {
			const res = await signUp.create({
				transfer: true,
			})
			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				})
			}
		} else {
			signInWith(strategy)
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
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="space-y-4 w-full max-w-md">
				<form
					onSubmit={submit}
					className="w-full p-6 bg-white shadow-md rounded-lg space-y-4"
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
						Sign in with email link
					</button>
				</form>

				<button
					onClick={() => handleSignIn("oauth_google")}
					className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
				>
					Sign in with Google
				</button>
				<button
					onClick={() => handleSignIn("oauth_apple")}
					className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
				>
					Sign in with Apple
				</button>
				<button
					onClick={() => handleSignIn("oauth_facebook")}
					className="w-full py-3 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-300"
				>
					Sign in with Facebook
				</button>
			</div>
		</div>
	)
}
