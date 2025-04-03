import React from 'react'

import { MvProfileEdit } from '../../components/Student/MvProfileEdit'
import MarketingManagerLayout from '../../layout/MarketingManagerLayout'

export const MmProfileEdit:React.FC = () => {
  return (
    <MarketingManagerLayout>
      <MvProfileEdit/>
    </MarketingManagerLayout>
  )
}
