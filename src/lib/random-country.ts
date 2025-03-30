import { countries } from "@/lib/countries"

const cleanCountryName = (name: string) => {
	return name.replace(/\s*\([^)]*\)/g, "").trim()
}
export const getRandomCountries = () => {
	const count = 5

	const countryEntries = Object.entries(countries)

	const shuffled = [...countryEntries].sort(() => 0.5 - Math.random())
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
