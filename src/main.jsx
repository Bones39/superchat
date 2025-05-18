import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from "./context"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<App />
			<ReactQueryDevtools/>
		</AuthProvider>
	</QueryClientProvider>
  </React.StrictMode>,
)
