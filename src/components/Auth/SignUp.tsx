"use client"
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Define the shape of the form data with TypeScript
interface SignUpFormData {
    email: string;
    password: string;
}

// Validation schema using Yup
const SignUpSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

export default function SignUp() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Formik hook for form handling
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values: SignUpFormData) => {
            // Here you would handle the sign-up logic, e.g., calling an API
            // For now, we'll just simulate a successful sign-up
            setErrorMsg(null);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setSuccessMsg('Success! Please check your email for further instructions.');
            } catch (error) {
                setErrorMsg('An error occurred. Please try again.');
            }
        },
    });

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={formik.handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
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
                            Create account
                        </Button>
                    </CardFooter>
                    <div className="my-2 text-center font-small">
                        <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer text-sm">
                            Already have an account? Sign In.
                        </Link>
                    </div>
                </form>
                {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
                {successMsg && <div className="text-green-500 text-center">{successMsg}</div>}
            </Card>
        </div>
    );
}
