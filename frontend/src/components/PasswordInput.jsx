import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'

export default function PasswordInput({
  value,
  onChange,
  label,
  placeholder,
  autoComplete,
  required,
  className = '',
}) {
  const [visible, setVisible] = useState(false)
  const id = useId()

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="relative mt-1">
        <input
          id={id}
          value={value}
          onChange={onChange}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={[
            // Mobile: text-base pour éviter le zoom iOS à la saisie
            'w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 pr-12 text-base sm:text-sm text-slate-900 outline-none focus:border-emerald-500/60 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100',
            className,
          ].join(' ')}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          title={visible ? 'Masquer' : 'Afficher'}
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  )
}

