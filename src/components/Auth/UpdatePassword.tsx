"use client";
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UpdatePasswordFormData {
  password: string;
}

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string().required('Required'),
});

const UpdatePassword: React.FC = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: async (values: UpdatePasswordFormData) => {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Go to Home page
        router.replace('/');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
        </CardHeader>
        <form onSubmit={formik.handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
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
              Update Password
            </Button>
          </CardFooter>
        </form>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
      </Card>
    </div>
  );
};

export default UpdatePassword;
