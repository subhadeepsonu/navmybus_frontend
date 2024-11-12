"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SideBarButton(props: {
    name: string,
    href: string
}) {
    const [active, Setactive] = useState(false)
    const router = useRouter()
    const path = usePathname()
    useEffect(() => {
        console.log(path)
        if (path == `/${props.href}`) {
            Setactive(true)
        }
        else {
            Setactive(false)
        }
    }, [path, props.href])
    return <div onClick={() => {
        router.push(`/${props.href}`)
    }} className={`h-14 w-full  flex justify-center items-center rounded-sm my-3 hover:cursor-pointer border-2 ${(active) ? "bg-black text-white border-black transition-all" : ""}  `}>
        {props.name}
    </div>
}