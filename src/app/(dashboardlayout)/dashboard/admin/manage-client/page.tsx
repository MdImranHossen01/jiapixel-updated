"use client";

import React, { useState, useEffect } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';
import Image from 'next/image';
import { Edit2, Trash2, X } from 'lucide-react';

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
    email: string[];
}

export default function ManageClientPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        service: '',
        price: '',
        renewDate: '',
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

            {/* Client List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                    <div key={client._id} className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition relative group">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditClick(client)} className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Edit">
                                <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteClick(client._id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Delete">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border shrink-0">
                                <Image src={client.clientImage} alt={client.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-lg truncate" title={client.name}>{client.name}</h3>
                                <p className="text-blue-600 text-sm font-medium truncate">{client.service}</p>
                                {client.country && <p className="text-gray-400 text-xs">{client.country}</p>}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div>
                                <strong>Emails:</strong>
                                <div className="flex flex-col gap-1 mt-1">
                                    {(Array.isArray(client.email) ? client.email : (client.email ? [client.email] : [])).map((email, idx) => (
                                        <a key={idx} href={`mailto:${email}`} className="text-gray-600 hover:text-blue-600 truncate block">{email}</a>
                                    ))}
                                </div>
                            </div>

                            {client.website && (
                                <p className="truncate"><strong>Web:</strong> <a href={client.website} target="_blank" className="text-blue-500 hover:underline">{client.website}</a></p>
                            )}

                            <div className="flex justify-between items-center">
                                <span><strong>Price:</strong> ${client.price}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Due: {new Date(client.renewDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t flex flex-wrap gap-2 text-xs">
                            {client.socialLinks.linkedin && <a href={client.socialLinks.linkedin} target="_blank" className="text-blue-600 hover:underline font-semibold">LinkedIn</a>}

                            {/* WhatsApp Loop */}
                            {client.socialLinks.whatsapp && (Array.isArray(client.socialLinks.whatsapp) ? client.socialLinks.whatsapp : [client.socialLinks.whatsapp]).map((wa, idx, arr) => (
                                <a key={idx} href={`https://wa.me/${wa.replace(/[^0-9]/g, '')}`} target="_blank" className="text-green-600 hover:underline font-semibold">
                                    WhatsApp {arr.length > 1 ? idx + 1 : ''}
                                </a>
                            ))}

                            {client.socialLinks.facebook && <a href={client.socialLinks.facebook} target="_blank" className="text-blue-800 hover:underline font-semibold">Facebook</a>}
                            {client.socialLinks.instagram && <a href={client.socialLinks.instagram} target="_blank" className="text-pink-600 hover:underline font-semibold">Instagram</a>}
                            {client.socialLinks.youtube && <a href={client.socialLinks.youtube} target="_blank" className="text-red-600 hover:underline font-semibold">YouTube</a>}
                        </div>
                    </div>
                ))}

                {clients.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No clients found. Add one above.
                    </div>
                )}
            </div>
        </div>
    );
}
