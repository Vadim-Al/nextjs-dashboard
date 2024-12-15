import "@/app/ui/global.css"
import {inter} from "@/app/ui/fonts"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "react-hot-toast";

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${inter.className} antialiased`}>
				<Toaster position="bottom-center" />
					{children}
				</body>
			</html>
		</ClerkProvider>
	)
