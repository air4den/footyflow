"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "./AuthButton";

export default function NavMenu() {
    const pathname = usePathname();     // use this to change styling on active/inactive path
    return (
        <nav className="w-full bg-white px-8 py-2  border-b-3 border-gray-100 flex items-center">
            <div className="flex items-center w-full">
                <Link href="/">
                    <span className="text-4xl font-bold text-strorange hover:text-orange-700 hover:text-opacity-80">FootyFlow</span>
                </Link>
                <div className="flex-1"></div>
                <AuthButton />
            </div>
        </nav>
    );
}
