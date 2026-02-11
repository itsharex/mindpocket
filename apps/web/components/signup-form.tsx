"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AuthBrandDisplay } from "@/components/auth-brand-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingRegistration, setCheckingRegistration] = useState(true)
  const [registrationAllowed, setRegistrationAllowed] = useState(true)
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check if registration is allowed
    const checkRegistration = async () => {
      try {
        const response = await fetch("/api/check-registration")
        const data = await response.json()
        setRegistrationAllowed(data.allowed)
        setRegistrationMessage(data.message)
      } catch (error) {
        console.error("Failed to check registration status:", error)
        toast.error("无法检查注册状态")
      } finally {
        setCheckingRegistration(false)
      }
    }

    checkRegistration()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registrationAllowed) {
      toast.error("注册已关闭")
      return
    }

    await signUp.email({
      email,
      password,
      name,
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => {
          toast.error(ctx.error.message || "注册失败，请重试")
        },
        onSuccess: () => {
          toast.success("注册成功")
          router.push("/")
        },
      },
    })
  }

  if (checkingRegistration) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex items-center justify-center p-6 md:p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
            <AuthBrandDisplay />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="font-bold text-2xl">创建账户</h1>
                <p className="text-balance text-muted-foreground">注册 MindPocket</p>
              </div>

              {!registrationAllowed && registrationMessage && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive">
                  <p className="font-medium">{registrationMessage}</p>
                  <Link
                    className="mt-2 inline-block text-sm underline underline-offset-4 hover:text-destructive/80"
                    href="/login"
                  >
                    返回登录
                  </Link>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">姓名</FieldLabel>
                <Input
                  disabled={loading || !registrationAllowed}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="张三"
                  required
                  type="text"
                  value={name}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                <Input
                  disabled={loading || !registrationAllowed}
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  type="email"
                  value={email}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">密码</FieldLabel>
                <Input
                  disabled={loading || !registrationAllowed}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  value={password}
                />
              </Field>
              <Field>
                <Button className="w-full" disabled={loading || !registrationAllowed} type="submit">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "注册"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <AuthBrandDisplay />
        </CardContent>
      </Card>
    </div>
  )
}
