import { useState } from 'react'
import { uploadImage } from '../lib/api'

export default function ImageUploadField({ label, value, onChange, bucket, onUploadingChange }) {
  const [preview, setPreview] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setPreview(URL.createObjectURL(file)) // instant local preview
    setUploading(true)
    onUploadingChange?.(true)
    setError('')
    try {
      const url = await uploadImage(file, bucket)
      onChange(url)
    } catch (err) {
      console.error(err)
      setError(
        err?.message?.includes('timed out')
          ? 'Upload timed out. Check that the storage bucket exists and try again.'
          : `Upload failed: ${err?.message || 'unknown error'}`
      )
    } finally {
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  return (
    <div>
      {label && <label className="block text-xs font-bold text-gray-400 mb-1.5">{label}</label>}
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-2xl">🖼</span>
          )}
        </div>
        <label className="flex-1 cursor-pointer">
          <div className="border border-dashed border-gray-300 rounded-2xl py-2.5 px-4 text-xs font-semibold text-gray-500 text-center hover:bg-gray-50 transition-colors">
            {uploading ? 'Uploading...' : 'Choose image to upload'}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-[11px] text-red-500 font-semibold mt-1.5">{error}</p>}
    </div>
  )
}
