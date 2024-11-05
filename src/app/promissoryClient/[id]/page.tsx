import { Promissory } from "@/components/onlyClient/Promissory"

interface promissoryClientProps {
  params: Promise<{ id: any }>
}

export default async function promissoryClient({ params }: promissoryClientProps) {

  const id = (await params).id

  return (
    <div className="max-w-7xl mx-auto p-2">
      <Promissory id={id} />
    </div>
  )
}