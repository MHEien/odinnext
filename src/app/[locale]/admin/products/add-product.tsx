"use client"
import { usePathname, useRouter } from "@/i18n/routing"

export function AddProductButton() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <button
        type="button"
        onClick={() => router.push(`${pathname}/new`)}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        Add Product

      </button>
    )
}
