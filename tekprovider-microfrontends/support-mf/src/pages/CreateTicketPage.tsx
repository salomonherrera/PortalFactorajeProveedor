import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Send, Paperclip } from 'lucide-react'
import { 
  Button, 
  Card, 
  Input,
  useAuth
} from '@tekprovider/shared-components'

interface TicketForm {
  subject: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
}

export const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TicketForm>()

  const onSubmit = async (data: TicketForm) => {
    try {
      const response = await fetch('https://localhost:5000/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        navigate('/support')
      } else {
        throw new Error('Error al crear el ticket')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el ticket de soporte')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/support')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo Ticket de Soporte</h1>
          <p className="text-gray-600">Describe tu problema y nuestro equipo te ayudará</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Asunto *"
                {...register('subject', { required: 'El asunto es requerido' })}
                error={errors.subject?.message}
                placeholder="Describe brevemente tu problema"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad *
                </label>
                <select
                  {...register('priority', { required: 'La prioridad es requerida' })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Seleccionar prioridad</option>
                  <option value="Low">Baja</option>
                  <option value="Medium">Media</option>
                  <option value="High">Alta</option>
                </select>
                {errors.priority && (
                  <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  {...register('description', { required: 'La descripción es requerida' })}
                  rows={8}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe detalladamente tu problema, incluyendo pasos para reproducirlo si aplica..."
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjuntar archivo (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Arrastra un archivo aquí o{' '}
                    <button type="button" className="text-blue-600 hover:text-blue-500">
                      selecciona uno
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, JPG, PNG hasta 10MB
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/support')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  Enviar Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Help Sidebar */}
        <div>
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Consejos para un mejor soporte</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  📝 Sé específico
                </h4>
                <p className="text-sm text-gray-600">
                  Describe exactamente qué estaba haciendo cuando ocurrió el problema.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  🔍 Incluye detalles
                </h4>
                <p className="text-sm text-gray-600">
                  Menciona mensajes de error, números de factura, fechas relevantes.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  📎 Adjunta evidencia
                </h4>
                <p className="text-sm text-gray-600">
                  Screenshots o documentos que ayuden a entender el problema.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  ⚡ Selecciona la prioridad correcta
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li><strong>Alta:</strong> Sistema no funciona</li>
                  <li><strong>Media:</strong> Funcionalidad limitada</li>
                  <li><strong>Baja:</strong> Consultas generales</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="mt-4">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Contacto Directo</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">📞 Teléfono</p>
                <p className="text-sm text-gray-600">+52 55 1234 5678</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">📧 Email</p>
                <p className="text-sm text-gray-600">soporte@tekprovider.com</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">🕒 Horario</p>
                <p className="text-sm text-gray-600">Lun - Vie: 9:00 - 18:00</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}