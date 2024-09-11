import Link from 'next/link'
import { FaLock, FaUserPlus } from 'react-icons/fa'
import { motion } from 'framer-motion'

const AuthPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome to Finsteer</h1>
          <p className="text-gray-600">Please log in or create an account</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Link
            href="/auth/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
          >
            <FaLock className="mr-2" />
            Log In
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300"
          >
            <FaUserPlus className="mr-2" />
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthPage