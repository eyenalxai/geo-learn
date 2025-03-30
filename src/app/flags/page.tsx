"use client"

import { Button } from "@/components/ui/button"
import { getRandomCountries } from "@/lib/random-country"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Page() {
	const queryClient = useQueryClient()
	const [selectedCode, setSelectedCode] = useState<string | null>(null)
	const [loadingImage, setLoadingImage] = useState(false)
	const [roundHistory, setRoundHistory] = useState<string[][]>([])

	const {
		data: countries,
		isPending,
		isError
	} = useQuery({
		queryKey: ["countries"],
		queryFn: () => getRandomCountries(getLastThreeRoundsCodes())
	})

	// Get all country codes from the last 3 rounds
	const getLastThreeRoundsCodes = () => {
		return roundHistory.slice(-3).flat()
	}

	useEffect(() => {
		if (selectedCode) {
			const timer = setTimeout(() => {
				setLoadingImage(true)
				setSelectedCode(null)
				queryClient.invalidateQueries({ queryKey: ["countries"] })
			}, 750)

			return () => clearTimeout(timer)
		}
	}, [selectedCode, queryClient])

	useEffect(() => {
		if (countries) {
			// Store current round's country codes in history
			const currentRoundCodes = countries.map((country) => country.code)
			setRoundHistory((prev) => [...prev, currentRoundCodes].slice(-3)) // Keep only last 3 rounds
		}
	}, [countries])

	if (isPending || isError) return null

	const correctCountry = countries.find(
		(country) => country.isCorrect
	) as ReturnType<typeof getRandomCountries>[0]

	return (
		<div
			className={cn("flex", "flex-col", "items-center", "space-y-12", "mt-12")}
		>
			<div
				className={cn(
					"z-20",
					"relative",
					["w-[100px]", "sm:w-[200px]"],
					["h-[75px]", "sm:h-[150px]"],
					loadingImage && "grayscale",
					"transition-[filter]"
				)}
			>
				<Image
					className={cn("object-contain")}
					src={`/flags/${correctCountry.code.toLowerCase()}.webp`}
					alt={"flag"}
					fill
					onLoad={() => setLoadingImage(false)}
				/>
			</div>
			<div
				className={cn(
					"z-10",
					"flex",
					"flex-row",
					"flex-wrap",
					"gap-4",
					"justify-center"
				)}
			>
				{countries.map((country) => (
					<Button
						key={country.code}
						variant={"outline"}
						disabled={
							selectedCode !== null &&
							selectedCode !== country.code &&
							!country.isCorrect
						}
						className={cn(
							"cursor-pointer",
							selectedCode === country.code &&
								(country.isCorrect
									? ["border-emerald-500", "dark:border-emerald-500"]
									: ["border-rose-500", "dark:border-rose-500"]),
							selectedCode !== null &&
								country.isCorrect && [
									"border-emerald-500",
									"dark:border-emerald-500"
								]
						)}
						onClick={() => {
							setSelectedCode(country.code)
						}}
					>
						{country.name.replace("(the)", "").trim()}
					</Button>
				))}
			</div>
		</div>
	)
}
