"use client"

import React, { useEffect } from 'react'
import CompanyInfoFormPage from '../_comp/Cerate-Edit-form'
import { useGetCompanyInfoQuery } from '@/lib/store/api/companyInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();

    const { data, isLoading } = useGetCompanyInfoQuery();
    const companyInfo = data?.data;

    if (isLoading) return <div>
        <Skeleton>
            <div className="flex-1 space-y-6 p-8 pt-6">
                <Skeleton className="animate-wave h-10 w-64" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <Skeleton className="animate-wave h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="animate-wave h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Skeleton>
    </div>;

    useEffect(() => {
        if (companyInfo) {
            router.push('/admin/settings')
        }
    }, [companyInfo])


    return (
        <CompanyInfoFormPage />
    )
}

export default page