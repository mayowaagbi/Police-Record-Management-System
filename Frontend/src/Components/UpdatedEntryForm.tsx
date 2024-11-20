import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./UI/input";
import { Button } from "./UI/button";
import { Textarea } from "./UI/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/form";
import axios from "axios";

interface CaseUpdateData {
  caseId: string;
  suspectFirstName: string;
  suspectLastName: string;
  officerFirstName: string;
  officerLastName: string;
  suspectRole: string;
  caseDescription: string;
  files: File | null;
  location: string;
  investigatorId: string;
}

interface UpdateEntryFormProps {
  caseData: CaseUpdateData;
  onUpdateEntry: (updatedEntry: CaseUpdateData) => void;
  onClose: () => void;
}

const UpdateEntryForm: React.FC<UpdateEntryFormProps> = ({
  caseData,
  onUpdateEntry,
  onClose,
}) => {
  const [originalData, setOriginalData] = useState<CaseUpdateData>(caseData);

  const form = useForm({
    defaultValues: caseData, // Prepopulate the form with caseData
  });

  // Handle form submission
  const onSubmit = async (data: CaseUpdateData) => {
    console.log("updates", data);
    try {
      // Ensure we have the original data available
      if (!originalData) {
        console.error("Original data is not available");
        return;
      }

      // Prepare the updated data by merging originalData and updated fields
      const updatedData = Object.keys(data).reduce((acc, key) => {
        // If the field is dirty (changed), add it to the updated data
        if (form.formState.dirtyFields[key]) {
          acc[key] = data[key];
        } else {
          // If the field is not dirty (unchanged), use the original value
          acc[key] = originalData[key];
        }
        return acc;
      }, {} as CaseUpdateData);

      console.log("updatedData", updatedData);

      // Send the updated data to the backend (replace with your API endpoint)
      const response = await axios.put(
        `http://localhost:3000/cases/updatecases/${data.caseId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-user-role": "ADMIN",
          },
        }
      );

      if (response.status === 200) {
        // If update is successful, notify parent component and close the form
        onUpdateEntry(updatedData);
        onClose();
      } else {
        throw new Error("Failed to update the case");
      }
    } catch (error) {
      console.error("Error updating case:", error);
      // Optionally, handle error state here
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
          {/* Inspector ID */}
          <FormField
            control={form.control}
            name="investigatorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inspector ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder="Inspector ID"
                    value={caseData.investigatorId || ""}
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
                    disabled
                    value={caseData.officerFirstName || ""}
                    placeholder="Officer First Name"
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
                    disabled
                    value={caseData.officerLastName || ""}
                    placeholder="Officer Last Name"
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
                      const file = e.target.files ? e.target.files[0] : null;
                      form.setValue("files", file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateEntryForm;
