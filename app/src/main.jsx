import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import App from './App'
import ErrorPage from "./error-page"
import Root, {
  loader as rootLoader,
  // action as rootAction,
} from "./routes/root"
import Index from './routes'
import Table, { 
  loader as tableLoader
} from './routes/table'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader(queryClient),
    // action: rootAction(queryClient),
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "/:database/:table",
        element: <Table />,
        loader: tableLoader(queryClient),
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <App /> */}
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>,
)