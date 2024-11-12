"use client"

import { useRouter } from "next/navigation"

export default function RouteCard(props: {
    id: string
    routeName: string
}) {
    const router = useRouter()
    return <div onClick={() => {
        router.push(`/routes/${props.id}`)
    }} className=" w-full h-20 bg-white rounded-sm border-2 flex justify-center items-center hover:cursor-pointer">
        {props.routeName}
    </div>
}