'use client'

import { useRouter } from 'next/navigation'
import { Portfolio } from '../../screens/Portfolio'
import { RequireWallet } from '../../wallet/RequireWallet'

function PortfolioRoute() {
  const router = useRouter()
  return (
    <Portfolio
      onWithdraw={() => router.push('/withdraw')}
      onDeposit={() => router.push('/deposit')}
    />
  )
}

export default function PortfolioPage() {
  return (
    <RequireWallet>
      <PortfolioRoute />
    </RequireWallet>
  )
}
