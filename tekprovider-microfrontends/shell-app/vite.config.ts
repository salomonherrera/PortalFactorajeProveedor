import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell-app',
      remotes: {
        'auth-mf': 'http://localhost:3001/assets/remoteEntry.js',
        'dashboard-mf': 'http://localhost:3002/assets/remoteEntry.js',
        'invoices-mf': 'http://localhost:3003/assets/remoteEntry.js',
        'factoring-mf': 'http://localhost:3004/assets/remoteEntry.js',
        'support-mf': 'http://localhost:3005/assets/remoteEntry.js'
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  server: {
    port: 3000,
    cors: true
  },
  build: {
    target: 'esnext'
  }
})