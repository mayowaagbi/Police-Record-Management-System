import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <Input
                name="email"
                placeholder="Email"
                type="email"
                required
              />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                required
              />
              <Button type="submit" className="w-full">Login</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></p>
        </CardFooter>
      </Card>
    </div>
  )
}