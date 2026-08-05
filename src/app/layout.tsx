import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import StyledComponentsRegistry from '../lib/registry'
import AppShell from './components/AppShell'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Hariharan Loganathan | AI Engineer',
  description:
    'AI Engineer. Founding Software Engineer at CEART and Founding Engineer at GeneGenius. MSCS @ NYU. I build agentic LLM systems, RAG pipelines, and production backend infrastructure.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <AppShell>{children}</AppShell>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
