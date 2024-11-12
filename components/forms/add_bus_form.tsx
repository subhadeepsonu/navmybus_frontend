"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import axios from "axios"
import { BaseURl } from "@/app/utils/constants"
import { toast } from "sonner"
export default function AddBusForm() {
    const QueryDrivers = useQuery({
        queryKey: ["alldriver"],
        queryFn: async () => {
            const response = await axios.get(`${BaseURl}/driver/all`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            return response.data;
        },
    })
    const QueryRoutes = useQuery({
        queryKey: ["allroutes"],
        queryFn: async () => {
            const response = await axios.get(`${BaseURl}/route/getAllRoutes`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });
            return response.data;
        },
    })
    const QueryClient = useQueryClient()
    const AddBusSchema = z.object({
        busno: z.string(),
        route: z.string(),
        driver: z.string()
    })
    const form = useForm<z.infer<typeof AddBusSchema>>({
        resolver: zodResolver(AddBusSchema),
        mode: "onBlur"
    })
    const MutateAddbus = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/bus/addBus`, {
                busno: form.getValues().busno,
                routeId: form.getValues().route,
                driverId: form.getValues().driver
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                QueryClient.invalidateQueries({ queryKey: ["bus"] })
                toast.success("Driver Added")
            }
            else {
                toast.error(data.message)
            }
        }
    })
    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => MutateAddbus.mutate())} className="space-y-8">
                <FormField
                    control={form.control}
                    name="busno"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bus no</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="driver" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Route</FormLabel>
                            <FormControl>
                                {(QueryRoutes.data) ? <select className="shadow-sm border-[1px] block p-2 w-full rounded-lg" {...field}>
                                    <option value="">Select Route</option>
                                    {QueryRoutes.data.data.map((s: any, index: any) => {
                                        return <option key={index.id} value={s.id}>{s.routeName}</option>
                                    })}
                                </select> : "loading"}
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="driver"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <FormControl>
                                {(QueryDrivers.data) ? <select className="shadow-sm border-[1px] block p-2 w-full rounded-lg" {...field}>
                                    <option value="">Select Driver</option>
                                    {QueryDrivers.data.data.map((s: any, index: any) => {
                                        return <option key={index.id} value={s.id}>{s.name}</option>
                                    })}
                                </select> : "loading"}
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={MutateAddbus.isPending} type="submit">{(MutateAddbus.isPending) ? "..." : "submit"}</Button>
            </form>
        </Form>
    </div>
}