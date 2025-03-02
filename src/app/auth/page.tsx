"use client";

import { Header } from "@/components/common/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import SigninForm from "@/components/forms/SigninForm";
import SignupForm from "@/components/forms/SignupForm";

export default function AuthPage() {

    return (
        <div className="min-h-screen flex flex-col space-y-4 overflow-y-auto">
            <Header />

            <main className="flex-1 flex items-center justify-center p-4 my-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="signin" className="cursor-pointer">Sign In</TabsTrigger>
                            <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <SigninForm />
                        </TabsContent>

                        <TabsContent value="signup">
                            <SignupForm />
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}