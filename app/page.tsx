import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Eyebrow */}
      <p className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase mb-4 animate-fade-up">
        Recordatorio de parche anticonceptivo
      </p>

      {/* Hero */}
      <h1
        className="font-serif text-[clamp(3rem,10vw,5.5rem)] font-light leading-none tracking-wide mb-6 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        Mi <em className="italic text-accent">Parche</em>
      </h1>

      <p
        className="font-serif text-[1.15rem] text-text-muted font-light max-w-md mb-12 leading-relaxed animate-fade-up"
        style={{ animationDelay: '0.2s' }}
      >
        Registrá tu ciclo, recibí recordatorios y nunca más te olvidés de cambiar o sacar tu parche.
      </p>

      {/* CTA */}
      <div
        className="flex flex-col sm:flex-row gap-4 animate-fade-up"
        style={{ animationDelay: '0.3s' }}
      >
        <Link
          href="/register"
          className="px-8 py-4 bg-gradient-to-br from-accent to-[#b8935a] text-bg font-serif text-lg font-semibold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,169,110,0.3)] transition-all duration-300"
        >
          Comenzar gratis
        </Link>
        <Link
          href="/login"
          className="px-8 py-4 border border-border text-text-muted font-mono text-[11px] tracking-[0.2em] uppercase rounded-xl hover:border-accent hover:text-accent hover:bg-accent-soft transition-all duration-300"
        >
          Ya tengo cuenta
        </Link>
      </div>

      {/* Features */}
      <div
        className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full animate-fade-up"
        style={{ animationDelay: '0.4s' }}
      >
        {[
          { icon: '🩹', title: 'Ciclo completo', desc: 'Sem. 1, 2, 3 con parche + semana de descanso' },
          { icon: '🔔', title: 'Recordatorios', desc: 'Notificaciones el día exacto del cambio' },
          { icon: '📊', title: 'Historial', desc: 'Seguí todos tus ciclos anteriores' },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-surface border border-border rounded-2xl p-6 text-left"
          >
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-serif text-[1rem] font-semibold text-text mb-1">{f.title}</h3>
            <p className="font-serif text-[0.85rem] text-text-muted font-light">{f.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-16 font-serif text-[0.8rem] text-text-dim italic">
        Hecho con amor ♡
      </p>
    </main>
  )
}
