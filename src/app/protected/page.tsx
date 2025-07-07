import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProtectedRoute() {
    const session = await getServerSession(authOptions);
    console.log("ProtectedRoute session:", session);
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <div> 
            This is a protected route. You'll only see this if authenticated. 
        </div>
    )
}