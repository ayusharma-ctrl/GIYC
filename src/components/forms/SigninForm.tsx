"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { login } from '@/app/actions/auth';
import { SigninFormData, SigninFormErrors } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signIn } from '@/store/slices/authSlice';


const SigninForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<SigninFormData>({
        username: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState<SigninFormErrors>({});

    const router = useRouter();
    const dispatch = useDispatch();

    // clears form fields & form errors states
    const clearFormfields = () => {
        setFormData({ password: '', username: '' });
        setFormErrors({});
    }

    // common method to handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof SigninFormData, value);
    };

    // method to validate input fields
    const validateField = (fieldName: keyof SigninFormData, fieldValue: string) => {
        let errorMessage = '';
        switch (fieldName) {
            case 'username':
                if (fieldValue.length < 3) {
                    errorMessage = 'Please enter a valid username';
                }
                break;
            case 'password':
                if (fieldValue.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long.';
                }
                break;
            default:
                break;
        }
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
    };

    // method to handle signin
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // validation
        if (Object.values(formErrors).some(Boolean) || !formData.username?.length || !formData.password?.length) {
            validateField("username", formData.username);
            validateField("password", formData.password);
            toast.error("Please check the credentials before submitting");
            return;
        }

        try {
            setIsLoading(true);
            const { success, error } = await login(formData);

            if (error && !success) {
                throw new Error(error);
            }

            toast.success("Login Success");
            setIsLoading(false);
            clearFormfields();
            dispatch(signIn());

            if (success) router.push('/');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);
            setIsLoading(false);
            toast.error("Login failed", {
                description: error?.response?.data?.message ? error?.response?.data?.message : error?.message ? error.message : error ? error : "Please try again later or check the credentials!"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            type='text'
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            aria-label="Enter Username"
                        />
                        {formErrors.username && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.username}</p>}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            aria-label="Enter Password"
                        />
                        {formErrors.password && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.password}</p>}
                    </div>
                </CardContent>


                <CardFooter>
                    <Button type="submit" className="w-full cursor-pointer" disabled={Object.values(formErrors).some(Boolean) || isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default SigninForm