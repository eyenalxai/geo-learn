"use client"

import { Button } from "@/components/ui/button"
import { getRandomCountries } from "@/lib/random-country"
import { cn } from "@/lib/utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"

export default function Page() {
	const queryClient = useQueryClient()

	const {
		data: countries,
		isPending,
		isError
	} = useQuery({
		queryKey: ["countries"],
		queryFn: getRandomCountries
	})

	if (isPending || isError) return null

	const correctCountry = countries.find(
		(country) => country.isCorrect
	) as ReturnType<typeof getRandomCountries>[0]

	return (
		<div>
			<div className={cn("relative", "h-24", "w-12")}>
				<Image
					className={cn("object-contain")}
					src={`/flags/${correctCountry.code.toLowerCase()}.webp`}
					alt={"flag"}
					fill
				/>
			</div>
			<Button
				onClick={() =>
					queryClient.invalidateQueries({
						queryKey: ["countries"]
					})
				}
			>
				New
			</Button>
		</div>
	)
}
