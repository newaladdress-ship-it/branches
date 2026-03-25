import { redirect } from 'next/navigation'

export default async function LegacyCategoryPage(props: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await props.params
  redirect(`/categories/${categorySlug}`)
}
