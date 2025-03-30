import { countries } from "@/lib/countries"

const cleanCountryName = (name: string) => {
	return name.replace(/\s*\([^)]*\)/g, "").trim()
}

const shuffleArray = <T>(array: T[]): T[] => {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

export const getRandomCountries = () => {
	const count = 5
	const countryEntries = Object.entries(countries)

	const shuffled = shuffleArray(countryEntries)
	const selected = shuffled.slice(0, count)

	const result = selected.map(([code, name]) => ({
		code,
		name,
		isCorrect: false
	}))

	const correctIndex = Math.floor(Math.random() * count)
	result[correctIndex].isCorrect = true

	return result.map((country) => ({
		...country,
		name: cleanCountryName(country.name)
	}))
}
