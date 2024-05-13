import './App.css'
import { Container, CssBaseline } from '@mui/material'
import React from 'react'
import { HomePage } from './pages/home.page'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { GuestPage } from './pages/guest.page';
import { EmployeePage } from './pages/employee.page';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { AuthProvider } from './contexts/auth.context';
import { GraphqlProvider } from './contexts/graphql.context';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/guest",
    element: <GuestPage />,
  },
  {
    path: "/employee",
    element: <EmployeePage />,
  },
]);

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <GraphqlProvider>
            <Container fixed maxWidth="lg" style={{ margin: '0 auto' }}>
              <RouterProvider router={router} />
            </Container>
          </GraphqlProvider>
        </AuthProvider>
      </LocalizationProvider>
    </React.Fragment>
  )
}

export default App
