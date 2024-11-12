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
export default function AddStopsFrom() {
    const QueryClient = useQueryClient()
    const AddStopsSchema = z.object({
        name: z.string(),
        location: z.string()
    })
    const form = useForm<z.infer<typeof AddStopsSchema>>({
        resolver: zodResolver(AddStopsSchema),
        mode: "onBlur"
    })

    const MutateAddStops = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/admin/addStops`, {
                name: form.getValues().name,
                location: form.getValues().location
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                QueryClient.invalidateQueries({ queryKey: ["stops"] })
                toast.success("Stop Added")
            }
            else {
                toast.error("Stop Not Added")
            }
        }
    })
    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => MutateAddStops.mutate())} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input placeholder="stop" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Input placeholder="location" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Add Stop</Button>
            </form>
        </Form>
    </div>
}