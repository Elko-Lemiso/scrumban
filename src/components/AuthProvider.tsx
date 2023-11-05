'use client';

import { createContext, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { redirect, usePathname } from "next/navigation"


interface AuthContextProps {
    accessToken?: string; // Include other properties that your context will provide
}


export const AuthContext = createContext<AuthContextProps>({});

const AuthProvider = ({ accessToken, children }) => {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const unprotectedRoutes = ['/sign-in', '/sign-up', '/forgot-password'];
    const pathname = usePathname()


    useEffect(() => {

        const {
            data: { subscription: authListener },
        } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(session);
            
            if (session?.access_token !== accessToken) {
                router.refresh();
            }
        });

        // Run the route change handler once on component mount
        return () => {
            authListener?.unsubscribe();
        };
    }, [accessToken, supabase, router]);


    useEffect(() => {
        const handleRouteChange = async () => {

            const { data: { session }, error } = await supabase.auth.getSession()
            if (session && unprotectedRoutes.includes(window.location.pathname)) {
                // If the user is authenticated and tries to visit an unprotected route, redirect to the dashboard
                await router.push('/dashboard');
            } else if (!session && !unprotectedRoutes.includes(window.location.pathname)) {
                // If the user is not authenticated and tries to visit a protected route, redirect to sign-in
                await router.push('/sign-in');
            }
        };

        handleRouteChange()

    }, [pathname])
    return children;
};


export default AuthProvider;