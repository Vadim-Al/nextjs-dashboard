"use client"

import {useUser} from "@clerk/nextjs"
import React from "react"

export default function completeOAuth() {
	const {user} = useUser()

	if (!user) {
		return <div>Loading user information</div>
	}
	React.useEffect(() => {
		if (user) {
			const userData = {
				id: user.id,
			}
            console.log(userData)
		}
	}, [user])

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50">
			<div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-sm w-full">
				<p className="mt-4 text-gray-700">
					{`Your user_id is ${user.id}`}
				</p>
			</div>
		</div>
	)
}
