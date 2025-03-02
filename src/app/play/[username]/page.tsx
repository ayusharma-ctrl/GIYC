"use client";

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/common/Header'
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getLimitedUserData } from '@/app/actions/user';
import { LimitedUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { acceptInvite } from '@/app/actions/invite';


export default function InviteAcceptPage() {
    const { username } = useParams(); // Get dynamic route parameter
    const searchParams = useSearchParams();
    const invitedBy = searchParams.get("invitedBy"); // Get query parameter
    const router = useRouter();

    const [user, setUser] = useState<LimitedUser>();

    if (!username || !invitedBy) {
        router.push('/');
    }

    console.log(username, typeof (username));

    const fetchUserDetails = async () => {
        if (!invitedBy) return;
        const { error, user } = await getLimitedUserData(invitedBy);
        if (error) return;
        if (user) setUser(user);
    }

    useEffect(() => {
        fetchUserDetails();
    }, [invitedBy]);

    const handleAcceptInvite = () => {
        if (invitedBy && username && typeof (username) === 'string') {
            acceptInvite(invitedBy, username);
        }
        router.push('/auth');
    }


    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
                <div className='p-4 border rounded-lg shadow-lg min-w-1/2'>
                    <h1 className='text-lg font-medium'>Invited By</h1>
                    {user && <span className='mr-4'>{user.avatar} @{user.username}</span>}
                    <div className='my-2 flex flex-col  gap-2 text-sm mb-8'>
                        <span>
                            Total Matches Played: {user?.totalPlayed}
                        </span>
                        <span>
                            Total Score: {user?.totalCorrect && user?.totalCorrect * 10}
                        </span>
                    </div>
                    <Button className='w-full cursor-pointer my-2' onClick={handleAcceptInvite}>Join</Button>
                    <Button className='w-full cursor-pointer my-2' variant={'destructive'} onClick={() => router.push('/')}>Leave</Button>
                </div>
            </main>

        </div>
    )
}