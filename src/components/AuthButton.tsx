"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@radix-ui/themes";
import  Image  from "next/image";

export default function AuthButton() {
    const { data:session } = useSession();
    // console.log("AuthButton session status:", status);
    return (
        <>
            {session ? (
                <>
                    <div className="flex items-center gap-3"> 
                        <p className="text-gray-800">{session.user!.name}</p>
                        <Image
                            src={session.user!.image!}
                            alt={`${session.user!.name}`}
                            width={32}
                            height={32}
                            className="rounded-full border"
                        />
                        
                        <Button
                            className="px-4 py-2 rounded-md bg-gray-300 text-white font-medium hover:bg-orange-700 hover:opacity-80"
                            style={{ cursor: 'pointer' }}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Sign Out
                        </Button>
                    </div>
                </>
            ) : (
                <>
                <Button
                    className="px-4 py-2 rounded-md bg-strorange text-white font-medium hover:bg-orange-700 hover:opacity-80"
                    style={{ cursor: 'pointer' }}
                    onClick={() => signIn()}
                >
                    Sign In
                </Button>
                </>
            )}
        </>
    );

}