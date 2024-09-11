import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from '@/store'
import { Raleway } from 'next/font/google'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/useAuth'
import Loader from '@/components/Loader'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
})

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <Loader />
  }

  if (!isAuthenticated && pathname !== '/auth/login' && pathname !== '/auth/register') {
    router.push('/auth/login')
    return null
  }

  if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
    router.push('/dashboard')
    return null
  }

  return (
    <html lang="en" className={`${raleway.variable} font-raleway`}>
      <head>
        <title>FinSteer</title>
        <meta name="description" content="Financial Management ERP" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-100">
        <Provider store={store}>
          <div className="flex h-screen overflow-hidden">
            {isAuthenticated && <Sidebar />}
            <div className="flex-1 flex flex-col overflow-hidden">
              {isAuthenticated && <Navbar />}
              <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                {children}
              </main>
            </div>
          </div>
          <Toaster position="bottom-right" reverseOrder={false} />
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout