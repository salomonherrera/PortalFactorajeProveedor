import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Download
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  useAuth,
  formatCurrency
} from '@tekprovider/shared-components'

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'processing' | 'success' | 'error'
  progress: number
  extractedData?: {
    folio: string
    clientName: string
    amount: number
    issueDate: string
    dueDate: string
    assignor: string
    payer: string
  }
  error?: string
}

export const InvoiceUploadPage: React.FC = () => {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/xml', 'text/xml', 'image/jpeg', 'image/png']
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB
    })

    validFiles.forEach(file => {
      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'uploading',
        progress: 0
      }

      setUploadedFiles(prev => [...prev, uploadedFile])
      simulateUpload(uploadedFile)
    })
  }

  const simulateUpload = async (uploadedFile: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadedFiles(prev => 
        prev.map(f => f.id === uploadedFile.id ? { ...f, progress } : f)
      )
    }

    // Simulate processing
    setUploadedFiles(prev => 
      prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'processing' } : f)
    )

    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate extraction (mock data)
    const mockData = {
      folio: `F${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      clientName: ['Nestlé México', 'Coca Cola', 'Walmart', 'Soriana'][Math.floor(Math.random() * 4)],
      amount: Math.floor(Math.random() * 500000) + 50000,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignor: user?.companyName || 'Empresa Cedente',
      payer: ['Nestlé México', 'Coca Cola', 'Walmart', 'Soriana'][Math.floor(Math.random() * 4)]
    }

    setUploadedFiles(prev => 
      prev.map(f => f.id === uploadedFile.id ? { 
        ...f, 
        status: 'success',
        extractedData: mockData
      } : f)
    )
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id))
  }

  const createInvoicesFromUploads = async () => {
    const successfulUploads = uploadedFiles.filter(f => f.status === 'success' && f.extractedData)
    
    for (const upload of successfulUploads) {
      try {
        await fetch('https://localhost:5000/api/invoices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...upload.extractedData,
            amount: Number(upload.extractedData!.amount)
          })
        })
      } catch (error) {
        console.error('Error creating invoice:', error)
      }
    }

    navigate('/invoices')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const successfulUploads = uploadedFiles.filter(f => f.status === 'success')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/invoices')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cargar Facturas</h1>
          <p className="text-gray-600">
            {user?.userType === 'Provider' 
              ? 'Sube las facturas que emitiste a tus clientes'
              : 'Sube las facturas que recibiste de tus proveedores'
            }
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Subir Archivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Arrastra archivos aquí o haz click para seleccionar
            </h3>
            <p className="text-gray-600 mb-4">
              Formatos soportados: PDF, XML, JPG, PNG (máximo 10MB por archivo)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.xml,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button as="span" icon={<FileText className="w-4 h-4" />}>
                Seleccionar Archivos
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Archivos Subidos ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(upload.status)}
                      <div>
                        <p className="font-medium">{upload.file.name}</p>
                        <p className="text-sm text-gray-600">
                          {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(upload.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {upload.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}

                  {upload.status === 'processing' && (
                    <div className="flex items-center space-x-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent" />
                      <span>Extrayendo datos de la factura...</span>
                    </div>
                  )}

                  {upload.status === 'success' && upload.extractedData && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Datos Extraídos:</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-green-700">Folio:</span>
                          <span className="ml-2 font-medium">{upload.extractedData.folio}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Cliente:</span>
                          <span className="ml-2 font-medium">{upload.extractedData.clientName}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Monto:</span>
                          <span className="ml-2 font-medium">{formatCurrency(upload.extractedData.amount)}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Vencimiento:</span>
                          <span className="ml-2 font-medium">{upload.extractedData.dueDate}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Cedente:</span>
                          <span className="ml-2 font-medium">{upload.extractedData.assignor}</span>
                        </div>
                        <div>
                          <span className="text-green-700">Pagador:</span>
                          <span className="ml-2 font-medium">{upload.extractedData.payer}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {upload.status === 'error' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-700 text-sm">{upload.error || 'Error al procesar el archivo'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary and Actions */}
      {successfulUploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Facturas Procesadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{successfulUploads.length}</p>
                <p className="text-sm text-blue-700">Facturas Procesadas</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    successfulUploads.reduce((sum, f) => sum + (f.extractedData?.amount || 0), 0)
                  )}
                </p>
                <p className="text-sm text-green-700">Monto Total</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {user?.factoringConfig?.factoringType === 'ClientFactoring' ? 'Clientes' : 'Proveedores'}
                </p>
                <p className="text-sm text-purple-700">Tipo de Factoraje</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                icon={<Download className="w-4 h-4" />}
              >
                Descargar Reporte
              </Button>
              <Button
                onClick={createInvoicesFromUploads}
                disabled={successfulUploads.length === 0}
                icon={<CheckCircle className="w-4 h-4" />}
              >
                Crear {successfulUploads.length} Facturas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de Carga</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Formatos Soportados</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-red-500" />
                  <span><strong>PDF:</strong> Facturas en formato PDF</span>
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  <span><strong>XML:</strong> Facturas electrónicas (CFDI)</span>
                </li>
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  <span><strong>Imágenes:</strong> JPG, PNG de facturas escaneadas</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Datos que se Extraen</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Folio de la factura</li>
                <li>• Nombre del cliente/proveedor</li>
                <li>• Monto total</li>
                <li>• Fechas de emisión y vencimiento</li>
                <li>• Información del cedente y pagador</li>
                <li>• RFC y datos fiscales</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}