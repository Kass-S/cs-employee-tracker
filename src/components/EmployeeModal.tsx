'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import { addEmployee, updateEmployee } from '@/lib/services/employee-service';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { FaPlus } from 'react-icons/fa';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';


// Valid values for type: "Add" & "Edit"
const EmployeeModal = ({ type, employee, refreshEmployees }: { type: 'Add' | 'Edit', employee: Employee | null, refreshEmployees: () => Promise<void> }) => {

    // useStates
    const [jobTitleState, setJobTitleState] = useState<string>("");
    const [openModal, setOpenModal] = useState(false);
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: ""
    });

    const [token, setToken] = useState('');

    const disableBtn =
        employeeToChange.name.trim() != "" ||
        employeeToChange.jobTitle.trim() != "" &&
        employeeToChange.hireDate != "";

    // Modal Functions
    const onOpenModal = () => {
        if (type === "Edit") {
            setEmployeeToChange(employee as Employee);
        }
        if(type === "Add"){
            setJobTitleState("");
        }

        setOpenModal(true);
    };

    const onCloseModal = () => {
        setOpenModal(false);
        setEmployeeToChange({ id: 0, name: "", jobTitle: "", hireDate: "", details: "", status: "" });
    };

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };

    // Date functions
    const formatDateForInput = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDateFromInput = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Add & Edit function
    const handleEmployee = async () => {
        try {
            const employeeWithChanges = {
                ...employeeToChange,
                name: employeeToChange.name.trim(),
                jobTitle: employeeToChange.jobTitle.trim(),
            };

            if (type === "Add") {
                if (await addEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            } else {
                if (await updateEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            }

            setEmployeeToChange({
                id: 0,
                name: "",
                jobTitle: "",
                hireDate: "",
                details: "",
                status: ""
            });
        } catch (error) {
            console.log("error", error);
        }

        onCloseModal();
    };

    useEffect(() => {
        const handleToken = async () => {
            if (localStorage.getItem('user')) {
                setToken(await JSON.parse(localStorage.getItem('user')!).token);
            }
            if (sessionStorage.getItem('user')) {
                setToken(await JSON.parse(sessionStorage.getItem('user')!).token);
            }
        }

        handleToken();
    }, []);


    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
                {/* <Button variant="outline">Edit Profile</Button> */}
                <Button
                    color="success"
                    className={type === "Add" ? "flex items-center gap-1" : ""}
                    onClick={onOpenModal}
                >
                    {type === "Add" ? <FaPlus className="mt-[0.2rem]" /> : "Edit"}
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[40rem]'>
                <DialogHeader className='pb-3'>
                    <DialogTitle>
                        {type === "Add"
                            ? "Add New Employee"
                            : "Update Employee Information"}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 min-h-[30rem]">
                    <div>
                        <div className='pb-5'>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Employee name</Label>
                            </div>
                            <Input
                                id="name"
                                value={employeeToChange.name}
                                onChange={handleEmployeeToChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="jobTitle">Job title</Label>
                            </div>
                            
                            <DropdownMenu>
                            {/* make this work */}
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="text-sm font-normal cursor-pointer w-[14.1rem] flex justify-start" >
                                       
                                       {type === "Add" ? jobTitleState : employeeToChange.jobTitle}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='z-1 bg-white rounded-md p-1 px-2 border-1 border-gray-200'>
                                    <DropdownMenuItem className='cursor-pointer py-1' onClick={() => {
                                    setJobTitleState("Customer Support");
                                    setEmployeeToChange(prev => ({ ...prev, jobTitle: "Customer Support" }));
                                    }} >Customer Support</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer py-1' onClick={() => {
                                    setJobTitleState("IT Support Specialist");
                                    setEmployeeToChange(prev => ({ ...prev, jobTitle: "IT Support Specialist" }));
                                    }} >IT Support Specialist</DropdownMenuItem>
                                    <DropdownMenuItem className='cursor-pointer py-1'  onClick={() => {
                                    setJobTitleState("Software Engineer");
                                    setEmployeeToChange(prev => ({ ...prev, jobTitle: "Software Engineer" }));
                                    }} >Software Engineer</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label>Date hired</Label>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !employeeToChange.hireDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {employeeToChange.hireDate ? employeeToChange.hireDate : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={formatDateForInput(employeeToChange.hireDate)}
                                    onSelect={(e) =>
                                        handleEmployeeToChangeHireDate(formatDateFromInput(e))
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            onClick={handleEmployee}
                            color="success"
                            disabled={!disableBtn}
                        >
                            {type === "Add" ? "Add" : "Update"} Employee
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EmployeeModal