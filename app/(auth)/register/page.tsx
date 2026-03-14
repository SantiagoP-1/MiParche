import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="text-center mb-10">
        <Link href="/" className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase hover:opacity-70 transition-opacity">
          ← Mi Parche
        </Link>
        <h1 className="font-serif text-3xl font-light mt-4 mb-2">Crear cuenta</h1>
        <p className="font-serif text-text-muted text-sm font-light">
          Gratis para siempre. Sin publicidad.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8">
        <a
          href="/api/auth/login?screen_hint=signup"
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-accent to-[#b8935a] text-bg font-serif text-lg font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)] transition-all duration-300"
        >
          Registrarme con email
        </a>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[10px] text-text-dim tracking-widest">O</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="/api/auth/login?connection=google-oauth2&screen_hint=signup"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-surface2 border border-border rounded-xl font-mono text-[11px] text-text-muted tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
          >
            Google
          </a>
          <a
            href="/api/auth/login?connection=github&screen_hint=signup"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-surface2 border border-border rounded-xl font-mono text-[11px] text-text-muted tracking-widest hover:border-accent hover:text-accent transition-all duration-200"
          >
            GitHub
          </a>
        </div>

        <p className="mt-6 text-center font-serif text-xs text-text-dim font-light">
          Al registrarte aceptás nuestros términos de uso y política de privacidad.
        </p>
      </div>

      <p className="text-center mt-6 font-serif text-sm text-text-muted font-light">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-accent hover:underline underline-offset-4">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
