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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../Components/UI/form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Components/Navbar";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const form = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/login",
        data,
        { withCredentials: true } // Add this option to include credentials
      );

      console.log("Login Successful:", response.data);
      localStorage.setItem("id", response.data?.user?.id);
      localStorage.setItem("firstname", response.data?.user?.firstName);
      localStorage.setItem("lastname", response.data?.user?.lastName);
      localStorage.setItem("email", response.data?.user?.email);
      localStorage.setItem("role", response.data?.user?.role);

      // Set token as a cookie if received
      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/`;
      }

      // Redirect to dashboard
      navigate("/Dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container flex items-center justify-center min-h-screen mx-auto">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email"
                          type="email"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the email associated with your account.
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
                        <Input
                          {...field}
                          placeholder="Password"
                          type="password"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Your password must be at least 8 characters long.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
