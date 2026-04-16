import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-black text-brand-muted">404</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-text">Page not found</h1>
        <p className="mt-2 text-sm text-brand-text/60">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
