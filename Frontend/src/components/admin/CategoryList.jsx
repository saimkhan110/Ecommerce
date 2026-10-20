import { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { deleteCategory, IMAGE_BASE } from '../../services/api.js'

export default function CategoryList({ categories, loading, onEdit, onDeleted }) {
  const [target, setTarget] = useState(null) // jise delete karna hai
  const [deleting, setDeleting] = useState(false)

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteCategory(target._id)
      setTarget(null)
      onDeleted('Category deleted ✅')
    } catch (err) {
      onDeleted(
        err.response?.data?.message || 'Delete failed',
        'error'
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-black/10 shadow-sm">
      <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-brand">
          All Categories
        </h2>
        <span className="text-sm text-ink/50">{categories.length} total</span>
      </div>

      {loading ? (
        <div className="py-16 grid place-content-center">
          <CircularProgress size={28} />
        </div>
      ) : categories.length === 0 ? (
        <p className="py-16 text-center text-ink/50">
          No categories yet — add your first one 👈
        </p>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#e7f1fa', fontWeight: 600 } }}>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id} hover>
                  <TableCell>
                    {cat.image && cat.image !== 'null' ? (
                      <img
                        src={`${IMAGE_BASE}/${cat.image}`}
                        alt={cat.name}
                        className="w-12 h-12 rounded-lg object-cover border border-black/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cream grid place-content-center">
                        <span className="material-symbols-outlined text-ink/40 text-[20px]">
                          image
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="max-w-[220px]">
                    <span className="line-clamp-2 text-sm text-ink/60">
                      {cat.description || '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={cat.isActive !== false ? 'Active' : 'Inactive'}
                      size="small"
                      color={cat.isActive !== false ? 'success' : 'default'}
                      variant={cat.isActive !== false ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onEdit(cat)}
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setTarget(cat)}
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirm dialog */}
      <Dialog open={!!target} onClose={() => setTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-ink/70">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-ink">"{target?.name}"</span>?
            This cannot be undone.
          </p>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={() => setTarget(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ textTransform: 'none' }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
