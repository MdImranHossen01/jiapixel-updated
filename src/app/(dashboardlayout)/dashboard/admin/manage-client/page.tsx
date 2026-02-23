"use client";

import React, { useState, useEffect } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';
import Image from 'next/image';
import { Edit2, Trash2, X, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
interface Client {
    _id: string;
    name: string;
    clientImage: string;
    country?: string;
    website?: string;
    socialLinks: {
        linkedin?: string;
        whatsapp?: string[];
        facebook?: string;
        instagram?: string;
        youtube?: string;
    };
    service: string;
    price: number;
    renewDate: string;
    lastContacted?: string;
    email: string[];
    customOrders?: any[];
}

export default function ManageClientPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('all');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        price: '',
        renewDate: '',
        lastContacted: '',
        email: '', // Comma separated string for input
        country: '',
        website: '',
        linkedin: '',
        whatsapp: '', // Comma separated string for input
        facebook: '',
        instagram: '',
        youtube: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients');
            const data = await res.json();
            if (data.success) {
                setClients(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch clients', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (client: Client) => {
        setEditingClient(client);
        setFormData({
            name: client.name,
            service: client.service,
            price: String(client.price),
            renewDate: client.renewDate ? new Date(client.renewDate).toISOString().split('T')[0] : '',
            lastContacted: client.lastContacted ? new Date(client.lastContacted).toISOString().split('T')[0] : '',
            email: client.email.join(', '),
            country: client.country || '',
            website: client.website || '',
            linkedin: client.socialLinks.linkedin || '',
            whatsapp: client.socialLinks.whatsapp ? client.socialLinks.whatsapp.join(', ') : '',
            facebook: client.socialLinks.facebook || '',
            instagram: client.socialLinks.instagram || '',
            youtube: client.socialLinks.youtube || '',
        });
        setImagePreview(client.clientImage);
        setImageFile(null); // Reset file input
        setShowForm(true);
        // Scroll to form (optional)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id: string) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            const res = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setClients(clients.filter(c => c._id !== id));
            } else {
                alert('Failed to delete client: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting client', error);
            alert('An error occurred during deletion');
        }
    };

    const handleViewClient = (client: Client) => {
        setSelectedClient(client);
        setIsDetailsOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            let imageUrl = editingClient ? editingClient.clientImage : '';

            if (imageFile) {
                const imgRes = await uploadToImgBB(imageFile);
                imageUrl = imgRes.data.url;
            } else if (!imageUrl) {
                alert('Please upload an image');
                setSubmitting(false);
                return;
            }

            // Process arrays
            const emailArray = formData.email.split(',').map(item => item.trim()).filter(item => item !== '');
            const whatsappArray = formData.whatsapp.split(',').map(item => item.trim()).filter(item => item !== '');

            if (emailArray.length === 0) {
                alert('Please provide at least one email');
                setSubmitting(false);
                return;
            }

            const payload = {
                name: formData.name,
                clientImage: imageUrl,
                service: formData.service,
                price: Number(formData.price),
                renewDate: formData.renewDate,
                // If they clear the date, formData.lastContacted is "". Default back to now.
                lastContacted: formData.lastContacted ? new Date(formData.lastContacted).toISOString() : new Date().toISOString(),
                country: formData.country,
                website: formData.website,
                email: emailArray,
                socialLinks: {
                    linkedin: formData.linkedin,
                    whatsapp: whatsappArray,
                    facebook: formData.facebook,
                    instagram: formData.instagram,
                    youtube: formData.youtube,
                }
            };

            let res;
            if (editingClient) {
                res = await fetch(`/api/clients/${editingClient._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch('/api/clients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const data = await res.json();

            if (data.success) {
                fetchClients();
                setShowForm(false);
                resetForm();
            } else {
                alert(`Failed to ${editingClient ? 'update' : 'create'} client: ` + data.error);
            }
        } catch (error) {
            console.error('Error submitting form', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            service: '',
            price: '',
            renewDate: '',
            lastContacted: '',
            email: '',
            country: '',
            website: '',
            linkedin: '',
            whatsapp: '',
            facebook: '',
            instagram: '',
            youtube: '',
        });
        setImageFile(null);
        setImagePreview(null);
        setEditingClient(null);
    };

    const cancelForm = () => {
        setShowForm(false);
        resetForm();
    }

    if (loading) return <div className="p-8 text-center">Loading clients...</div>;

    // Search & Filtering Logic
    const filteredClients = clients.filter(client => {
        // Search Match (Name or Service)
        const matchesSearch =
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.service.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter Match (Last Contacted)
        let matchesFilter = true;

        if (filterLevel !== 'all') {
            if (!client.lastContacted) {
                // If they have no contact date, they only show up under 'all' or if we want to treat them as overdue
                matchesFilter = filterLevel === 'overdue' || filterLevel === 'need_contact';
            } else {
                const diffDays = Math.floor((new Date().getTime() - new Date(client.lastContacted).getTime()) / (1000 * 60 * 60 * 24));

                if (filterLevel === 'today') {
                    matchesFilter = diffDays === 0;
                } else if (filterLevel === 'within_30') {
                    matchesFilter = diffDays > 0 && diffDays <= 30;
                } else if (filterLevel === 'need_contact') {
                    matchesFilter = diffDays > 60 && diffDays <= 90;
                } else if (filterLevel === 'overdue') {
                    matchesFilter = diffDays > 90;
                }
            }
        }

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Clients</h1>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Add New Client
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border relative">
                    <button
                        onClick={cancelForm}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>

                    <h2 className="text-xl font-semibold mb-4">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Client Name</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="John Doe" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Emails (comma separated)</label>
                                <input required type="text" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" placeholder="john@example.com, work@example.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border p-2 rounded" placeholder="USA" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Service</label>
                                <input required type="text" name="service" value={formData.service} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Web Development" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Price</label>
                                <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" placeholder="1000" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Renew Date</label>
                                <input required type="date" name="renewDate" value={formData.renewDate} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Last Contacted</label>
                                <input type="date" name="lastContacted" value={formData.lastContacted} onChange={handleChange} className="w-full border p-2 rounded" />
                                <p className="text-xs text-muted-foreground mt-1">Leave empty to default to today.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Client Image</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
                                {imagePreview && (
                                    <div className="mt-2 relative w-24 h-24">
                                        <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-md" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Links & Web */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-700">Online Presence</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">Website</label>
                                <input type="text" name="website" value={formData.website} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://example.com" />
                            </div>

                            <h3 className="font-medium text-gray-700 pt-2">Social Links</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1">WhatsApp Numbers (comma separated)</label>
                                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full border p-2 rounded" placeholder="+1234567890, +0987654321" />
                                <p className="text-xs text-gray-500">Include country code without spaces (e.g., +123...)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">LinkedIn</label>
                                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://linkedin.com/..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Facebook</label>
                                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://facebook.com/..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Instagram</label>
                                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://instagram.com/..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">YouTube</label>
                                <input type="text" name="youtube" value={formData.youtube} onChange={handleChange} className="w-full border p-2 rounded" placeholder="https://youtube.com/..." />
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : (editingClient ? 'Update Client' : 'Save Client')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters and Search Bar */}
            <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by name or service..."
                        className="pl-9 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                        <SelectTrigger className="w-full md:w-[220px] bg-white">
                            <SelectValue placeholder="Filter by Contact Date" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Clients</SelectItem>
                            <SelectItem value="today">Contacted Today</SelectItem>
                            <SelectItem value="within_30">Contacted within 30 Days</SelectItem>
                            <SelectItem value="need_contact">Needs Contact (&gt;60 Days)</SelectItem>
                            <SelectItem value="overdue">Overdue (&gt;90 Days)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Client List Table */}
            <div className="bg-white rounded-md border text-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Client</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Renew Date</TableHead>
                            <TableHead>Last Contacted</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredClients.length === 0 && !loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredClients.map((client) => (
                                <TableRow key={client._id}>
                                    <TableCell>
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                                            <Image src={client.clientImage} alt={client.name} fill className="object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium cursor-pointer hover:underline text-primary" onClick={() => handleViewClient(client)}>
                                        {client.name}
                                        {client.country && <span className="text-xs text-muted-foreground block font-normal no-underline">{client.country}</span>}
                                    </TableCell>
                                    <TableCell>{client.service}</TableCell>
                                    <TableCell>${client.price}</TableCell>
                                    <TableCell>{client.renewDate ? new Date(client.renewDate).toLocaleDateString() : 'N/A'}</TableCell>
                                    <TableCell>
                                        {client.lastContacted ? (
                                            (() => {
                                                const diffDays = Math.floor((new Date().getTime() - new Date(client.lastContacted).getTime()) / (1000 * 60 * 60 * 24));
                                                let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";

                                                if (diffDays < 0) {
                                                    return (
                                                        <Badge variant="default">
                                                            In {Math.abs(diffDays)} days
                                                        </Badge>
                                                    );
                                                }

                                                if (diffDays > 90) badgeVariant = "destructive"; // Over 3 months
                                                else if (diffDays > 60) badgeVariant = "outline"; // Pushing 3 months

                                                return (
                                                    <Badge variant={badgeVariant}>
                                                        {diffDays === 0 ? "Today" : `${diffDays} days ago`}
                                                    </Badge>
                                                )
                                            })()
                                        ) : (
                                            <Badge variant="secondary">N/A</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {client.customOrders ? client.customOrders.length : 0} Orders
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewClient(client)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditClick(client)}>
                                                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:bg-red-50"
                                                    onClick={() => handleDeleteClick(client._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* View Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Client Details</DialogTitle>
                        <DialogDescription>
                            Detailed breakdown of the client&apos;s information and custom orders.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedClient && (
                        <div className="space-y-6 mt-4">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                                    <Image src={selectedClient.clientImage} alt={selectedClient.name} fill className="object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                                    <p className="text-primary font-medium">{selectedClient.service}</p>
                                    {selectedClient.country && <p className="text-muted-foreground text-sm">{selectedClient.country}</p>}
                                </div>
                            </div>

                            {/* Contact & Billing Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border">
                                <div>
                                    <strong className="block mb-1 text-muted-foreground">Emails</strong>
                                    {(Array.isArray(selectedClient.email) ? selectedClient.email : [selectedClient.email]).map((email: string, idx: number) => (
                                        <a key={idx} href={`mailto:${email}`} className="text-blue-600 hover:underline block">{email}</a>
                                    ))}
                                </div>
                                <div>
                                    <strong className="block mb-1 text-muted-foreground">Billing Info</strong>
                                    <p>Price: ${selectedClient.price}</p>
                                    <p>Renews: {selectedClient.renewDate ? new Date(selectedClient.renewDate).toLocaleDateString() : 'N/A'}</p>
                                    <p>Last Contact: {selectedClient.lastContacted ? new Date(selectedClient.lastContacted).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                {selectedClient.website && (
                                    <div className="col-span-2 mt-2">
                                        <strong className="block mb-1 text-muted-foreground">Website</strong>
                                        <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedClient.website}</a>
                                    </div>
                                )}
                            </div>

                            {/* Social Links */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Social Links</h3>
                                <div className="flex flex-wrap gap-3 text-sm">
                                    {selectedClient.socialLinks?.linkedin && <a href={selectedClient.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                                    {selectedClient.socialLinks?.whatsapp && (Array.isArray(selectedClient.socialLinks.whatsapp) ? selectedClient.socialLinks.whatsapp : [selectedClient.socialLinks.whatsapp]).map((wa: string, idx: number, arr: any[]) => (
                                        <a key={idx} href={`https://wa.me/${wa.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                                            WhatsApp {arr.length > 1 ? idx + 1 : ''}
                                        </a>
                                    ))}
                                    {selectedClient.socialLinks?.facebook && <a href={selectedClient.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">Facebook</a>}
                                    {selectedClient.socialLinks?.instagram && <a href={selectedClient.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>}
                                    {selectedClient.socialLinks?.youtube && <a href={selectedClient.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">YouTube</a>}
                                </div>
                            </div>

                            {/* Custom Orders */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 pt-4 border-t">Custom Orders ({selectedClient.customOrders ? selectedClient.customOrders.length : 0})</h3>
                                {selectedClient.customOrders && selectedClient.customOrders.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedClient.customOrders.map((order: any, idx: number) => (
                                            <div key={idx} className="bg-muted p-3 rounded-md border flex flex-col gap-1">
                                                <div className="flex justify-between items-start">
                                                    <Link href={`/proposal/${order.shareableSlug}`} className="text-blue-600 hover:underline font-semibold leading-tight line-clamp-1 max-w-[70%]" title={order.title}>
                                                        {order.title}
                                                    </Link>
                                                    <Badge variant={order.status === 'accepted' ? 'default' : 'secondary'} className="capitalize shrink-0">
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                                    <span>Renews: {order.renewDate ? new Date(order.renewDate).toLocaleDateString() : 'N/A'}</span>
                                                    {order.renewPrice !== undefined && order.renewPrice !== null && (
                                                        <span>Price: ${order.renewPrice}</span>
                                                    )}
                                                </div>
                                                {order.adminNote && (
                                                    <div className="mt-2 text-xs italic text-orange-700 bg-orange-50 p-2 rounded border border-orange-100">
                                                        Note: {order.adminNote}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No custom orders found for this client.</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
