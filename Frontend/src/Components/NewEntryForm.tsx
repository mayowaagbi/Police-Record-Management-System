import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./UI/input";
import { Button } from "./UI/button";
import { Textarea } from "./UI/textarea";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/form";

interface NewEntryFormProps {
  onAddEntry: (newEntry: any) => void;
  onClose: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onAddEntry, onClose }) => {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [userIds, setuserId] = useState("");
  const [newEntry, setNewEntry] = useState({
    userId: "",
    suspectFirstName: "",
    suspectLastName: "",
    officerFirstName: "",
    officerLastName: "",
    suspectRole: "",
    caseDescription: "",
    files: null as File | null, // Explicitly set the type to FileList | null
    location: "",
  });

  const form = useForm({
    defaultValues: newEntry,
  });

  // Fetch and set location and user data on load
  useEffect(() => {
    const firstName = localStorage.getItem("firstname");
    const lastName = localStorage.getItem("lastname");
    const userId = localStorage.getItem("id");

    if (firstName && lastName && userId) {
      setFirst(firstName);
      setSecond(lastName);
      setuserId(userId);

      setNewEntry((prev) => ({
        ...prev,
        userId: userId,
        officerFirstName: firstName,
        officerLastName: lastName,
      }));

      form.reset({
        ...form.getValues(),
        userId: userId,
        officerFirstName: firstName,
        officerLastName: lastName,
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = `Lat: ${latitude}, Lon: ${longitude}`;
        setNewEntry((prev) => ({ ...prev, location }));
        form.setValue("location", location);
      },
      (error) => {
        console.error("Error retrieving location:", error);
      }
    );
  }, [form]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    const userId = localStorage.getItem("id");
    console.log("Form Data:", data);

    // Append data to FormData
    Object.keys(data).forEach((key) => {
      if (key === "files" && data.files) {
        formData.append("files", data.files[0]); // Append single file
      } else {
        formData.append(key, data[key]);
      }
    });

    // Append userId to FormData
    formData.append("userId", userId);

    try {
      // const token = Cookies.get("token");
      // if (!token) {
      //   throw new Error("No token found in cookies");
      // }

      const response = await axios.post(
        "http://localhost:3000/cases/addcases",
        formData,
        {
          headers: {
            // Authorization: `Bearer ${token}`, // Use token from cookies
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Success:", response.data);
      onAddEntry(response.data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const suspectRoles = ["Witness", "Suspect", "Victim", "Informant"];

  return (
    <div className="grid gap-4 py-4 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 overflow-y-auto h-96"
        >
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Case ID"
                    {...field}
                    disabled
                    value={userIds || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Suspect First Name */}
          <FormField
            control={form.control}
            name="suspectFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Suspect First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Suspect Last Name */}
          <FormField
            control={form.control}
            name="suspectLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Suspect Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Officer First Name */}
          <FormField
            control={form.control}
            name="officerFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Officer First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Officer First Name"
                    value={first || ""}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Officer Last Name */}
          <FormField
            control={form.control}
            name="officerLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Officer Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Officer Last Name"
                    value={second || ""}
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Suspect Role */}
          <FormField
            control={form.control}
            name="suspectRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect Role</FormLabel>
                <FormControl>
                  <select {...field} className="border rounded-md p-2 w-full">
                    <option value="">Select Role</option>
                    {suspectRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Location" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Case Description */}
          <FormField
            control={form.control}
            name="caseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Case Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Files */}
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Files</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    placeholder="Upload a file"
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null; // Use the first file only
                      form.setValue("files", file); // Update with only one file
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewEntryForm;
