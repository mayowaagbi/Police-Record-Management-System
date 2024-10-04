import { useState } from "react";
import { Input } from "../Components/UI/input";
import { Button } from "../Components/UI/button";
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

interface DataEntry {
  caseId: number;
  suspectName: string;
  officerName: string;
  interrogationDate: string;
  role: string;
  location: string;
  files: string; // Add a field for files
}

const columns = [
  "caseId",
  "suspectName",
  "officerName",
  "interrogationDate",
  "role",
  "location",
  "files",
] as const;

type ColumnType = (typeof columns)[number];

export default function FilterableDashboard() {
  const [data, setData] = useState<DataEntry[]>([
    {
      caseId: 1,
      suspectName: "John Doe",
      officerName: "Officer A",
      interrogationDate: "2024-10-01",
      role: "Suspect",
      location: "Location A",
      files: "File1.pdf",
    },
    {
      caseId: 2,
      suspectName: "Jane Smith",
      officerName: "Officer B",
      interrogationDate: "2024-10-02",
      role: "Suspect",
      location: "Location B",
      files: "File2.pdf",
    },
    // Add more entries as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<ColumnType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newEntry, setNewEntry] = useState({
    caseId: "",
    suspectName: "",
    officerName: "",
    interrogationDate: "",
    role: "",
    location: "",
    files: "",
  });

  const handleNewEntryChange = (column: string, value: string) => {
    setNewEntry((prev) => ({ ...prev, [column]: value }));
  };

  const addNewEntry = () => {
    if (
      newEntry.caseId &&
      newEntry.suspectName &&
      newEntry.officerName &&
      newEntry.interrogationDate &&
      newEntry.role &&
      newEntry.location &&
      newEntry.files
    ) {
      setData((prev) => [
        ...prev,
        {
          caseId: Number(newEntry.caseId),
          ...newEntry,
        },
      ]);
      setNewEntry({
        caseId: "",
        suspectName: "",
        officerName: "",
        interrogationDate: "",
        role: "",
        location: "",
        files: "",
      });
      setIsDialogOpen(false);
    }
  };

  const handleColumnToggle = (column: ColumnType) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  const filteredData = data.filter((entry) => {
    if (selectedColumns.length === 0) return true;

    return selectedColumns.some((column) => {
      // Ensure entry[column] is a string before calling toLowerCase
      const entryValue = entry[column];
      return (
        typeof entryValue === "string" &&
        entryValue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  });

  return (
    <div className="max-w-[100%] bg-black h-screen">
      <Card>
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

              <div className="grid gap-4 py-4">
                {columns.map((column) => (
                  <div
                    key={column}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={column} className="text-right">
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </Label>
                    <Input
                      id={column}
                      value={newEntry[column]}
                      onChange={(e) =>
                        handleNewEntryChange(column, e.target.value)
                      }
                      className="col-span-3"
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={addNewEntry}>Add Entry</Button>
              </DialogFooter>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
