"use client";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { BaseURl } from "@/app/utils/constants";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AddStops(params: {
    params: {
        id: string
    }
}) {
    const [location, setLocation] = useState("");
    const [place, Setplace] = useState("")
    const [lat, Setlat] = useState(0)
    const [long, Setlong] = useState(0)
    const queryClient = useQueryClient()
    const [time, Settime] = useState("")
    const MutateAddStop = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/stops/addStop`, {
                routeId: params.params.id,
                lat: lat,
                long: long,
                description: place,
                time: time
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                toast.success(data.message)
                queryClient.invalidateQueries({ queryKey: ["stops"] })
            } else {
                toast.error(data.message)
            }
        }
    })
    const QueryRoutes = useQuery({
        queryKey: ["stops", params.params.id],
        queryFn: async () => {
            const response = await axios.get(`${BaseURl}/route/getRoute?routeId=${params.params.id}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        }
    })
    const QueryLocation = useQuery({
        queryKey: ["location", location],
        queryFn: async () => {
            if (!location) return { predictions: [] }; // Return empty if location is empty
            const response = await axios.get(
                `https://api.olamaps.io/places/v1/autocomplete?input=${location}&api_key=k61MzN4GjcBVK6Umb1d8TEEVuG8yO9gRKDPKcGhx`
            );
            return response.data;
        },
        enabled: !!location, // Only run query when location has a value
    });

    const debouncedSetLocation = useCallback(
        debounce((value) => {
            setLocation(value);
        }, 1000),
        []
    );
    if (QueryRoutes.isLoading) {
        return <div className="flex justify-center flex-col w-full min-h-screen items-center pt-20 pl-56">
            loading
        </div>
    }
    if (QueryRoutes.isError) {
        return <div className="flex justify-center flex-col w-full min-h-screen items-center pt-20 pl-56">
            Error
        </div>
    }
    if (QueryRoutes.data) {
        return (
            <div className="flex justify-center flex-col gap-5 w-full min-h-screen items-center pb-10 pt-20 pl-56">
                {QueryRoutes.data.data.stops.map((route: any, index: number) => {
                    return <div className="border-2 w-1/2 bg-white p-2" key={route.id}>
                        <p className="font-bold text-lg ">stop: {index + 1}</p>
                        <p className="text-lg font-bold">time: {route.time}</p>
                        <p className="text-gray-700">{route.description}</p>
                    </div>
                })}
                <Sheet >
                    <SheetTrigger className="fixed bottom-5 right-5">
                        <Button>Add Stop</Button>
                    </SheetTrigger>
                    <SheetContent side={"bottom"} className="h-2/3">
                        <SheetHeader>
                            <SheetDescription>

                                <p className="font-bold text-black text-2xl my-5">Selected place:</p>
                                <p className="text-black my-5">
                                    {(place.length > 0) ? `${place}` : ""}
                                </p>
                                <Input
                                    onChange={(e) => {
                                        debouncedSetLocation(e.target.value);
                                    }}
                                    className="w-full"
                                    placeholder="Enter location"
                                />
                                <Input onChange={(e) => {
                                    Settime(e.target.value)
                                }} type="time" className="w-24 my-3" />
                                <div className="mt-4 flex flex-col justify-center gap-5 items-center w-full">
                                    {QueryLocation.isLoading ? (
                                        "Loading..."
                                    ) : <div className="border-2 border-black w-full  overflow-auto">
                                        {QueryLocation.data?.predictions.map((prediction: any, index: number) => (
                                            <p onClick={() => {
                                                Setplace(prediction.description)
                                                Setlat(prediction.geometry.location.lat)
                                                Setlong(prediction.geometry.location.lng)
                                                setLocation("")
                                            }} className="border-2 p-2 hover:cursor-pointer h-10 truncate " key={index}>{prediction.description}</p>
                                        ))}
                                    </div>

                                    }

                                    <SheetClose asChild >
                                        <Button onClick={() => MutateAddStop.mutate()}  >Add Stop</Button>
                                    </SheetClose>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>


            </div>

        );
    }
}
