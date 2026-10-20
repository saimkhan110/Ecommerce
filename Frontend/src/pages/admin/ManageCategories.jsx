import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CategoryForm from '../../components/admin/CategoryForm.jsx'
import CategoryList from '../../components/admin/CategoryList.jsx'
import { getCategories } from '../../services/api.js'

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // null = add mode
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const showToast = (message, severity = 'success') =>
    setToast({ open: true, message, severity })

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(res.data.data || [])
    } catch {
      showToast('Failed to load categories', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaved = (msg) => {
    setEditing(null)
    fetchCategories()
    showToast(msg)
  }

  const handleDeleted = (msg, severity = 'success') => {
    fetchCategories()
    showToast(msg, severity)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand">
          Manage Categories
        </h1>
        <p className="text-sm text-ink/60 mt-1">
          Create, edit and delete product categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form — left (4 cols) */}
        <div className="lg:col-span-4">
          <CategoryForm
            editing={editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        </div>

        {/* List — right (8 cols) */}
        <div className="lg:col-span-8">
          <CategoryList
            categories={categories}
            loading={loading}
            onEdit={(cat) => {
              setEditing(cat)
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
