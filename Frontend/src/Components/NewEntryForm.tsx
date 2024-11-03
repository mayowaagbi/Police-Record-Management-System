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

interface NewEntryFormProps {
  onAddEntry: (newEntry: any) => void;
  onClose: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onAddEntry, onClose }) => {
  // const { control, handleSubmit, reset } = useForm();
  const form = useForm();
  const [newEntry, setNewEntry] = useState({
    caseId: "",
    suspectFirstName: "",
    suspectLastName: "",
    officerFirstName: "",
    officerLastName: "",
    suspectRole: "",
    caseDescription: "",
    files: "",
    location: "",
  });

  const handleChange = (field: string, value: string) => {
    setNewEntry((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = () => {
    if (
      newEntry.caseId &&
      newEntry.suspectFirstName &&
      newEntry.suspectLastName &&
      newEntry.officerFirstName &&
      newEntry.officerLastName &&
      newEntry.suspectRole &&
      newEntry.caseDescription &&
      newEntry.files
    ) {
      onAddEntry(newEntry);
      form.reset();
      onClose();
    }
  };
  const suspectRoles = ["Witness", "Suspect", "Victim", "Informant"];
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setNewEntry((prev) => ({
          ...prev,
          location: `Lat: ${latitude}, Lon: ${longitude}`,
        }));
      },
      (error) => {
        console.error("Error retrieving location:", error);
      }
    );
  }, []);

  return (
    <div className="grid gap-4 py-4 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 overflow-y-auto h-96 "
        >
          {/* <FormField
            control={form.control}
            name="caseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Case ID"
                    {...field}
                    value={newEntry.caseId}
                    onChange={(e) => handleChange("caseId", e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="suspectFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Suspect First Name"
                    {...field}
                    value={newEntry.suspectFirstName}
                    onChange={(e) =>
                      handleChange("suspectFirstName", e.target.value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suspectLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Suspect Last Name"
                    {...field}
                    value={newEntry.suspectLastName}
                    onChange={(e) =>
                      handleChange("suspectLastName", e.target.value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officerFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Officer First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Officer First Name"
                    {...field}
                    value={newEntry.officerFirstName}
                    onChange={(e) =>
                      handleChange("officerFirstName", e.target.value)
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="officerLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Officer Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Officer Last Name"
                    {...field}
                    value={newEntry.officerLastName}
                    onChange={(e) =>
                      handleChange("officerLastName", e.target.value)
                    }
                    disabled
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="suspectRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Suspect Role</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    value={newEntry.suspectRole}
                    onChange={(e) =>
                      handleChange("suspectRole", e.target.value)
                    }
                    className="border rounded-md p-2  w-full"
                  >
                    <option className="" value="">
                      Select Role
                    </option>
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

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Location"
                    {...field}
                    value={newEntry.location}
                    disabled
                    className="bg-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Case Description"
                    {...field}
                    value={newEntry.caseDescription}
                    onChange={(e) =>
                      handleChange("caseDescription", e.target.value)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Files</FormLabel>
                <FormControl>
                  <Input
                    type="file" // Change to type "file" if uploading files
                    placeholder="Upload files"
                    {...field}
                    onChange={(e) => handleChange("files", e.target.value)}
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
