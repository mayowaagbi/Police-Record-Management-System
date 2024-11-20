// import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import { Button } from "../Components/UI/button";
// import { Input } from "../Components/UI/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../Components/UI/card";
// import { Link } from "react-router-dom";
// import axios from "axios"; // Import Axios
// import { useForm } from "react-hook-form"; // Import react-hook-form components
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../Components/UI/form"; // Import shadcn form components

// export default function SignupPage() {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const form = useForm(); // Initialize useForm

//   // const onSubmit = async (data) => {
//   //   try {
//   //     const response = await axios.post(
//   //       "http://localhost:3000/users/register",
//   //       data // Use data from the form submission
//   //     );
//   //     console.log(response.data); // Handle response data if needed

//   //     // Redirect to login page on successful signup
//   //     // navigate("/");
//   //   } catch (error) {
//   //     console.error("Signup error:", error); // Handle errors as needed
//   //     // Optionally display an error message to the user
//   //   }
//   // };
//   const onSubmit = async (data) => {
//     try {
//       const role = localStorage.getItem("role"); // Or fetch from local storage as appropriate

//       const response = await axios.post(
//         "http://localhost:3000/users/register",
//         { data, role }, // Send both data and role as part of the body
//         {
//           headers: {
//             "x-user-role": role, // Ensure the role is sent in the headers
//           },
//         }
//       );

//       console.log(response.data); // Handle response data if needed
//       alert("Investigator Registered Successfully");
//       navigate("/Dashboard"); // Redirect to login page on successful signup
//     } catch (error) {
//       console.error("Signup error:", error); // Handle errors as needed
//       // Optionally display an error message to the user
//     }
//   };

//   return (
//     <div className="container flex items-center justify-center min-h-screen mx-auto">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>INVESTIGATOR</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="First Name" required />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name</FormLabel>
//                     <FormControl>
//                       <Input {...field} placeholder="Last Name" required />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Email"
//                         type="email"
//                         required
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Password"
//                         type="password"
//                         required
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="confirmPassword"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Confirm Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         placeholder="Confirm Password"
//                         type="password"
//                         required
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button type="submit" className="w-full">
//                 Sign Up
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//         {/* <CardFooter className="flex justify-center">
//           <p>
//             Already have an account?{" "}
//             <Link to="/" className="text-primary hover:underline">
//               Login
//             </Link>
//           </p>
//         </CardFooter> */}
//       </Card>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/UI/button";
import { Input } from "../Components/UI/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../Components/UI/form";
import { Calendar } from "../Components/UI/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Components/UI/popover";
import { CalendarIcon } from "lucide-react";
import axios from "axios";

export default function SignupPage() {
  const navigate = useNavigate();
  const form = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const role = localStorage.getItem("role");
      const formattedDob = new Date(data.dob).toISOString();
      const response = await axios.post(
        "http://localhost:3000/users/register",
        { ...data, dob: formattedDob, role },
        {
          headers: {
            "x-user-role": role,
          },
        }
      );

      console.log(response.data);
      alert("Investigator Registered Successfully");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>INVESTIGATOR SIGNUP</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="First Name" required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Last Name" required />
                    </FormControl>
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
                      <Input
                        {...field}
                        placeholder="Email"
                        type="email"
                        required
                      />
                    </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Phone Number" type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select {...field} required className="input">
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Age" type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-[240px] pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              field.value.toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Your date of birth is used to calculate your age.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
