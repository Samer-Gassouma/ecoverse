import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <SignUp appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-500 hover:bg-blue-600',
            card: 'shadow-sm',
          }
        }} />
      </div>
    </div>
  )
}