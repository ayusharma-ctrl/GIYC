"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { AVATARS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { SignupFormData, SignupFormErrors } from '@/lib/types';
import { register, validateUsername } from '@/app/actions/auth';
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { signIn } from '@/store/slices/authSlice';


const SignupForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<SignupFormData>({
        username: '',
        password: '',
        confirmPassword: '',
        avatar: '',
    });

    const [formErrors, setFormErrors] = useState<SignupFormErrors>({});

    const router = useRouter();
    const dispatch = useDispatch();

    // clears form fields & form errors states
    const clearFormfields = () => {
        setFormData({ avatar: '', confirmPassword: '', password: '', username: '' });
        setFormErrors({});
    }

    // common method to handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        validateField(name as keyof SignupFormData, value);
    };

    // method to validate input fields
    const validateField = async (fieldName: keyof SignupFormData, fieldValue: string) => {
        let errorMessage = '';
        switch (fieldName) {
            case 'username': {
                if (!fieldValue.trim()) {
                    errorMessage = 'Username is required.';
                    break;
                }
                const isValid = await validateUsername(fieldValue);
                if (!isValid) {
                    errorMessage = 'Please enter a valid and unique username';
                }
            }
                break;
            case 'confirmPassword':
                if (!fieldValue || fieldValue !== formData.password) {
                    errorMessage = 'Please enter a valid password';
                }
                break;
            case 'password':
                if (!fieldValue || fieldValue.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long.';
                }
                break;
            case 'avatar':
                if (!fieldValue) {
                    errorMessage = 'Please select an avatar';
                }
                break;
            default:
                break;
        }
        setFormErrors(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
    };

    // helper method to validate input fields
    const handleValidator = () => {
        validateField("username", formData.username);
        validateField("password", formData.password);
        validateField("confirmPassword", formData.confirmPassword);
        validateField("avatar", formData.avatar);
    }


    // method to handle signup
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Object.values(formErrors).some(Boolean) || !formData.username || !formData.password || !formData.confirmPassword || !formData.avatar) {
            handleValidator();
            toast.error("Please check the credentials before submitting");
            return;
        }
        try {
            setIsLoading(true);
            const { success, error } = await register(formData);

            if (error && !success) {
                throw new Error(error);
            }

            toast.success("Login Success");
            clearFormfields() // update formdata and formerrors states
            setIsLoading(false);
            dispatch(signIn());

            if (success) router.push('/');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error);
            setIsLoading(false);
            toast.error("Signup failed", {
                description: error?.response?.data?.message ? error?.response?.data?.message : error?.message ? error.message : error ? error : "Please try again later!"
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                    Enter your details to create a new account
                </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name='username'
                            type='text'
                            placeholder="Choose a username"
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
                            placeholder="Choose a password"
                            value={formData.password}
                            onChange={handleChange}
                            aria-label="Choose a password"
                        />
                        {formErrors.password && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            aria-label="Confirm your password"
                        />
                        {formErrors.confirmPassword && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.confirmPassword}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Select Avatar</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {AVATARS.map((avatar) => (
                                <motion.button
                                    key={avatar.id}
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFormData({ ...formData, avatar: avatar.src })}
                                    className={`aspect-square flex items-center justify-center text-3xl p-2 rounded-md cursor-pointer transition-colors ${formData.avatar === avatar.src
                                        ? "bg-primary/20 ring-2 ring-primary"
                                        : "bg-muted hover:bg-muted/80"
                                        }`}
                                    title={avatar.name}
                                >
                                    {avatar.src}
                                </motion.button>
                            ))}
                        </div>
                        {formErrors.avatar && <p className="text-red-500 text-xs font-normal mt-2">{formErrors.avatar}</p>}
                    </div>

                </CardContent>

                <CardFooter>
                    <Button type="submit" className="w-full cursor-pointer" disabled={Object.values(formErrors).some(Boolean) || isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                </CardFooter>

            </form>
        </Card>
    )
}

export default SignupForm