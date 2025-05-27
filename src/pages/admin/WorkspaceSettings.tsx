import React, { useState } from "react";
import {
    Shield,
    ArrowLeft
} from 'lucide-react';
import { Link } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";
import { useAuth } from "../../context/AuthContext";

const WorkspaceSettings: React.FC = () => {
    const { users, workspaces } = useWorkspace();
    const { user: currentUser } = useAuth();

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        subdomain: "",
        owner_id: "",
        selectedUsers: [] as string[]
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "selectedUsers") {
            if (e.target instanceof HTMLSelectElement) {
                const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                setFormData((prev) => ({
                    ...prev,
                    selectedUsers: selectedOptions,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleWorkspaceCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/workspaces", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    subdomain: formData.subdomain,
                    owner_id: formData.owner_id,
                    workspace_id: selectedWorkspaceId,
                    members: formData.selectedUsers.map((userId) => ({
                        userId,
                        role: "member", // or based on input
                    }))
                })
            });

        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        }
    };

    // Check if user is admin
    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
                <div className="text-center">
                    <Shield size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
                    <p className="text-gray-500 max-w-md mx-auto mt-2">
                        You don't have permission to access this page.
                    </p>
                    <Link
                        to="/admin"
                        className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block"
                    >
                        Back to Admin Panel
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="mb-6">
                <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Admin Panel
                </Link>
                <h1 className="text-2xl font-bold mb-1">Workspace Settings</h1>
                <p className="text-gray-600">Manager workspace, assign user to workspace</p>
            </div>


            {/* Workspace manage by admin part below */}
            <div className="col-span-4 p-6">
                <form onSubmit={handleWorkspaceCreate}>
                    <div>
                        <label htmlFor="workspaceSelect" className="block text-sm font-medium text-gray-700">
                            Select Existing Workspace (or leave empty to create new)
                        </label>
                        <select
                            id="workspaceSelect"
                            name="workspaceSelect"
                            value={selectedWorkspaceId}
                            onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                            className="block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                            <option value="">-- Create New Workspace --</option>
                            {workspaces?.map((ws) => (
                                <option key={ws.id} value={ws.id}>
                                    {ws.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-6">
                        {!selectedWorkspaceId && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Workspace Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={16} className="text-gray-400" />
                                </div> */}
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Workspace Description
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-400" />
                                </div> */}
                                        <input
                                            type="text"
                                            name="description"
                                            id="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                    {/* <p className="mt-1 text-xs text-gray-500">
                                Contact an administrator to change your email address.
                            </p> */}
                                </div>

                                <div>
                                    <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                                        Workspace Sub Domain
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase size={16} className="text-gray-400" />
                                </div> */}
                                        <input
                                            type="text"
                                            name="subdomain"
                                            id="subdomain"
                                            value={formData.subdomain}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700">
                                        Workspace Owner ID
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building size={16} className="text-gray-400" />
                                </div> */}
                                        <input
                                            type="text"
                                            name="owner_id"
                                            id="owner_id"
                                            value={formData.owner_id}
                                            onChange={handleInputChange}
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* i want to give select input to allow admin to attach multiple users to single workspace using users coming from useWorkspace */}
                        <div>
                            <label htmlFor="selectedUsers" className="block text-sm font-medium text-gray-700">
                                Attach Users
                            </label>
                            <select
                                name="selectedUsers"
                                id="selectedUsers"
                                multiple
                                value={formData.selectedUsers}
                                onChange={handleInputChange}
                                className="block w-full sm:text-sm border-gray-300 rounded-md h-32"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple users</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Create Workspace
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WorkspaceSettings;