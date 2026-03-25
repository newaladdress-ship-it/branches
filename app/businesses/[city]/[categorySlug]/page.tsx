import { redirect } from 'next/navigation'

export default async function LegacyCityCategoryPage(props: { params: Promise<{ city: string; categorySlug: string }> }) {
  const { city, categorySlug } = await props.params
  redirect(`/locations/${city}/${categorySlug}`)
}
