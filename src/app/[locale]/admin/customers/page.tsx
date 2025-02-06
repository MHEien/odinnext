import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getCustomers } from '@/lib/db/actions/customers'
import { CustomerList } from '@/components/admin/customers/CustomerList'

export default async function AdminCustomers() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const customers = await getCustomers()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-norse text-4xl mb-2">Customers</h1>
          <p className="text-stone-600">Manage your customer base</p>
        </div>

        <CustomerList customers={customers} />
      </div>
    </div>
  )
} 