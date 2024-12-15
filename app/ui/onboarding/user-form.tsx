"use client"

// import clsx from 'clsx';
import React, {useEffect, useState} from "react"
import {useUser} from "@clerk/nextjs"
import { string } from "zod"

export default function OnboardingForm() {
	const {user} = useUser()
	const [step, setStep] = useState<number>(1)
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		referral: "",
		purpose: "",
        email:""
	})
    useEffect(()=>{
        let newUserData = {email:"",firstName:"",lastName:""}
        if(user?.emailAddresses[0] && user?.emailAddresses[0].emailAddress){
            newUserData.email = user?.emailAddresses[0].emailAddress
        }
        if(user?.firstName){
            newUserData.firstName = user?.firstName
        }
        if(user?.lastName){
            newUserData.lastName = user?.lastName
        }
        setFormData({...formData, ...newUserData})

    },[user])
	const handleNext = () => {
		if (step < 5) setStep(step + 1)
	}

	const handlePrevious = () => {
		if (step > 1) setStep(step - 1)
	}
	const handleFinish = () => {
		if (!user || !user?.id) return
		console.log({...formData, clerk_id: user.id})
		if (step === 4) setStep(5)
	}
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
				{step === 1 && (
					<div>
						<h1 className="text-2xl font-bold text-center mb-4">
							Welcome!
						</h1>
						<p className="text-center mb-6">
							To continue registration, we need to ask you a few
							questions.
						</p>
						<button
							onClick={handleNext}
							className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Start
						</button>
					</div>
				)}

				{step === 2 && (
					<div>
						<h2 className="text-xl font-bold mb-4">
							What's your name?
						</h2>
						<div className="mb-4">
							<label className="block mb-2">First Name</label>
							<input
								type="text"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded p-2"
							/>
						</div>
						<div className="mb-6">
							<label className="block mb-2">Last Name</label>
							<input
								type="text"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								className="w-full border border-gray-300 rounded p-2"
							/>
						</div>
						<div className="mb-6">
							<label className="block mb-2">Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
                                disabled={Boolean(user?.emailAddresses[0] && user?.emailAddresses[0].emailAddress)}
								// className="w-full border border-gray-300 rounded p-2"
                                className={`w-full border rounded p-2 ${Boolean(user?.emailAddresses[0] && user?.emailAddresses[0].emailAddress) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}

							/>
						</div>

						<div className="flex justify-between">
							<button
								onClick={handlePrevious}
								className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
							>
								Back
							</button>
							<button
								onClick={handleNext}
								className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 3 && (
					<div>
						<h2 className="text-xl font-bold mb-4">
							How did you hear about us?
						</h2>
						<div className="mb-6">
							<label className="block mb-2">
								<input
									type="radio"
									name="referral"
									value="Friend"
									checked={formData.referral === "Friend"}
									onChange={handleChange}
									className="mr-2"
								/>
								Friends
							</label>
							<label className="block mb-2">
								<input
									type="radio"
									name="referral"
									value="Social Media"
									checked={
										formData.referral === "Social Media"
									}
									onChange={handleChange}
									className="mr-2"
								/>
								Social Media
							</label>
							<label className="block mb-2">
								<input
									type="radio"
									name="referral"
									value="Advertisement"
									checked={
										formData.referral === "Advertisement"
									}
									onChange={handleChange}
									className="mr-2"
								/>
								Advertisement
							</label>
						</div>
						<div className="flex justify-between">
							<button
								onClick={handlePrevious}
								className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
							>
								Back
							</button>
							<button
								onClick={handleNext}
								className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 4 && (
					<div>
						<h2 className="text-xl font-bold mb-4">
							What do you want to use the app for?
						</h2>
						<textarea
							name="purpose"
							value={formData.purpose}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded p-2 mb-6"
							rows={4}
							placeholder="Your purpose..."
						/>
						<div className="flex justify-between">
							<button
								onClick={handlePrevious}
								className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
							>
								Back
							</button>
							<button
								onClick={handleFinish}
								className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
							>
								Next
							</button>
						</div>
					</div>
				)}

				{step === 5 && (
					<div className="text-center">
						<h2 className="text-xl font-bold mb-4">Thank you!</h2>
						<p className="mb-6">
							We're finalizing your registration process.
						</p>
						<div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
					</div>
				)}
			</div>
		</div>
	)
}
