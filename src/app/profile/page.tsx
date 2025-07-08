import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProtectedRoute() {
    const session = await getServerSession(authOptions);
    console.log("My profile [protected]");
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <section>
            <div> 
                My profile [protected]
            </div>
        </section>
    )
}