import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import { createCategory, updateCategory, IMAGE_BASE } from '../../services/api.js'

// Section ka chota label
function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: 'text.secondary', fontSize: 11, letterSpacing: 1.5, fontWeight: 700 }}
    >
      {children}
    </Typography>
  )
}

export default function CategoryForm({ editing, onSaved, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const reset = () => {
    setName('')
    setDescription('')
    setIsActive(true)
    setImageFile(null)
    setPreview('')
    setError('')
  }

  // Edit mode: purani category ka data form me bhar do
  useEffect(() => {
    if (editing) {
      setName(editing.name || '')
      setDescription(editing.description || '')
      setIsActive(editing.isActive !== false)
      setImageFile(null)
      setPreview(
        editing.image && editing.image !== 'null' ? `${IMAGE_BASE}/${editing.image}` : ''
      )
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setPreview('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Category name is required')
      return
    }
    setError('')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('description', description.trim())
      formData.append('isActive', isActive)
      if (imageFile) formData.append('image', imageFile)

      if (editing) {
        await updateCategory(editing._id, formData)
      } else {
        await createCategory(formData)
      }

      reset()
      onSaved(editing ? 'Category updated successfully ✅' : 'Category created successfully ✅')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="fade-up"
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: 'linear-gradient(135deg, #0b2239 0%, #24507a 100%)',
          color: '#fff',
        }}
      >
        <span className="material-symbols-outlined" style={{ color: '#8ecae6' }}>
          {editing ? 'edit' : 'add_box'}
        </span>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: 'var(--font-display)', color: '#8ecae6', lineHeight: 1.2 }}
          >
            {editing ? 'Edit Category' : 'Add New Category'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,.7)' }}>
            {editing ? 'Update the details below' : 'Create a new product category'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3, display: 'grid', gap: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* Image uploader */}
        <Box>
          <SectionLabel>Category Image</SectionLabel>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Box
              sx={{
                position: 'relative',
                width: 96,
                height: 96,
                borderRadius: 3,
                border: '2px dashed',
                borderColor: preview ? 'transparent' : 'divider',
                bgcolor: 'grey.50',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {preview ? (
                <>
                  <Box
                    component="img"
                    src={preview}
                    alt="preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    size="small"
                    onClick={clearImage}
                    aria-label="Remove image"
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(0,0,0,.5)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'rgba(0,0,0,.7)' },
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      close
                    </span>
                  </IconButton>
                </>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: 32, opacity: 0.35 }}>
                  image
                </span>
              )}
            </Box>

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={<span className="material-symbols-outlined">upload</span>}
              >
                Choose Image
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {imageFile ? imageFile.name : 'JPG / PNG / WEBP — max 5MB'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <TextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          size="small"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              color="success"
            />
          }
          label={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Active
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Inactive categories user panel par nahi dikhte
              </Typography>
            </Box>
          }
        />
      </Box>

      {/* Actions */}
      <Divider />
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          gap: 1.5,
          justifyContent: 'flex-end',
          bgcolor: 'grey.50',
        }}
      >
        {editing && (
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={() => {
              reset()
              onCancel()
            }}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          className="pop"
          startIcon={
            saving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <span className="material-symbols-outlined">save</span>
            )
          }
        >
          {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
        </Button>
      </Box>
    </Box>
  )
}
