import { useSession } from "next-auth/react"
import { AddPriceForm, AddProductForm, PriceList, ProductList } from "~/components/admin/AdminProductManagement"

export default function AdminPage() {

  const { data: sessionData } = useSession()
  if (!sessionData?.user.isAdmin) {
    return <pre>{JSON.stringify(sessionData, null, 2)}</pre>
  }
  return (
    <div className="my-48 max-w-5xl mx-auto"><h1>Andamio Admin</h1>
      <AddProductForm />
      <AddPriceForm />
      <PriceList />
      <ProductList />
    </div>
  )

}


