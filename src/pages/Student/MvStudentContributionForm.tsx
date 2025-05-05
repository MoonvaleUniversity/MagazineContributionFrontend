import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layout/StudentLayout'
import { MvContributionForm } from '../../components/Student/MvContributionForm'

import MarketingCoordinatorLayout from '../../layout/MarketingCoordinatorLayout';

import { getUserData } from '../../services/AuthService';

export const MvStudentContributionForm:React.FC = () => {
  const [Layout, setLayout] = useState(() => StudentLayout);
  const userData = getUserData();
  
  useEffect(() => {
    if (userData) {
      switch (userData?.role?.toLowerCase()) {
        case 'marketing coordinator': setLayout(() => MarketingCoordinatorLayout); break;
      
          default: setLayout(() => StudentLayout);
      }
    }
  }, [userData]);
  return (
  <Layout>
    
      <MvContributionForm/>
  </Layout>
  )
} 
