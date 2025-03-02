import { useEffect, useState } from "react";
import { IClosureDate } from "../../app/MvObjects/clousuredate";
import { MvButton } from "../../components/MvButton";

import { getAllClosureDates, updateClosureDate, createClosureDate, deleteClosureDate } from "../../services/ClosureDateService";
import AdminLayout from "../../layout/AdminLayout";
import { MvDateInput } from "../../components/MvInput";

export const AdminClosureDates = () => {
    const [closureDates, setClosureDates] = useState<IClosureDate[]>([]);
    const [formData, setFormData] = useState<Partial<IClosureDate>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchClosureDates();
    }, []);

    const fetchClosureDates = async () => {
        try {
            const data = await getAllClosureDates();
            setClosureDates(data);
        } catch (error) {
            console.error("Failed to fetch closure dates", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await updateClosureDate(editingId, formData);
            } else {
                await createClosureDate(formData);
            }
            fetchClosureDates();
            setFormData({});
            setEditingId(null);
        } catch (error) {
            console.error("Failed to save closure date", error);
        }
    };

    const handleEdit = (closureDate: IClosureDate) => {
        setEditingId(closureDate.id);
        setFormData(closureDate);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteClosureDate(id);
            fetchClosureDates();
        } catch (error) {
            console.error("Failed to delete closure date", error);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-xl font-bold mb-4">Manage Closure Dates</h1>
            <div className="mb-4 p-4 border rounded-lg shadow">
                {/* Replace MvInput with MvDateInput */}
                <MvDateInput
                    name="closure_date"
                    label="Closure Date"
                    value={formData.closure_date || ""}
                    onChange={handleInputChange}
                />
                <MvDateInput
                    name="final_closure_date"
                    label="Final Closure Date"
                    value={formData.final_closure_date || ""}
                    onChange={handleInputChange}
                />
                <MvButton onClick={handleSubmit}>{editingId ? "Update" : "Create"}</MvButton>
            </div>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Closure Date</th>
                        <th className="border p-2">Final Closure Date</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {closureDates.map((closureDate) => (
                        <tr key={closureDate.id} className="border">
                            <td className="border p-2">{closureDate.closure_date}</td>
                            <td className="border p-2">{closureDate.final_closure_date}</td>
                            <td className="border p-2 flex gap-2">
                                <MvButton onClick={() => handleEdit(closureDate)}>Edit</MvButton>
                                <MvButton onClick={() => handleDelete(closureDate.id)} className="bg-red-500">Delete</MvButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
};
