"use client"
import { BaseURl } from "@/app/utils/constants";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import AddBusForm from "@/components/forms/add_bus_form";
import BusCard from "@/components/cards/bus_card";

export default function BusPage() {
    const QueryRoutes = useQuery({
        queryKey: ["bus"],
        queryFn: async () => {
            const response = await axios.get(`${BaseURl}/bus/getAll`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            return response.data;
        },
    })
    if (QueryRoutes.isLoading) {
        return <div>Loading</div>
    }
    if (QueryRoutes.isError) {
        return <div>Error</div>
    }
    if (QueryRoutes.data) {
        return (
            <div className="h-screen w-full relative flex justify-center items-center pt-16 pl-52">
                <Sheet>
                    <SheetTrigger className="absolute bottom-5 right-5">
                        <Button>Add Bus</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add bus</SheetTitle>
                            <SheetDescription>
                                <AddBusForm />
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>

                <div className="w-full h-full ">
                    <div className="grid grid-cols-4 gap-5 p-5 w-full h-fit">
                        {QueryRoutes.data.message.map((bus: {
                            busno: string
                        }, index: number) => {
                            return <BusCard busno={bus.busno} key={index} />
                        })}
                    </div>
                </div>
            </div>
        );
    }
}