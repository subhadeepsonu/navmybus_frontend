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
import AddRouteForm from "@/components/forms/add_route_form";
import RouteCard from "@/components/cards/route_card";

export default function Routes() {
    const QueryRoutes = useQuery({
        queryKey: ["routes"],
        queryFn: async () => {
            const response = await axios.get(`${BaseURl}/route/getAllRoutes`, {
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
            <div className="h-screen w-full flex justify-center relative items-center pt-16 pl-52">
                <Sheet>
                    <SheetTrigger className="absolute bottom-5 right-5">
                        <Button>Add Route</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Add Route</SheetTitle>
                            <SheetDescription>
                                <AddRouteForm />
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <div className="h-full w-full">
                    <div className="grid grid-cols-4 gap-5 px-5 pt-5 w-full h-fit">
                        {QueryRoutes.data.data.map((route: { id: string, routeName: string }, index: number) => {
                            return <RouteCard id={route.id} routeName={route.routeName} key={index} />
                        })}
                    </div>
                </div>
            </div>
        );
    }
}