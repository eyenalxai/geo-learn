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

	const {
		data: countries,
		isPending,
		isError
	} = useQuery({
		queryKey: ["countries"],
		queryFn: getRandomCountries
	})

	useEffect(() => {
		if (selectedCode) {
			const timer = setTimeout(() => {
				setSelectedCode(null)
				queryClient.invalidateQueries({ queryKey: ["countries"] })
			}, 750)

			return () => clearTimeout(timer)
		}
	}, [selectedCode, queryClient])

	if (isPending || isError) return null

	const correctCountry = countries.find(
		(country) => country.isCorrect
	) as ReturnType<typeof getRandomCountries>[0]

	return (
		<div className={cn("flex", "flex-col", "items-center", "space-y-4")}>
			<div
				className={cn(
					"z-20",
					"relative",
					"h-48",
					"w-48",
					"flex",
					"justify-center"
				)}
			>
				<Image
					className={cn("object-contain")}
					src={`/flags/${correctCountry.code.toLowerCase()}.webp`}
					alt={"flag"}
					width={192}
					height={192}
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
