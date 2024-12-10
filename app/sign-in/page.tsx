"use client"

import * as React from "react"
import {OAuthStrategy} from "@clerk/types"
import {useSignIn, useSignUp} from "@clerk/nextjs"

export default function OauthSignIn() {
	const {signIn} = useSignIn()
	const {signUp, setActive} = useSignUp()

	if (!signIn || !signUp) return null

	const signInWith = (strategy: OAuthStrategy) => {
		return signIn.authenticateWithRedirect({
			strategy,
			redirectUrl: "/sign-up/sso-callback",
			redirectUrlComplete: "/dashboard",
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

			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				})
			}
		}

		const userNeedsToBeCreated =
			signIn.firstFactorVerification.status === "transferable"

		if (userNeedsToBeCreated) {
			const res = await signUp.create({
				transfer: true,
			})
			console.log(res)
			if (res.status === "complete") {
				setActive({
					session: res.createdSessionId,
				})
			}
		} else {
			signInWith(strategy)
		}
	}
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="space-y-4">
				<button
					onClick={() => handleSignIn("oauth_google")}
					className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
				>
					Sign in with Google
				</button>
				<button
					onClick={() => handleSignIn("oauth_apple")}
					className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
				>
					Sign in with Apple
				</button>
				<button
					onClick={() => handleSignIn("oauth_facebook")}
					className="w-full py-2 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-300"
				>
					Sign in with Facebook
				</button>
			</div>
		</div>
	)
}
