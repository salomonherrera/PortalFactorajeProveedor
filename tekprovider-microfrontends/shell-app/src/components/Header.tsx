import React from 'react'
import { Bell, User, LogOut, Settings, Building2, Users } from 'lucide-react'
import { useAuth } from '@tekprovider/shared-components'
import { Button } from '@tekprovider/shared-components'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()

  const getUserTypeLabel = () => {
    return user?.userType === 'Provider' ? 'Proveedor' : 'Cliente'
  }

  const getUserTypeIcon = () => {
    return user?.userType === 'Provider' ? <Building2 className="w-4 h-4" /> : <Users className="w-4 h-4" />
  }

  const getFactoringTypeLabel = () => {
    if (!user?.factoringConfig) return 'No configurado'
    return user.factoringConfig.factoringType === 'ClientFactoring' 
      ? 'Factoraje de Clientes' 
      : 'Factoraje de Proveedores'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Portal TekProvider
          </h2>
          <div className="ml-4 flex items-center space-x-2">
            {getUserTypeIcon()}
            <span className="text-sm text-gray-600">{getUserTypeLabel()}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{getFactoringTypeLabel()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Configuración">
            <Settings className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {user?.companyName}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              icon={<LogOut className="w-4 h-4" />}
            >
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}