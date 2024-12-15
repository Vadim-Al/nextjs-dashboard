"use client"
import {useClerk, useUser} from "@clerk/nextjs"
import React from "react"

export default function Verification() {
	const [verificationStatus, setVerificationStatus] =
		React.useState("loading")

	const {handleEmailLinkVerification} = useClerk()
	const {user} = useUser()

	React.useEffect(() => {
		async function verify() {
			try {
                await handleEmailLinkVerification({})
                setVerificationStatus("verified")

			} catch (err) {
				let status = "failed"
				setVerificationStatus(status)
			}
		}
		verify()
	}, [user])

	if (verificationStatus === "loading") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="flex items-center space-x-2 text-gray-700">
					<svg
						className="animate-spin h-5 w-5 text-blue-500"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8v8H4z"
						></path>
					</svg>
					<span>Loading...</span>
				</div>
			</div>
		)
	}

	if (verificationStatus === "failed") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="p-6 max-w-md bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-md">
					Email link verification failed
				</div>
			</div>
		)
	}

	if (verificationStatus === "expired") {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="p-6 max-w-md bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg shadow-md">
					Email link expired
				</div>
			</div>
		)
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="p-6 max-w-md bg-green-100 border border-green-300 text-green-700 rounded-lg shadow-md">
				Successfully signed up. Return to the original tab to continue.
			</div>
		</div>
	)
}
