'use client'

import { Portfolio } from '../../screens/Portfolio'
import { RequireWallet } from '../../wallet/RequireWallet'
import { usePortfolioRisk } from '../../hooks/usePortfolioRisk'

function PortfolioRoute() {
  const riskScore = usePortfolioRisk()
  return <Portfolio riskScore={riskScore} />
}

export default function PortfolioPage() {
  return (
    <RequireWallet>
      <PortfolioRoute />
    </RequireWallet>
  )
}
