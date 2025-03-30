"use client"

import { Button } from "@/components/ui/button"
import { getRandomCountries } from "@/lib/random-country"
import { useEffect, useState } from "react"

export default function Page() {
	const [countries, setCountries] =
		useState<ReturnType<typeof getRandomCountries>>()

	const loadNewCountries = () => {
		setCountries(getRandomCountries(/* pass your countries object here */))
	}

	useEffect(() => {
		setCountries(getRandomCountries())
	}, [])

	return (
		<div>
			{JSON.stringify(countries)}
			<div>Hellos</div>
			<Button onClick={loadNewCountries}>New</Button>
		</div>
	)
}
