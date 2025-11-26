import { signIn } from "next-auth/react";

export const signInWithCredentials = async (params: { email: string, password: string }) => {
    const { email, password } = params;

    try {
        const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        });

        if (result?.error) {
            return { success: false, error: result.error };
        }

        return { success: true };
        
    } catch (error) {
        console.log(error, "Sign in error");
        return { success: false, error: "Something went wrong during sign in" };
    }
};