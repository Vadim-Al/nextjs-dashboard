"use client"

import {AuthenticateWithRedirectCallback} from "@clerk/nextjs"

export default function SSOCallbackPage() {
	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50">
			<div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-sm w-full">
				<h2 className="text-xl font-semibold text-green-600">
					Success!
				</h2>
				<p className="mt-4 text-gray-700">
					You have successfully signed in. You will be redirected to
					the homepage shortly.
				</p>
				<AuthenticateWithRedirectCallback />
			</div>
		</div>
	)
}
