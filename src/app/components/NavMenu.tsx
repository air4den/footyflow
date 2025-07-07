"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
function AuthButton() {
    const { data:session } = useSession();
    if (session) {
        return (
            <>
                {session?.user?.name} <br />
                <button onClick={() => signOut({ callbackUrl: "/"})}>
                    SignOut
                </button>
            </>
        )
    } 
    return (
        <>
            Not Signed in <br />
            <button onClick={() => signIn()}>SignIn</button>
        </>
    )
}

export default function NavMenu() {
    const pathname = usePathname();     // use this to change styling on active/inactive path
    return (
        <div>
            <AuthButton />
        </div>
    )
}
