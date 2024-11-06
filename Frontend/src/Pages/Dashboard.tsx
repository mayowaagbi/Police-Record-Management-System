import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "../Components/UI/input";
import { Button } from "../Components/UI/button";
import { DashboardNavbar } from "../Components/dashboardNavBar";
import NewEntryForm from "../Components/NewEntryForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Components/UI/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../Components/UI/card";
import { Checkbox } from "../Components/UI/checkbox";
import { Label } from "../Components/UI/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/UI/dialog";
import { PlusCircle } from "lucide-react";

// Define your column structure here
const columns = [
  "caseId",
  "suspectFirstName",
  "suspectLastName",
  "officerFirstName",
  "officerLastName",
  "caseDescription",
  "location",
  "fileUrl",
  "criminalId",
  "investigatorId",
] as const;

type ColumnType = (typeof columns)[number];

export default function FilterableDashboard() {
  const [data, setData] = useState<any[]>([]); // Use `any` to accommodate various fields
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<ColumnType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    caseId: "",
    suspectFirstName: "",
    suspectLastName: "",
    officerFirstName: "",
    officerLastName: "",
    caseDescription: "",
    location: "",
    fileUrl: "",
  });

  const [userRole, setUserRole] = useState("user"); // Assume you get the user role somehow (e.g., from a context or authentication state)

  useEffect(() => {
    // Fetch cases from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/cases/getcases"
        );
        setData(response.data); // Assuming the response data is an array of case objects
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchData();
  }, []);

  const handleColumnToggle = (column: ColumnType) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const handleDelete = async (id: string) => {
    if (userRole !== "admin") {
      alert("You are not authorized to delete cases.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/cases/${id}`, {
        headers: { "x-user-role": userRole }, // Send the role as a header
      });
      setData(data.filter((caseItem) => caseItem.id !== id)); // Remove the deleted case from the list
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  };

  const filteredData = data.filter((entry) => {
    if (selectedColumns.length === 0) return true;

    return selectedColumns.some((column) => {
      const entryValue = entry[column];
      return (
        typeof entryValue === "string" &&
        entryValue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  });

  return (
    <div className="max-w-[100%] h-screen">
      <DashboardNavbar />
      <Card className="rounded-none border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Data Table</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add new entry</span>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Entry</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new entry to the table.
                </DialogDescription>
              </DialogHeader>

              <NewEntryForm
                onAddEntry={() => {
                  // Add your logic for adding a new entry
                }}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex flex-wrap gap-4">
              {columns.map((column) => (
                <div key={column} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column}`}
                    checked={selectedColumns.includes(column)}
                    onCheckedChange={() => handleColumnToggle(column)}
                  />
                  <Label htmlFor={`column-${column}`}>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Table className="h-screen">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                  </TableHead>
                ))}
                {userRole === "ADMIN" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody className="m-10">
              {filteredData.map((entry) => (
                <TableRow key={entry.caseId}>
                  {columns.map((column) => (
                    <TableCell key={`${entry.caseId}-${column}`}>
                      {entry[column]}
                    </TableCell>
                  ))}
                  {userRole === "ADMIN" && (
                    <TableCell>
                      <Button onClick={() => handleDelete(entry.caseId)}>
                        Delete
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// import { useState } from "react";
// import { Input } from "../Components/UI/input";
// import { Button } from "../Components/UI/button";
// import { DashboardNavbar } from "../Components/dashboardNavBar";
// import NewEntryForm from "../Components/NewEntryForm";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../Components/UI/table";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../Components/UI/card";
// import { Checkbox } from "../Components/UI/checkbox";
// import { Label } from "../Components/UI/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../Components/UI/dialog";
// import { PlusCircle } from "lucide-react";

// interface DataEntry {
//   caseId: number;
//   suspectName: string;
//   officerName: string;
//   interrogationDate: string;
//   role: string;
//   location: string;
//   files: string; // Add a field for files
// }

// const columns = [
//   "caseId",
//   "suspectName",
//   "officerName",
//   "interrogationDate",
//   "role",
//   "location",
//   "files",
// ] as const;

// type ColumnType = (typeof columns)[number];

// export default function FilterableDashboard() {
//   const [data, setData] = useState<DataEntry[]>([
//     {
//       caseId: 1,
//       suspectName: "John Doe",
//       officerName: "Officer A",
//       interrogationDate: "2024-10-01",
//       role: "Suspect",
//       location: "Location A",
//       files: "File1.pdf",
//     },
//     {
//       caseId: 2,
//       suspectName: "Jane Smith",
//       officerName: "Officer B",
//       interrogationDate: "2024-10-02",
//       role: "Suspect",
//       location: "Location B",
//       files: "File2.pdf",
//     },
//     // Add more entries as needed
//   ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedColumns, setSelectedColumns] = useState<ColumnType[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const [newEntry, setNewEntry] = useState({
//     caseId: "",
//     suspectName: "",
//     officerName: "",
//     interrogationDate: "",
//     role: "",
//     location: "",
//     files: "",
//   });

//   const handleNewEntryChange = (column: string, value: string) => {
//     setNewEntry((prev) => ({ ...prev, [column]: value }));
//   };
//   // const addNewEntry = (newEntry: any) => {
//   //   setData((prev) => [
//   //     ...prev,
//   //     {
//   //       caseId: Number(newEntry.caseId),
//   //       ...newEntry,
//   //     },
//   //   ]);
//   // };

//   const addNewEntry = () => {
//     if (
//       newEntry.caseId &&
//       newEntry.suspectName &&
//       newEntry.officerName &&
//       newEntry.interrogationDate &&
//       newEntry.role &&
//       newEntry.location &&
//       newEntry.files
//     ) {
//       setData((prev) => [
//         ...prev,
//         {
//           caseId: Number(newEntry.caseId),
//           ...newEntry,
//         },
//       ]);
//       setNewEntry({
//         caseId: "",
//         suspectfirstName: "",
//         suspectlastName: "",
//         officerfirstame: "",
//         officerlastname: "",
//         interrogationDate: "",
//         role: "",
//         location: "",
//         files: "",
//       });
//       setIsDialogOpen(false);
//     }
//   };

//   const handleColumnToggle = (column: ColumnType) => {
//     setSelectedColumns((prev) =>
//       prev.includes(column)
//         ? prev.filter((c) => c !== column)
//         : [...prev, column]
//     );
//   };

//   const filteredData = data.filter((entry) => {
//     if (selectedColumns.length === 0) return true;

//     return selectedColumns.some((column) => {
//       // Ensure entry[column] is a string before calling toLowerCase
//       const entryValue = entry[column];
//       return (
//         typeof entryValue === "string" &&
//         entryValue.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });
//   });
//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.delete(`http://localhost:3000/cases/${id}`, {
//         headers: {
//           "x-user-role": userRole, // Send the role as a header
//         },
//       });
//       console.log(response.data); // Log the response from the server
//       setCases(cases.filter((caseItem) => caseItem.id !== id)); // Remove the deleted case from the list
//     } catch (error) {
//       console.error("Error deleting case:", error);
//     }
//   };

//   return (
//     <div className="max-w-[100%] h-screen">
//       <DashboardNavbar />
//       <Card className="rounded-none border-0">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle>Data Table</CardTitle>
//           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//             <DialogTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <PlusCircle className="h-4 w-4" />
//                 <span className="sr-only">Add new entry</span>
//               </Button>
//             </DialogTrigger>

//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add New Entry</DialogTitle>
//                 <DialogDescription>
//                   Fill in the details to add a new entry to the table.
//                 </DialogDescription>
//               </DialogHeader>

//               {/* <div className="grid gap-4 py-4">
//                 {columns.map((column) => (
//                   <div
//                     key={column}
//                     className="grid grid-cols-4 items-center gap-4"
//                   >
//                     <Label htmlFor={column} className="text-right">
//                       {column.charAt(0).toUpperCase() + column.slice(1)}
//                     </Label>
//                     <Input
//                       id={column}
//                       value={newEntry[column]}
//                       onChange={(e) =>
//                         handleNewEntryChange(column, e.target.value)
//                       }
//                       className="col-span-3"
//                     />
//                   </div>
//                 ))}
//               </div> */}

//               <NewEntryForm
//                 onAddEntry={addNewEntry}
//                 onClose={() => setIsDialogOpen(false)}
//               />
//               {/* <DialogFooter>
//                 <Button onClick={addNewEntry}>Add Entry</Button>
//               </DialogFooter> */}
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent>
//           <div className="mb-4 space-y-4">
//             <Input
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <div className="flex flex-wrap gap-4">
//               {columns.map((column) => (
//                 <div key={column} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`column-${column}`}
//                     checked={selectedColumns.includes(column)}
//                     onCheckedChange={() => handleColumnToggle(column)}
//                   />
//                   <Label htmlFor={`column-${column}`}>
//                     {column.charAt(0).toUpperCase() + column.slice(1)}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <Table className="h-screen">
//             <TableHeader>
//               <TableRow>
//                 {columns.map((column) => (
//                   <TableHead key={column}>
//                     {column.charAt(0).toUpperCase() + column.slice(1)}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>

//             <TableBody className="m-10">
//               {filteredData.map((entry) => (
//                 <TableRow key={entry.caseId}>
//                   {columns.map((column) => (
//                     <TableCell key={`${entry.caseId}-${column}`}>
//                       {entry[column]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
