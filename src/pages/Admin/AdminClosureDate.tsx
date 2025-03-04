import { useEffect, useState } from "react";
import { FormDataClosureDate, IClosureDate } from "../../app/MvObjects/clousuredate";
import { MvButton } from "../../components/MvButton";
import { getAllClosureDates, updateClosureDate, createClosureDate, deleteClosureDate } from "../../services/ClosureDateService";
import AdminLayout from "../../layout/AdminLayout";
import { MvDateInput, MvInput } from "../../components/MvInput";

export const AdminClosureDates = () => {
    const [closureDates, setClosureDates] = useState<IClosureDate[]>([]);
    const [formData, setFormData] = useState<Partial<IClosureDate>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null); // For handling errors

    // Fetch closure dates on component mount
    useEffect(() => {
        fetchClosureDates();
    }, []);
    
    const fetchClosureDates = async () => {
        try {
            const data = await getAllClosureDates();
            // Ensure data is an array, otherwise set an empty array and handle error
            if (Array.isArray(data)) {
                setClosureDates(data);
            } else {
                setClosureDates([]); // Fallback to empty array
                setError("Unexpected data format");
            }
        } catch (error) {
            console.error("Failed to fetch closure dates", error);
            setClosureDates([]); // Fallback to empty array in case of error
            setError("Failed to fetch closure dates");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Validate form data
        const closureDate = new Date(formData.closure_date as string);
        const finalClosureDate = new Date(formData.final_closure_date as string);
    
        if (!formData.closure_date || !formData.final_closure_date || !formData.academic_year_id) {
            setError("All fields are required.");
            return;
        }
    
        if (finalClosureDate < closureDate) {
            setError("Final Closure Date must be after or equal to Closure Date.");
            return;
        }

        // Create plain object instead of FormData
        const formDataObj: FormDataClosureDate = {
            closure_date: formData.closure_date as string,
            final_closure_date: formData.final_closure_date as string,
            academic_year_id: String(formData.academic_year_id) // Ensure this is a string
        };
    
        try {
            if (editingId) {
                // Update closure date
                await updateClosureDate(editingId, formDataObj);
            } else {
                // Create closure date
                await createClosureDate(formDataObj);
            }
    
            fetchClosureDates(); // Reload the list after the operation
            setFormData({}); // Clear form
            setEditingId(null); // Reset editing state
            setError(null); // Clear error
        } catch (error) {
            console.error("Failed to save closure date", error);
            setError("Failed to save closure date");
        }
    };

    const handleEdit = (closureDate: IClosureDate) => {
        setEditingId(closureDate.id);
        setFormData(closureDate); // Pre-fill form with the closure date to edit
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteClosureDate(id);
            fetchClosureDates(); // Refresh list after deletion
        } catch (error) {
            console.error("Failed to delete closure date", error);
            setError("Failed to delete closure date");
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-xl font-bold mb-4">Manage Closure Dates</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message display */}
            <div className="mb-4 p-4 border rounded-lg shadow">
                {/* Date Input for Closure Date */}
                <MvDateInput
                    name="closure_date"
                    label="Closure Date"
                    value={formData.closure_date || ""}
                    onChange={handleInputChange}
                />
                {/* Date Input for Final Closure Date */}
                <MvDateInput
                    name="final_closure_date"
                    label="Final Closure Date"
                    value={formData.final_closure_date || ""}
                    onChange={handleInputChange}
                />
                {/* Input for Academic Year */}
                <MvInput
                    type="number"
                    name="academic_year_id"
                    label="Academic Year"
                    value={formData.academic_year_id || ""}
                    onChange={handleInputChange}
                />
                <MvButton onClick={handleSubmit}>{editingId ? "Update" : "Create"}</MvButton>
            </div>

            {/* Table displaying all closure dates */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Closure Date</th>
                        <th className="border p-2">Final Closure Date</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {closureDates.length > 0 ? (
                        closureDates.map((closureDate: IClosureDate) => (
                            <tr key={closureDate.id} className="border">
                                <td className="border p-2">{closureDate.closure_date}</td>
                                <td className="border p-2">{closureDate.final_closure_date}</td>
                                <td className="border p-2 flex gap-2">
                                    <MvButton onClick={() => handleEdit(closureDate)}>Edit</MvButton>
                                    <MvButton onClick={() => handleDelete(closureDate.id)} className="bg-red-500">Delete</MvButton>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center p-4">No closure dates available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </AdminLayout>
    );
};
