import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  skip?: boolean
}

interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiResult<T> {
  const { token } = useAuth()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    method = 'GET',
    body,
    headers = {},
    skip = false
  } = options

  const fetchData = async () => {
    if (skip) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://localhost:5000${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...headers
        },
        ...(body && { body: JSON.stringify(body) })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url, method, JSON.stringify(body), skip])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}