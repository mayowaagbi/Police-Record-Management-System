// import Link from "next/link";
import { Button } from "../Components/UI/button";
import { Input } from "../Components/UI/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="space-y-4">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" placeholder="Email" type="email" required />
              <Input
                name="password"
                placeholder="Password"
                type="password"
                required
              />
              <Input
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                required
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
