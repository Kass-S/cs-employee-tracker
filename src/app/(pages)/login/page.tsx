import LoginForm from '@/components/LoginForm'
import { Card } from '@/components/ui/card'
import React from 'react'

const LoginPage = () => {
    return (
        <div className='min-h-[100vh] flex justify-center items-center'>
            <Card className='w-[25rem] h-[30rem] p-4 flex justify-center items-center'>
                <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>Login</h5>
                <div className='flex max-w-md flex-col gap-4'>
                    <LoginForm />
                </div>
            </Card>
        </div>
    )
}

export default LoginPage