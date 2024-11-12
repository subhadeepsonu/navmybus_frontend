"use client"
import { usePathname } from "next/navigation";
import SideBarButton from "./SideBarButton";

export default function SideBar() {
    const path = usePathname()
    if (path == "/") {
        return null
    }
    return <div className="h-screen w-52 border-r-2  bg-white  fixed left-0 top-0 flex flex-col justify-start items-center px-2 pt-16">
        <SideBarButton href="dashboard" name="Dashboard" />
        <SideBarButton href="bus" name="Bus" />
        <SideBarButton href="driver" name="Driver" />
        <SideBarButton href="routes" name="Routes" />
    </div>
}