import { cn } from '@/lib/utils'

type LoaderProps = {
  label?: string
  className?: string
}

export function Loader({ label, className }: LoaderProps) {
  return (
    <div className={cn('flex items-center gap-2 text-slate-600', className)} role="status" aria-live="polite">
      <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
      </svg>
      {label && <span className="text-sm">{label}</span>}
    </div>
  )
}