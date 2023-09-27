'use client'
import { ChakraProvider } from '@chakra-ui/react'
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Virolife Admin</title>
      </head>
      <body>
        <ChakraProvider toastOptions={{defaultOptions: {position: 'top-right'}}}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
