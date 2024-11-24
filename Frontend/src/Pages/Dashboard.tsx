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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/UI/dialog";
import { PlusCircle, Edit2, Trash2, Ratio } from "lucide-react";
import UpdateEntryForm from "@/Components/UpdatedEntryForm";
import { RatioPieChart } from "@/Components/RatioPieChart";
import { MonthlyBarChart } from "@/Components/MonthlyBarChart";

const columns = [
  "caseId",
  "suspectName",
  "officerName",
  "caseDescription",
  "location",
  "fileUrl",
  "criminalId",
  "investigatorId",
] as const;

type ColumnType = (typeof columns)[number];

export default function FilterableDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<ColumnType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState("user");

  // Fetch data and user role on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/cases/getcases"
        );
        const formattedData = response.data.map((entry: any) => ({
          ...entry,
          caseId: entry.id,
          suspectName: `${entry.suspectFirstName} ${entry.suspectLastName}`,
          officerName: `${entry.officerFirstName} ${entry.officerLastName}`,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };

    fetchData();
    const user = localStorage.getItem("role") || "user";
    setUserRole(user);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/users/getusers"
        );
        const formattedUsers = response.data.map((user: any) => ({
          ...user,
          age: calculateAge(user.dob), // Convert dob to age
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateEntry = async (updatedEntry: any) => {
    try {
      // Filter only changed fields (ignoring fields that remain the same)
      const updatedFields = Object.keys(updatedEntry).reduce((acc, key) => {
        if (updatedEntry[key] !== selectedCase?.[key]) {
          acc[key] = updatedEntry[key];
        }
        return acc;
      }, {} as any);

      if (Object.keys(updatedFields).length > 0) {
        // Send only the updated fields in the PUT request
        const response = await axios.put(
          `/api/cases/${updatedEntry.caseId}`,
          updatedFields
        );
        if (response.status === 200) {
          // Handle successful update
          console.log("Case updated successfully", response.data);
          // Update the case in the local state with the response data
          setData((prevData) =>
            prevData.map((item) =>
              item.caseId === updatedEntry.caseId ? response.data : item
            )
          );
          setSelectedCase(response.data); // Update selected case after update
        }
      } else {
        console.log("No changes detected.");
      }
    } catch (error) {
      console.error("Error updating case", error);
    }
  };

  const handleColumnToggle = (column: ColumnType) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const handleDelete = async (id) => {
    console.log(id);
    // console.log("Request Headers:", req.headers);

    if (userRole !== "ADMIN") {
      alert("You are not authorized to delete cases.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this case?")) {
      try {
        await axios.delete(`http://localhost:3000/cases/deletecases/${id}`, {
          headers: {
            "x-user-role": "ADMIN", // Set x-user-role here
          },
        });

        setData((prevData) =>
          prevData.filter((caseItem) => caseItem.caseId !== id)
        );
      } catch (error) {
        console.error("Error deleting case:", error);
      }
    }
  };

  const handleEdit = (caseData: any) => {
    setSelectedCase(caseData);
    setEditDialogOpen(true);
  };
  console.log("selceted case json", selectedCase);

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
  const userColumns = [
    "id",
    "firstName",
    "lastName",
    "email",
    "role",
    "age",
    "phone",
    "gender",
  ] as const;
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="max-w-[100%] h-screen">
      <DashboardNavbar />
      {userRole === "ADMIN" && (
        <>
          <div className="flex justify-center space-x-4 border-slate-950 p-0 m-0">
            <RatioPieChart />
            <MonthlyBarChart />
          </div>
          <Card className="rounded-none border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Table className="h-screen">
                <TableHeader>
                  <TableRow>
                    {userColumns.map((column) => (
                      <TableHead key={column}>
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      {userColumns.map((column) => (
                        <TableCell key={`${index}-${column}`}>
                          {user[column]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

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
              </DialogHeader>
              <NewEntryForm
                onAddEntry={() => {}}
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
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(entry)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(entry.caseId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCase && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Case</DialogTitle>
            </DialogHeader>
            <UpdateEntryForm
              caseData={selectedCase}
              onUpdateEntry={handleUpdateEntry}
              onClose={() => setEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
