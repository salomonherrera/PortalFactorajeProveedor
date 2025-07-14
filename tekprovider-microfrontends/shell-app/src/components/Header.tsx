import React from 'react'
import { Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@tekprovider/shared-components'
import { Button } from '@tekprovider/shared-components'

export const Header: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Portal de Proveedores
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
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