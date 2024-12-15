"use client"

import OnboardingForm from "@/app/ui/onboarding/user-form"
import {useUser} from "@clerk/nextjs"
import {useEffect, useState } from "react"

export default function CompleteOAuth() {
	const {user} = useUser()

	if (!user) {
		return <div>Loading user information</div>
	}

	return (
			<OnboardingForm/>
		)
}
