import { useState } from 'react'
import { Agenda } from './components/Agenda'
import { Chat } from './components/Chat'
import { Footer } from './components/Footer'
import { Header, type Tab } from './components/Header'
import { Recommendations } from './components/Recommendations'

export default function App() {
  const [tab, setTab] = useState<Tab>('chat')

  return (
    <div className="app-shell">
      <div className="ambient" aria-hidden="true" />
      <Header activeTab={tab} onTabChange={setTab} />
      <main className="main-stage">
        {tab === 'chat' && <Chat onOpenAgenda={() => setTab('agenda')} />}
        {tab === 'recomendaciones' && (
          <Recommendations onOpenAgenda={() => setTab('agenda')} />
        )}
        {tab === 'agenda' && <Agenda />}
      </main>
      <Footer />
    </div>
  )
}
