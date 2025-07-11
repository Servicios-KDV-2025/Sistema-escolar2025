"use client"

export const UploadButton = ({
  onClientUploadComplete,
  onUploadError,
  appearance,
}: {
  endpoint: string
  onClientUploadComplete?: (res: any) => void
  onUploadError?: (error: Error) => void
  appearance?: {
    button?: string
    allowedContent?: string
  }
}) => {
  const buttonClasses = appearance?.button || "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  const allowedContentClasses = appearance?.allowedContent || "text-xs text-gray-500"

  const handleUpload = async (e: any) => {
    const files = Array.from(e.target.files)

    try {
      // Simulate upload and response
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          const urls = files.map((file) => URL.createObjectURL(file))
          resolve(urls.map((url) => ({ url: url })))
        }, 500) // Simulate network delay
      })

      onClientUploadComplete?.(res)
    } catch (error: any) {
      onUploadError?.(new Error("Upload failed."))
    }
  }

  return (
    <div>
      <label className={buttonClasses}>
        Subir archivo
        <input type="file" multiple style={{ display: "none" }} onChange={handleUpload} />
      </label>
      <p className={allowedContentClasses}>Tipos de archivo permitidos.</p>
    </div>
  )
}
