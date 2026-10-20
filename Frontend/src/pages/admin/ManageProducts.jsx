import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import ProductForm from '../../components/admin/ProductForm.jsx'
import ProductList from '../../components/admin/ProductList.jsx'
import { getProducts, getCategories } from '../../services/api.js'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null = add mode
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const showToast = (message, severity = 'success') =>
    setToast({ open: true, message, severity })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      setProducts(res.data.data || [])
    } catch {
      showToast('Failed to load products', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Form ke dropdown + list ke naam ke liye categories bhi chahiye
  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data.data || [])
    } catch {
      showToast('Failed to load categories', 'error')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaved = (msg) => {
    setEditing(null)
    fetchProducts()
    showToast(msg)
  }

  const handleDeleted = (msg, severity = 'success') => {
    fetchProducts()
    showToast(msg, severity)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand">
          Manage Products
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Create, edit and delete your store products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form — left (4 cols) */}
        <div className="lg:col-span-4">
          <ProductForm
            editing={editing}
            categories={categories}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </div>

        {/* List — right (8 cols) */}
        <div className="lg:col-span-8">
          <ProductList
            products={products}
            categories={categories}
            loading={loading}
            onEdit={(product) => {
              setEditing(product)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onDeleted={handleDeleted}
          />
        </div>
      </div>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
