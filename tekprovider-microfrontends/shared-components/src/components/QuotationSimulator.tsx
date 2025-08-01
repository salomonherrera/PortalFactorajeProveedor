import React, { useState } from 'react'
import { Calculator, TrendingUp, Building2, Users, Shield, ShieldOff } from 'lucide-react'
import { Card, formatCurrency } from './Card'
import { cn } from '../utils/cn'

interface QuotationData {
  termDays: number
  advancePercentage: number
  retentionPercentage: number
  interestRate: number
  commissionPercentage: number
  assignor: string
  payer: string
  factoringType: 'ClientFactoring' | 'ProviderFactoring'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
  relationship?: string
}

interface QuotationSimulatorProps {
  totalAmount: number
  onQuotationChange: (quotation: QuotationData & { 
    advanceAmount: number
    retentionAmount: number
    commissionAmount: number
    netAmount: number
    cat: number
  }) => void
  initialData?: Partial<QuotationData>
  userType?: 'Provider' | 'Client'
  className?: string
}

export const QuotationSimulator: React.FC<QuotationSimulatorProps> = ({
  totalAmount,
  onQuotationChange,
  initialData = {},
  userType = 'Provider',
  className
}) => {
  const [quotation, setQuotation] = useState<QuotationData>({
    termDays: 30,
    advancePercentage: 80,
    retentionPercentage: 15,
    interestRate: 2.5,
    commissionPercentage: 3.0,
    assignor: '',
    payer: '',
    factoringType: 'ClientFactoring',
    resourceType: 'WithRecourse',
    relationship: '',
    ...initialData
  })

  const calculateAmounts = () => {
    const advanceAmount = totalAmount * (quotation.advancePercentage / 100)
    const retentionAmount = totalAmount * (quotation.retentionPercentage / 100)
    const commissionAmount = totalAmount * (quotation.commissionPercentage / 100)
    const netAmount = advanceAmount - commissionAmount
    
    // Cálculo del CAT (Costo Anual Total)
    const monthlyRate = quotation.interestRate / 100 / 12
    const periods = quotation.termDays / 30
    const cat = ((Math.pow(1 + monthlyRate, 12) - 1) * 100) + quotation.commissionPercentage
    
    return {
      advanceAmount,
      retentionAmount,
      commissionAmount,
      netAmount,
      cat: Number(cat.toFixed(2))
    }
  }

  const amounts = calculateAmounts()

  const updateQuotation = (updates: Partial<QuotationData>) => {
    const newQuotation = { ...quotation, ...updates }
    setQuotation(newQuotation)
    onQuotationChange({ ...newQuotation, ...calculateAmounts() })
  }

  return (
    <Card className={cn('bg-gradient-to-br from-teal-50 to-blue-50', className)}>
      <div className="p-4 border-b bg-teal-500 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Calculator className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Simulador Cotización de Factoraje - Diseño Moderno</h3>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Selecciona Modelo de Operación */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
            <h4 className="font-semibold text-gray-900">Selecciona Modelo de Operación</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => updateQuotation({ factoringType: 'ClientFactoring' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                quotation.factoringType === 'ClientFactoring'
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="text-center">
                <Users className="w-10 h-10 mx-auto mb-3 text-blue-500" />
                <h5 className="font-medium text-gray-900">Factoraje a Cliente Seller Centric</h5>
                <p className="text-sm text-gray-600 mt-1">Factoraje de facturas emitidas a clientes</p>
              </div>
            </div>
            
            <div
              onClick={() => updateQuotation({ factoringType: 'ProviderFactoring' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                quotation.factoringType === 'ProviderFactoring'
                  ? 'border-purple-500 bg-purple-50 shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              <div className="text-center">
                <Building2 className="w-10 h-10 mx-auto mb-3 text-purple-500" />
                <h5 className="font-medium text-gray-900">Factoraje a Proveedor Buyer Centric</h5>
                <p className="text-sm text-gray-600 mt-1">Factoraje de facturas de proveedores</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tipo de Recurso */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
            <h4 className="font-semibold text-gray-900">Tipo de Recurso</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => updateQuotation({ resourceType: 'WithRecourse' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                quotation.resourceType === 'WithRecourse'
                  ? 'border-red-500 bg-red-50 shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-red-300 hover:shadow-sm'
              }`}
            >
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <h5 className="font-medium text-gray-900">Con Recurso</h5>
                <p className="text-sm text-gray-600">Mayor seguridad</p>
              </div>
            </div>
            
            <div
              onClick={() => updateQuotation({ resourceType: 'WithoutRecourse' })}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                quotation.resourceType === 'WithoutRecourse'
                  ? 'border-green-500 bg-green-50 shadow-md transform scale-105'
                  : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
              }`}
            >
              <div className="text-center">
                <ShieldOff className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <h5 className="font-medium text-gray-900">Sin Recurso</h5>
                <p className="text-sm text-gray-600">Mayor flexibilidad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Facturas */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
            <h4 className="font-semibold text-gray-900">Información de Facturas</h4>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monto Total Facturas
                </label>
                <input
                  type="text"
                  value={formatCurrency(totalAmount)}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-semibold"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Cargar Facturas Individuales</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Folio</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Cliente/Cedente</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Pagador</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Monto</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Fecha Vencimiento</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="F001"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Cliente"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="text" 
                          placeholder="Pagador"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input 
                          type="date"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                          +
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Parámetros Financieros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Parámetros</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasa de Interés Anual %
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={quotation.interestRate}
                    onChange={(e) => updateQuotation({ interestRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
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
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Cálculos</h4>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monto Total:</span>
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
                <div className="flex justify-between bg-blue-50 p-2 rounded">
                  <span className="font-semibold text-blue-900">CAT Estimado:</span>
                  <span className="font-bold text-blue-600">{amounts.cat}%</span>
                </div>
              </div>
            </div>

            {/* Simulación de Pagos */}
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-3">Simulación de Pagos</h5>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Pago 1 (Adelanto):</span>
                    <span className="font-medium">{formatCurrency(amounts.advanceAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pago 2 (Retención):</span>
                    <span className="font-medium">{formatCurrency(amounts.retentionAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Al vencimiento de facturas</span>
                    <span>En {quotation.termDays} días</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Partes */}
        <div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
            <h4 className="font-semibold text-gray-900">Información de Partes</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cedente *
              </label>
              <select
                value={quotation.assignor}
                onChange={(e) => updateQuotation({ assignor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione Cedente</option>
                <option value="Servicios Demo S.A.">Servicios Demo S.A.</option>
                <option value="Nestlé México">Nestlé México</option>
                <option value="Coca Cola">Coca Cola</option>
                <option value="Walmart">Walmart</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pagador *
              </label>
              <select
                value={quotation.payer}
                onChange={(e) => updateQuotation({ payer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione Pagador</option>
                <option value="Servicios Demo S.A.">Servicios Demo S.A.</option>
                <option value="Nestlé México">Nestlé México</option>
                <option value="Coca Cola">Coca Cola</option>
                <option value="Walmart">Walmart</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relación
              </label>
              <input
                type="text"
                value={quotation.relationship || ''}
                onChange={(e) => updateQuotation({ relationship: e.target.value })}
                placeholder="Proveedor-Cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}