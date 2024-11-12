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
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import axios from "axios"
import { BaseURl } from "@/app/utils/constants"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Cookies from 'universal-cookie';
export default function LoginForm() {
    const cookies = new Cookies()
    const router = useRouter()
    const LoginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    })
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        mode: "onChange"
    })
    const MutateLogin = useMutation({
        mutationFn: async () => {
            const response = await axios.post(`${BaseURl}/admin/login`, {
                email: form.getValues().email,
                password: form.getValues().password
            })
            return response.data
        },
        onSettled: (data) => {
            if (data.success) {
                cookies.set("token", data.token)
                localStorage.setItem("token", data.token)
                router.push("/dashboard")
                toast.success("Login Success")
            }
            else {
                toast.error("Login Failed")
            }
        }
    })
    return (
        <div className="h-full w-full flex justify-center  items-center ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(() => MutateLogin.mutate())} className="space-y-8">
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
                    <Button disabled={MutateLogin.isPending} type="submit">{(MutateLogin.isPending) ? "..." : "submit"}</Button>
                </form>
            </Form>
        </div>
    );
}