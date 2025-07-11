"use client"

import { UploadButton } from "@/utils/uploadthing"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Badge, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileText, Video, Music, FileSpreadsheet, File, Download, Eye, Trash2, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@repo/ui/components/shadcn/alert"

export default function UploaderPage() {
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [audioUrls, setAudioUrls] = useState<string[]>([])
  const [excelUrl, setExcelUrl] = useState<string | null>(null)
  const [anyFileUrl, setAnyFileUrl] = useState<string | null>(null)

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeAudio = (index: number) => {
    setAudioUrls((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Centro de Carga de Archivos</h1>
          <p className="text-slate-600 text-lg">Sube y gestiona tus archivos de forma segura y organizada</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Uploader de Imágenes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Imágenes</CardTitle>
                  <CardDescription>Hasta 5 imágenes, máx. 8MB cada una</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => setImageUrls(res?.map((file) => file.url) || [])}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <Badge variant="secondary" className="mb-2">
                    {imageUrls.length} imagen{imageUrls.length !== 1 ? "es" : ""} subida
                    {imageUrls.length !== 1 ? "s" : ""}
                  </Badge>
                  <div className="grid grid-cols-2 gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(url, "_blank")}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploader de PDF */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Documentos PDF</CardTitle>
                  <CardDescription>Un archivo PDF, máx. 64MB</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="pdfUploader"
                onClientUploadComplete={(res) => setPdfUrl(res?.[0]?.url || null)}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {pdfUrl && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>PDF subido correctamente</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => window.open(pdfUrl, "_blank")}>
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setPdfUrl(null)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Uploader de Video */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Videos</CardTitle>
                  <CardDescription>Un video, máx. 256MB</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="videoUploader"
                onClientUploadComplete={(res) => setVideoUrl(res?.[0]?.url || null)}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {videoUrl && (
                <div className="space-y-2">
                  <Badge variant="secondary">Video subido</Badge>
                  <video src={videoUrl} controls className="w-full rounded-lg border" style={{ maxHeight: "200px" }} />
                  <Button size="sm" variant="outline" onClick={() => setVideoUrl(null)} className="w-full">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Eliminar video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploader de Audio */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Music className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Audio</CardTitle>
                  <CardDescription>Hasta 3 archivos, máx. 128MB cada uno</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="audioUploader"
                onClientUploadComplete={(res) => setAudioUrls(res?.map((file) => file.url) || [])}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {audioUrls.length > 0 && (
                <div className="space-y-2">
                  <Badge variant="secondary">
                    {audioUrls.length} archivo{audioUrls.length !== 1 ? "s" : ""} de audio
                  </Badge>
                  {audioUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                      <Music className="h-4 w-4 text-green-600" />
                      <audio src={url} controls className="flex-1" />
                      <Button size="sm" variant="outline" onClick={() => removeAudio(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Uploader de Excel/CSV */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Hojas de Cálculo</CardTitle>
                  <CardDescription>Excel (.xlsx, .xls) o CSV, máx. 16MB</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="excelUploader"
                onClientUploadComplete={(res) => setExcelUrl(res?.[0]?.url || null)}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {excelUrl && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Hoja de cálculo subida</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => window.open(excelUrl, "_blank")}>
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setExcelUrl(null)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Uploader de Cualquier Archivo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <File className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Cualquier Archivo</CardTitle>
                  <CardDescription>Cualquier tipo de archivo, máx. 512MB</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <UploadButton
                endpoint="anyFileUploader"
                onClientUploadComplete={(res) => setAnyFileUrl(res?.[0]?.url || null)}
                onUploadError={(error: Error) => alert(`ERROR! ${error.message}`)}
                appearance={{
                  button:
                    "bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  allowedContent: "text-xs text-slate-500",
                }}
              />

              {anyFileUrl && (
                <Alert>
                  <File className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Archivo subido correctamente</span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => window.open(anyFileUrl, "_blank")}>
                        <Download className="h-3 w-3 mr-1" />
                        Descargar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAnyFileUrl(null)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumen de archivos subidos */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Resumen de Archivos Subidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{imageUrls.length}</div>
                <div className="text-sm text-slate-600">Imágenes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{pdfUrl ? 1 : 0}</div>
                <div className="text-sm text-slate-600">PDF</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{videoUrl ? 1 : 0}</div>
                <div className="text-sm text-slate-600">Video</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{audioUrls.length}</div>
                <div className="text-sm text-slate-600">Audio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">{excelUrl ? 1 : 0}</div>
                <div className="text-sm text-slate-600">Excel/CSV</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-600">{anyFileUrl ? 1 : 0}</div>
                <div className="text-sm text-slate-600">Otros</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
