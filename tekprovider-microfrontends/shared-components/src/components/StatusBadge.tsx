import React from 'react'
import { cn } from '../utils/cn'

interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  className
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  }

  const getVariantByStatus = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('aprobad') || lowerStatus.includes('pagad') || lowerStatus.includes('cerrad')) {
      return 'success'
    }
    if (lowerStatus.includes('proceso') || lowerStatus.includes('pendiente')) {
      return 'warning'
    }
    if (lowerStatus.includes('rechazad') || lowerStatus.includes('vencid')) {
      return 'danger'
    }
    if (lowerStatus.includes('emitid') || lowerStatus.includes('abierto')) {
      return 'info'
    }
    return variant
  }

  const finalVariant = variant === 'default' ? getVariantByStatus(status) : variant

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[finalVariant],
        className
      )}
    >
      {status}
    </span>
  )
}