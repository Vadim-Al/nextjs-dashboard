"use client"

import {useUser} from "@clerk/nextjs"
import React from "react"

export default function CompleteOAuth() {
	const {user} = useUser()

	React.useEffect(() => {
        async function getUser(){
            if (user) {
                const userData = {
                    id: user.id,
                }
                console.log(userData)
            }    
        }  
        getUser()
	}, [user])

	if (!user) {
		return <div>Loading user information</div>
	}

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
