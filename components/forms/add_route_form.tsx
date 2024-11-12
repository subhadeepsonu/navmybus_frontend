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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import axios from "axios"
import { BaseURl } from "@/app/utils/constants"
import { toast } from "sonner"
export default function AddRouteForm() {
    const QueryClient = useQueryClient()
    const AddRouteSchema = z.object({
        name: z.string()
    })
    const form = useForm<z.infer<typeof AddRouteSchema>>({
        resolver: zodResolver(AddRouteSchema),
        mode: "onBlur"
    })
    const MutateRoute = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/route/addRoute`, {
                routeName: form.getValues("name")
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                QueryClient.invalidateQueries({ queryKey: ["routes"] })
                toast.success("route added")
            } else {
                toast.error(data.message)
            }
        }
    })
    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => MutateRoute.mutate())} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Route name</FormLabel>
                            <FormControl>
                                <Input placeholder="route name" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button disabled={MutateRoute.isPending} type="submit">{(MutateRoute.isPending) ? "..." : "submit"}</Button>
            </form>
        </Form>
    </div>
}