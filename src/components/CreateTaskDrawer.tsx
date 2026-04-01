import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpringButton } from "@/components/SpringButton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockGroups, type Priority, type TaskStatus } from "@/stores/mockData";

interface CreateTaskDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (task: {
    title: string;
    description: string;
    unit: string;
    assignedTo: string[];
    priority: Priority;
    status: TaskStatus;
    deadline: Date;
    allowLateSubmission: boolean; // <-- Our new rule!
  }) => Promise<unknown>;
  isCreating: boolean;
}

export function CreateTaskDrawer({ open, onOpenChange, onCreate, isCreating }: CreateTaskDrawerProps) {
  // 1. Our Restored & Upgraded Memory (State)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority>("medium");
  const [deadline, setDeadline] = useState<Date | undefined>();

  // Our new Database Guard (Starts as false/unchecked)
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);

  // Our 4-Level Cascade Memory
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");

  // 2. Our Upgraded Academic Map
  const academicStructure: Record<string, any> = {
    "School of Engineering": {
      "Computer Science": {
        "Frontend Architecture": ["Unit 1: React Basics", "Unit 2: Tailwind Styling"],
        "Backend Systems": ["Unit 1: Node.js", "Unit 2: Databases"]
      }
    },
    "School of Business": {
      "Management": {
        "Leadership 101": ["Unit 1: Team Dynamics", "Unit 2: Conflict Resolution"]
      }
    },
    "School of Design": {
      "Interactive Media": {
        "Product Design 101": ["Unit 1: Wireframing", "Unit 2: User Testing"]
      }
    }
  };

  const toggleGroup = (gId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(gId) ? prev.filter((g) => g !== gId) : [...prev, gId]
    );
  };

  const assignedMembers = mockGroups
    .filter((g) => selectedGroups.includes(g.id))
    .flatMap((g) => g.members);

  // 3. Fully Wired Submit Function
  const handleSubmit = async () => {
    if (!title || !selectedUnit || !deadline) return;
    
    await onCreate({
      title,
      description,
      unit: selectedUnit,
      assignedTo: [...new Set(assignedMembers)],
      priority,
      status: "todo",
      deadline,
      allowLateSubmission, // <-- We add it to the package here!
    });
    
    setTitle("");
    setDescription("");
    setSelectedSchool("");
    setSelectedDepartment("");
    setSelectedCourse("");
    setSelectedUnit("");
    setSelectedGroups([]);
    setPriority("medium");
    setDeadline(undefined);
    setAllowLateSubmission(false); // <-- We clear the memory here!
    onOpenChange(false);
  };

  const priorityColors: Record<Priority, string> = {
    high: "bg-destructive/10 text-destructive border-destructive/30",
    medium: "bg-status-pending/10 text-status-pending border-status-pending/30",
    low: "bg-status-graded/10 text-status-graded border-status-graded/30",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-xl">Create Task</SheetTitle>
          <SheetDescription>Assign work to your students and teams.</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* 4. The 4-Level Academic Hierarchy UI */}
          <div className="space-y-4 border border-border/50 p-4 rounded-2xl bg-muted/20">
            {/* School */}
            <div className="space-y-2">
              <Label>School</Label>
              <Select value={selectedSchool} onValueChange={(val) => {
                setSelectedSchool(val);
                setSelectedDepartment("");
                setSelectedCourse(""); 
                setSelectedUnit("");   
              }}>
                <SelectTrigger aria-label="Select school" className="rounded-2xl">
                  <SelectValue placeholder="Select a school..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Object.keys(academicStructure).map((school) => (
                    <SelectItem key={school} value={school}>{school}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Select disabled={!selectedSchool} value={selectedDepartment} onValueChange={(val) => {
                setSelectedDepartment(val);
                setSelectedCourse(""); 
                setSelectedUnit("");   
              }}>
                <SelectTrigger aria-label="Select department" className="rounded-2xl">
                  <SelectValue placeholder="Select a department..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {selectedSchool && Object.keys(academicStructure[selectedSchool]).map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course */}
            <div className="space-y-2">
              <Label>Course</Label>
              <Select disabled={!selectedDepartment} value={selectedCourse} onValueChange={(val) => {
                setSelectedCourse(val);
                setSelectedUnit(""); 
              }}>
                <SelectTrigger aria-label="Select course" className="rounded-2xl">
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {selectedSchool && selectedDepartment && Object.keys(academicStructure[selectedSchool][selectedDepartment]).map((course) => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select disabled={!selectedCourse} value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger aria-label="Select unit" className="rounded-2xl">
                  <SelectValue placeholder="Select a unit..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {selectedSchool && selectedDepartment && selectedCourse && academicStructure[selectedSchool][selectedDepartment][selectedCourse].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Research Proposal Draft"
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description (Markdown)</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the task requirements..."
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* Assign to Group */}
          <div className="space-y-2">
            <Label>Assign to Team / Group</Label>
            <div className="flex flex-wrap gap-2">
              {mockGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggleGroup(g.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
                    selectedGroups.includes(g.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                  aria-label={`Toggle ${g.name}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition-all",
                    priority === p
                      ? priorityColors[p]
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                  aria-label={`Set priority ${p}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Database Guard: Late Submission */}
          <div className="space-y-2">
            <Label>Submission Rules</Label>
            <button
              type="button"
              onClick={() => setAllowLateSubmission(!allowLateSubmission)}
              className={cn(
                "w-full flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all",
                allowLateSubmission
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              <span>Allow Late Submissions</span>
              <div className={cn(
                "h-5 w-5 rounded-lg border flex items-center justify-center transition-colors",
                allowLateSubmission ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 text-transparent"
              )}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
            <p className="text-xs text-muted-foreground pl-1">
              If enabled, students can submit after the deadline but will be flagged in the database as "Late".
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <SpringButton variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </SpringButton>
            <SpringButton
              onClick={handleSubmit}
              disabled={!title || !selectedUnit || !deadline || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </SpringButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}