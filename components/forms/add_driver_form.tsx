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
export default function AddDriverForm() {
    const QueryClient = useQueryClient()
    const AddDriverSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })
    const form = useForm<z.infer<typeof AddDriverSchema>>({
        resolver: zodResolver(AddDriverSchema),
        mode: "onBlur"
    })

    const MutateAddDriver = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/admin/addDriver`, {
                name: form.getValues().name,
                email: form.getValues().email,
                password: form.getValues().password
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                QueryClient.invalidateQueries({ queryKey: ["driver"] })
                toast.success("Driver Added")
            }
            else {
                toast.error("Driver Not Added")
            }
        }
    })
    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => MutateAddDriver.mutate())} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>name</FormLabel>
                            <FormControl>
                                <Input placeholder="driver" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="sample@gmail.com" {...field} />
                            </FormControl>
                            <FormDescription>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" type="password" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={MutateAddDriver.isPending} type="submit">{(MutateAddDriver.isPending) ? "..." : "submit"}</Button>
            </form>
        </Form>
    </div>
}