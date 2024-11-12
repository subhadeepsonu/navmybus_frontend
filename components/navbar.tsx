"use client"
import Cookies from "universal-cookie";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const cookie = new Cookies();
    const router = useRouter();
    return (
        <div className="h-16 w-full fixed z-10 top-0 border-b-2 bg-white shadow-sm flex justify-between items-center px-4">
            <div className="text-2xl font-semibold">NavMyBus</div>
            <Button onClick={() => {
                cookie.remove("token")
                router.push("/")
            }} >Logout</Button>
        </div>
    );
}