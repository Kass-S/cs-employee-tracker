import EmployeeTable from '@/components/EmployeeTable'
import React from 'react'

const EmployeesPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="mx-[10%] pt-20">

        <EmployeeTable />

      </div>
    </div>
  )
}

export default EmployeesPage