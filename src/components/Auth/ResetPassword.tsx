"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ResetPasswordFormData {
  email: string;
}

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ResetPassword: React.FC = () => {
  const supabase = createClientComponentClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values: ResetPasswordFormData) => {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Password reset instructions sent.');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
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
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Send Instructions
            </Button>
          </CardFooter>
        </form>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
        {successMsg && <div className="text-green-500 text-center">{successMsg}</div>}
        <div className="mt-4 text-center">
          <Link href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
            Remember your password? Sign In.
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
