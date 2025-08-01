import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  X, 
  Building, 
  Calculator, 
  TrendingUp, 
  Clock,
  DollarSign,
  Send
} from 'lucide-react'
import { 
  Button, 
  Card, 
  Input,
  formatCurrency,
  FinancialQuote
} from '@tekprovider/shared-components'

interface FinancialQuoteForm {
  financialInstitution: string
  totalAmount: number
  termDays: number
  interestRate: number
  commissionPercentage: number
  notes: string
}

interface FinancialQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  factoringRequestId: number
  totalAmount: number
  onQuoteCreated: (quote: FinancialQuote) => void
}

export const FinancialQuoteModal: React.FC<FinancialQuoteModalProps> = ({
  isOpen,
  onClose,
  factoringRequestId,
  totalAmount,
  onQuoteCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FinancialQuoteForm>({
    defaultValues: {
      totalAmount,
      termDays: 30,
      interestRate: 2.5,
      commissionPercentage: 3.0
    }
  })

  const watchedValues = watch()

  const calculateQuote = () => {
    const { totalAmount, termDays, interestRate, commissionPercentage } = watchedValues
    
    // Cálculo del CAT (Costo Anual Total)
    const monthlyRate = interestRate / 100 / 12
    const periods = termDays / 30
    const cat = ((Math.pow(1 + monthlyRate, 12) - 1) * 100) + commissionPercentage
    
    // Monto neto después de comisiones
    const commissionAmount = totalAmount * (commissionPercentage / 100)
    const netAmount = totalAmount - commissionAmount
    
    return {
      cat: Number(cat.toFixed(2)),
      commissionAmount,
      netAmount
    }
  }

  const calculatedValues = calculateQuote()

  const onSubmit = async (data: FinancialQuoteForm) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call to create financial quote
      const quote: FinancialQuote = {
        id: Math.floor(Math.random() * 1000),
        factoringRequestId,
        financialInstitution: data.financialInstitution,
        quotationNumber: `COT-${Date.now().toString().slice(-6)}`,
        totalAmount: data.totalAmount,
        termDays: data.termDays,
        interestRate: data.interestRate,
        commissionPercentage: data.commissionPercentage,
        cat: calculatedValues.cat,
        netAmount: calculatedValues.netAmount,
        status: 'Pending',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        notes: data.notes,
        createdAt: new Date().toISOString()
      }

      onQuoteCreated(quote)
      onClose()
    } catch (error) {
      console.error('Error creating financial quote:', error)
      alert('Error al crear la cotización')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-500" />
              Cotización con Financiera
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-6 py-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información de la Solicitud */}
                <Card>
                  <div className="p-4 border-b">
                    <h4 className="font-medium flex items-center">
                      <Calculator className="w-4 h-4 mr-2" />
                      Información de la Solicitud
                    </h4>
                  </div>
                  <div className="p-4 space-y-4">
                    <Input
                      label="Institución Financiera *"
                      {...register('financialInstitution', { required: 'La institución es requerida' })}
                      error={errors.financialInstitution?.message}
                      placeholder="Ej: BBVA, Santander, Banorte"
                    />

                    <Input
                      label="Monto Total *"
                      type="number"
                      step="0.01"
                      {...register('totalAmount', { required: 'El monto es requerido' })}
                      error={errors.totalAmount?.message}
                      readOnly
                    />

                    <Input
                      label="Plazo (días) *"
                      type="number"
                      {...register('termDays', { 
                        required: 'El plazo es requerido',
                        min: { value: 1, message: 'Debe ser mayor a 0' }
                      })}
                      error={errors.termDays?.message}
                    />

                    <Input
                      label="Tasa de Interés Anual (%) *"
                      type="number"
                      step="0.1"
                      {...register('interestRate', { 
                        required: 'La tasa es requerida',
                        min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                      })}
                      error={errors.interestRate?.message}
                    />

                    <Input
                      label="% Comisión *"
                      type="number"
                      step="0.1"
                      {...register('commissionPercentage', { 
                        required: 'La comisión es requerida',
                        min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                      })}
                      error={errors.commissionPercentage?.message}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notas Adicionales
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Condiciones especiales, observaciones..."
                      />
                    </div>
                  </div>
                </Card>

                {/* Cálculos y Resultados */}
                <Card>
                  <div className="p-4 border-b">
                    <h4 className="font-medium flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Cálculos Financieros
                    </h4>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* CAT */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calculator className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="font-medium text-gray-900">CAT Estimado</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {calculatedValues.cat}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Costo Anual Total (incluye intereses y comisiones)
                      </p>
                    </div>

                    {/* Desglose de Costos */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Monto Solicitado:</span>
                        <span className="font-semibold">{formatCurrency(watchedValues.totalAmount || 0)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Comisión ({watchedValues.commissionPercentage}%):</span>
                        <span className="font-semibold text-red-600">
                          -{formatCurrency(calculatedValues.commissionAmount)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-medium">Monto Neto a Recibir:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(calculatedValues.netAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Información del Plazo */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">Información del Plazo</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Plazo: {watchedValues.termDays} días</p>
                        <p>Tasa mensual: {((watchedValues.interestRate || 0) / 12).toFixed(2)}%</p>
                        <p>Vigencia de cotización: 7 días</p>
                      </div>
                    </div>

                    {/* Comparación */}
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center mb-2">
                        <DollarSign className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="font-medium text-yellow-900">Comparación</span>
                      </div>
                      <div className="text-sm text-yellow-800">
                        <p>CAT promedio del mercado: 18-25%</p>
                        <p className={calculatedValues.cat < 20 ? 'text-green-700' : 'text-red-700'}>
                          Esta cotización: {calculatedValues.cat < 20 ? 'Competitiva' : 'Por encima del promedio'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  Solicitar Cotización
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}