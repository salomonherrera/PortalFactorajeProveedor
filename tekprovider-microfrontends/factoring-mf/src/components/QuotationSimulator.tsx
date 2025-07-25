import React, { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import { Card, formatCurrency } from '@tekprovider/shared-components'

interface QuotationData {
  termDays: number
  advancePercentage: number
  retentionPercentage: number
  interestRate: number
  commissionPercentage: number
  cedente: string
  pagador: string
  operationType: 'Provider' | 'Client'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
}

interface QuotationSimulatorProps {
  totalAmount: number
  onQuotationChange: (quotation: QuotationData) => void
  initialData?: Partial<QuotationData>
}

export const QuotationSimulator: React.FC<QuotationSimulatorProps> = ({
  totalAmount,
  onQuotationChange,
  initialData = {}
}) => {
  const [quotation, setQuotation] = useState<QuotationData>({
    termDays: 30,
    advancePercentage: 80,
    retentionPercentage: 15,
    interestRate: 2.5,
    commissionPercentage: 3.0,
    cedente: '',
    pagador: '',
    operationType: 'Provider',
    resourceType: 'WithRecourse',
    ...initialData
  })

  const calculateAmounts = () => {
    const advanceAmount = totalAmount * (quotation.advancePercentage / 100)
    const retentionAmount = totalAmount * (quotation.retentionPercentage / 100)
    const commissionAmount = totalAmount * (quotation.commissionPercentage / 100)
    const netAmount = advanceAmount - commissionAmount
    
    return {
      advanceAmount,
      retentionAmount,
      commissionAmount,
      netAmount
    }
  }

  const amounts = calculateAmounts()

  const updateQuotation = (updates: Partial<QuotationData>) => {
    const newQuotation = { ...quotation, ...updates }
    setQuotation(newQuotation)
    onQuotationChange(newQuotation)
  }

  return (
    <Card>
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Simulador de Cotización</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Modelo de Operación */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Modelo de Operación</h4>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => updateQuotation({ operationType: 'Provider' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                quotation.operationType === 'Provider'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="font-medium">Factoraje a Cliente Seller Centric</p>
              </div>
            </div>
            
            <div
              onClick={() => updateQuotation({ operationType: 'Client' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                quotation.operationType === 'Client'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="font-medium">Factoraje a Proveedor Buyer Centric</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Recurso */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Tipo de Recurso</h4>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => updateQuotation({ resourceType: 'WithRecourse' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                quotation.resourceType === 'WithRecourse'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-medium">Con Recurso</p>
                <p className="text-sm text-gray-600">Mayor seguridad</p>
              </div>
            </div>
            
            <div
              onClick={() => updateQuotation({ resourceType: 'WithoutRecourse' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                quotation.resourceType === 'WithoutRecourse'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <p className="font-medium">Sin Recurso</p>
                <p className="text-sm text-gray-600">Mayor flexibilidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Facturas */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Información de Facturas</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cedente *
              </label>
              <input
                type="text"
                value={quotation.cedente}
                onChange={(e) => updateQuotation({ cedente: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del cedente"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagador *
              </label>
              <input
                type="text"
                value={quotation.pagador}
                onChange={(e) => updateQuotation({ pagador: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del pagador"
              />
            </div>
          </div>
        </div>

        {/* Parámetros Financieros */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Parámetros Financieros</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plazo (días)
              </label>
              <input
                type="number"
                value={quotation.termDays}
                onChange={(e) => updateQuotation({ termDays: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % Adelanto
              </label>
              <input
                type="number"
                step="0.1"
                value={quotation.advancePercentage}
                onChange={(e) => updateQuotation({ advancePercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % Retención
              </label>
              <input
                type="number"
                step="0.1"
                value={quotation.retentionPercentage}
                onChange={(e) => updateQuotation({ retentionPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Interés %
              </label>
              <input
                type="number"
                step="0.1"
                value={quotation.interestRate}
                onChange={(e) => updateQuotation({ interestRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % Comisión Factoraje
              </label>
              <input
                type="number"
                step="0.1"
                value={quotation.commissionPercentage}
                onChange={(e) => updateQuotation({ commissionPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Resumen de Cálculos */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Resumen de Cálculos</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monto Total Facturas:</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Adelanto ({quotation.advancePercentage}%):</span>
              <span className="font-semibold text-green-600">{formatCurrency(amounts.advanceAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Retención ({quotation.retentionPercentage}%):</span>
              <span className="font-semibold text-yellow-600">{formatCurrency(amounts.retentionAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Comisión ({quotation.commissionPercentage}%):</span>
              <span className="font-semibold text-red-600">{formatCurrency(amounts.commissionAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold">Neto a Recibir:</span>
              <span className="font-bold text-blue-600 text-lg">{formatCurrency(amounts.netAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}