'use client';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SignInFormData {
    email: string;
    password: string;
}

const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

const SignIn: React.FC = () => {
    const supabase = createClientComponentClient();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: SignInSchema,
        onSubmit: async (values: SignInFormData) => {
            const { error, data } = await supabase.auth.signInWithPassword({
                email: values.email,
                password: values.password,
            });

            if (error) {
                setErrorMsg(error.message);
            } else if (data) {
                redirect('/dashboard');
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="jane@acme.com"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className="text-red-500 text-xs">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                                className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
                            />
                            {formik.touched.password && formik.errors.password && (
                                <div className="text-red-500 text-xs">{formik.errors.password}</div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>
                    </CardFooter>
                </form>
                {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
                <div className="mt-4 text-center">
                    <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-500">
                        Forgot your password?
                    </Link>
                </div>
                <div className="mt-4 text-center">
                    <Link className="text-sm text-blue-600 hover:text-blue-500"
                        href="/sign-up">
                        Don&apos;t have an account? Sign Up
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default SignIn;
