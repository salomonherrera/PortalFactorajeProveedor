import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  BarChart3, 
  HeadphonesIcon,
  Building2
} from 'lucide-react'
import { cn } from '@tekprovider/shared-components'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mis Facturas', href: '/invoices', icon: FileText },
  { name: 'Factoraje', href: '/factoring', icon: CreditCard },
  { name: 'Soporte', href: '/support', icon: HeadphonesIcon },
]

export const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
        <Building2 className="w-8 h-8 text-white mr-2" />
        <h1 className="text-xl font-bold text-white">TekProvider</h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}