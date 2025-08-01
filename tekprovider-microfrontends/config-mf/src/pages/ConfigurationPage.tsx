import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  Settings, 
  Building2, 
  Users, 
  Shield, 
  ShieldOff,
  Save,
  AlertCircle
} from 'lucide-react'
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  useAuth,
  useApi,
  API_ENDPOINTS,
  FactoringConfig
} from '@tekprovider/shared-components'

interface ConfigForm {
  factoringType: 'ClientFactoring' | 'ProviderFactoring'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
  defaultTermDays: number
  defaultAdvancePercentage: number
  defaultRetentionPercentage: number
  defaultInterestRate: number
  defaultCommissionPercentage: number
}

export const ConfigurationPage: React.FC = () => {
  const { user, token } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const { data: config, loading, refetch } = useApi<FactoringConfig>(API_ENDPOINTS.FACTORING_CONFIG)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ConfigForm>({
    defaultValues: {
      factoringType: config?.factoringType || 'ProviderFactoring',
      resourceType: config?.resourceType || 'WithRecourse',
      defaultTermDays: config?.defaultTermDays || 30,
      defaultAdvancePercentage: config?.defaultAdvancePercentage || 80,
      defaultRetentionPercentage: config?.defaultRetentionPercentage || 15,
      defaultInterestRate: config?.defaultInterestRate || 2.5,
      defaultCommissionPercentage: config?.defaultCommissionPercentage || 3.0
    }
  })

  const watchedFactoringType = watch('factoringType')
  const watchedResourceType = watch('resourceType')

  const onSubmit = async (data: ConfigForm) => {
    setIsSubmitting(true)
    setSuccessMessage('')

    try {
      const response = await fetch(`https://localhost:5000${API_ENDPOINTS.FACTORING_CONFIG_UPDATE}`, {
        method: config ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSuccessMessage('Configuración guardada exitosamente')
        refetch()
        // Refresh user data to update header
        window.location.reload()
      } else {
        throw new Error('Error al guardar la configuración')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar la configuración')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600">Configura el tipo de factoraje y parámetros por defecto</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tipo de Usuario y Factoraje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuración Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Información del Usuario */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Información del Usuario</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Tipo de Usuario:</span>
                  <div className="flex items-center mt-1">
                    {user?.userType === 'Provider' ? (
                      <>
                        <Building2 className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="font-medium">Proveedor</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 text-purple-600 mr-1" />
                        <span className="font-medium">Cliente</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700">Empresa:</span>
                  <p className="font-medium mt-1">{user?.companyName}</p>
                </div>
              </div>
            </div>

            {/* Tipo de Factoraje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Factoraje *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    watchedFactoringType === 'ClientFactoring'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('factoringType', { required: 'Selecciona el tipo de factoraje' })}
                    value="ClientFactoring"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium">Factoraje de Clientes</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Factoraje de facturas emitidas a clientes
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    watchedFactoringType === 'ProviderFactoring'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('factoringType')}
                    value="ProviderFactoring"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-medium">Factoraje de Proveedores</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Factoraje de facturas recibidas de proveedores
                    </p>
                  </div>
                </div>
              </div>
              {errors.factoringType && (
                <p className="text-red-500 text-sm mt-1">{errors.factoringType.message}</p>
              )}
            </div>

            {/* Tipo de Recurso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Recurso *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    watchedResourceType === 'WithRecourse'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('resourceType', { required: 'Selecciona el tipo de recurso' })}
                    value="WithRecourse"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <h4 className="font-medium">Con Recurso</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Mayor seguridad para la financiera
                    </p>
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    watchedResourceType === 'WithoutRecourse'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('resourceType')}
                    value="WithoutRecourse"
                    className="sr-only"
                  />
                  <div className="text-center">
                    <ShieldOff className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium">Sin Recurso</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Mayor flexibilidad para el cliente
                    </p>
                  </div>
                </div>
              </div>
              {errors.resourceType && (
                <p className="text-red-500 text-sm mt-1">{errors.resourceType.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parámetros Financieros por Defecto */}
        <Card>
          <CardHeader>
            <CardTitle>Parámetros Financieros por Defecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Plazo por Defecto (días) *"
                type="number"
                {...register('defaultTermDays', { 
                  required: 'El plazo es requerido',
                  min: { value: 1, message: 'El plazo debe ser mayor a 0' }
                })}
                error={errors.defaultTermDays?.message}
              />

              <Input
                label="% Adelanto por Defecto *"
                type="number"
                step="0.1"
                {...register('defaultAdvancePercentage', { 
                  required: 'El % de adelanto es requerido',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                  max: { value: 100, message: 'Debe ser menor o igual a 100' }
                })}
                error={errors.defaultAdvancePercentage?.message}
              />

              <Input
                label="% Retención por Defecto *"
                type="number"
                step="0.1"
                {...register('defaultRetentionPercentage', { 
                  required: 'El % de retención es requerido',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' },
                  max: { value: 100, message: 'Debe ser menor o igual a 100' }
                })}
                error={errors.defaultRetentionPercentage?.message}
              />

              <Input
                label="Tasa de Interés por Defecto (%) *"
                type="number"
                step="0.1"
                {...register('defaultInterestRate', { 
                  required: 'La tasa de interés es requerida',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                })}
                error={errors.defaultInterestRate?.message}
              />

              <Input
                label="% Comisión por Defecto *"
                type="number"
                step="0.1"
                {...register('defaultCommissionPercentage', { 
                  required: 'El % de comisión es requerido',
                  min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                })}
                error={errors.defaultCommissionPercentage?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Explicativa */}
        <Card>
          <CardHeader>
            <CardTitle>Información sobre Configuración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tipos de Factoraje</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Users className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Factoraje de Clientes</p>
                      <p className="text-gray-600">Factoraje de facturas que emites a tus clientes</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Factoraje de Proveedores</p>
                      <p className="text-gray-600">Factoraje de facturas que recibes de proveedores</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Tipos de Recurso</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <Shield className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Con Recurso</p>
                      <p className="text-gray-600">El cedente responde por el pago en caso de incumplimiento</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <ShieldOff className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Sin Recurso</p>
                      <p className="text-gray-600">La financiera asume el riesgo de cobranza</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            loading={isSubmitting}
            icon={<Save className="w-4 h-4" />}
          >
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  )
}