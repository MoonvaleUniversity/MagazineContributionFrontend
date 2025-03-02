import React from 'react'
import StudentLayout from '../../layout/StudentLayout'
import { MvProfileEdit } from '../../components/Student/MvProfileEdit'

export const MvStudentProfileEdit:React.FC = () => {
  return (
    <StudentLayout>
      <MvProfileEdit/>
    </StudentLayout>
  )
}

