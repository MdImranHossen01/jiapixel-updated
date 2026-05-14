"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Input,
} from "@/components/ui/input";
import {
  Label,
} from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Zap, 
  XCircle, 
  Copy,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  Eye,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/ui/Pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type RequestStatus = "requested" | "need contact" | "contacted" | "confirm" | "need to contact again" | "ordered" | "processing" | "delivered" | "paid" | "canceled" | "fake";

interface LandingRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: RequestStatus;
  source: string;
  price: number;
  details?: string;
  projectTitle?: string;
  proposalUrl?: string;
  freeOffered: boolean;
  contactedToday: boolean;
  quickNote?: string;
  credential?: string;
  lastContacted?: string;
  createdAt: string;
  updatedAt: string;
}

const statusOptions: { value: RequestStatus; label: string; color: string }[] = [
  { value: "requested", label: "Requested", color: "bg-slate-500" },
  { value: "need contact", label: "Need contact", color: "bg-red-700" },
  { value: "contacted", label: "Contacted", color: "bg-emerald-700" },
  { value: "confirm", label: "Confirm", color: "bg-sky-200 text-sky-800" },
  { value: "need to contact again", label: "Need contact again", color: "bg-purple-700" },
  { value: "ordered", label: "Ordered", color: "bg-amber-900" },
  { value: "processing", label: "Processing", color: "bg-orange-900" },
  { value: "delivered", label: "Delivered", color: "bg-blue-800" },
  { value: "paid", label: "Paid", color: "bg-green-500" },
  { value: "canceled", label: "Canceled", color: "bg-red-600" },
  { value: "fake", label: "Fake", color: "bg-red-900" },
];

const sourceOptions = [
  { value: "ecommerce-landing-page", label: "Landing Page" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
];

const ManageRequestsClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [requests, setRequests] = useState<LandingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LandingRequest | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [proposalUrl, setProposalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newRequestData, setNewRequestData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "whatsapp",
    price: 3500,
    details: "",
    status: "need contact" as RequestStatus
  });

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteModalConfig, setNoteModalConfig] = useState<{
    id: string;
    type: "quickNote" | "credential";
    value: string;
    title: string;
  } | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);

  const currentPage = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [sourceFilter, setSourceFilter] = useState(searchParams.get("source") || "all");
  const [isFilterLastContacted, setIsFilterLastContacted] = useState(searchParams.get("filterLastContacted") === "true");

  const updateQueryParams = useCallback((params: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }, [pathname, router, searchParams]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        search: searchTerm,
        status: statusFilter === "all" ? "" : statusFilter,
        source: sourceFilter === "all" ? "" : sourceFilter,
        filterLastContacted: isFilterLastContacted.toString(),
      });

      const res = await fetch(`/api/landing-requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(`An error occurred while fetching requests`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter, sourceFilter, isFilterLastContacted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchTerm, page: "1" });
    fetchRequests();
  };

  const handleStatusChange = async (id: string, status: string, additionalData = {}) => {
    try {
      const res = await fetch("/api/landing-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...additionalData }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: status as RequestStatus, ...additionalData } : req));
        setIsConfirmModalOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(`An error occurred while updating status`);
    }
  };

  const handleUpdateField = async (id: string, fields: Record<string, any>) => {
    try {
      const res = await fetch("/api/landing-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...fields }),
      });

      if (res.ok) {
        setRequests(prev => prev.map(req => req._id === id ? { ...req, ...fields } : req));
        toast.success(`Updated successfully`);
      } else {
        toast.error(`Failed to update`);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const openConfirmModal = (request: LandingRequest) => {
    setSelectedRequest(request);
    setProjectTitle(request.projectTitle || `Ecommerce Website - ${request.name}`);
    setProposalUrl(request.proposalUrl || "");
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    if (!selectedRequest) return;
    if (!projectTitle || !proposalUrl) {
      toast.error("Project Title and Proposal Link are required");
      return;
    }
    setIsSubmitting(true);
    handleStatusChange(selectedRequest._id, "confirm", { projectTitle, proposalUrl });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        const res = await fetch(`/api/landing-requests?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Request deleted successfully");
          fetchRequests();
        } else {
          toast.error("Failed to delete request");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the request");
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy text");
    });
  };

  const openNoteModal = (request: LandingRequest, type: "quickNote" | "credential") => {
    setNoteModalConfig({
      id: request._id,
      type,
      value: (request as any)[type] || "",
      title: type === "quickNote" ? "Quick Note" : "Credential"
    });
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteModalConfig) return;
    setIsSubmitting(true);
    await handleUpdateField(noteModalConfig.id, { [noteModalConfig.type]: noteModalConfig.value });
    setIsNoteModalOpen(false);
    setIsSubmitting(false);
  };



  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestData.phone) {
      toast.error("Phone number is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/landing-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequestData),
      });

      if (res.ok) {
        toast.success("Request added successfully");
        setIsAddModalOpen(false);
        setNewRequestData({
          name: "",
          email: "",
          phone: "",
          source: "whatsapp",
          price: 3500,
          details: "",
          status: "need contact"
        });
        fetchRequests();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to add request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isOldContact = (date?: string) => {
    if (!date) return true;
    const lastDate = new Date(date);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return lastDate < ninetyDaysAgo;
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 font-medium">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-wrap items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </form>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="whitespace-nowrap">Status:</Label>
          <Select 
            value={statusFilter} 
            onValueChange={(val) => {
              setStatusFilter(val);
              updateQueryParams({ status: val, page: "1" });
            }}
          >
            <SelectTrigger id="status-filter" className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="source-filter" className="whitespace-nowrap">Source:</Label>
          <Select 
            value={sourceFilter} 
            onValueChange={(val) => {
              setSourceFilter(val);
              updateQueryParams({ source: val, page: "1" });
            }}
          >
            <SelectTrigger id="source-filter" className="w-[150px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sourceOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30">
          <Label htmlFor="last-contacted-filter" className="text-sm font-medium cursor-pointer">Need Contact (&gt;90d)</Label>
          <Switch 
            id="last-contacted-filter"
            checked={isFilterLastContacted}
            onCheckedChange={(val) => {
              setIsFilterLastContacted(val);
              updateQueryParams({ filterLastContacted: val ? "true" : "false", page: "1" });
            }}
          />
        </div>

        <Button variant="outline" size="icon" onClick={fetchRequests} title="Refresh data">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>

        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Add New Request
        </Button>
      </div>

      <div 
        ref={tableRef}
        className="-mx-2 sm:-mx-4 md:-mx-6 lg:-mx-8 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{ maxHeight: 'calc(100vh - 350px)' }}
      >
        <Table className="relative w-full">
            <TableHeader className="bg-muted/50 sticky top-0 z-30 shadow-sm">
              <TableRow>
                <TableHead className="w-[280px] sticky left-0 top-0 z-40 bg-muted/95 backdrop-blur-sm border-r border-border">Customer Info</TableHead>
                <TableHead className="bg-muted/95 backdrop-blur-sm">WhatsApp</TableHead>
                <TableHead className="bg-muted/95 backdrop-blur-sm">Source</TableHead>
                <TableHead className="bg-muted/95 backdrop-blur-sm">Status</TableHead>
                <TableHead className="bg-muted/95 backdrop-blur-sm text-center">Toggles</TableHead>
                <TableHead className="w-[80px] bg-muted/95 backdrop-blur-sm text-center">Note</TableHead>
                <TableHead className="w-[80px] bg-muted/95 backdrop-blur-sm text-center">Cred.</TableHead>
                <TableHead className="text-right bg-muted/95 backdrop-blur-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-10 h-10 opacity-20" />
                      <p>No requests found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="sticky left-0 z-10 bg-card border-r border-border shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] py-2">
                      <div className="flex flex-col gap-1">
                        {request.proposalUrl ? (
                          <a
                            href={request.proposalUrl.startsWith('http') ? request.proposalUrl : `https://${request.proposalUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {request.projectTitle || request.name}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <div className="font-bold text-sm">{request.name}</div>
                        )}
                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground mt-1">
                          {request.email && (
                            <div 
                              onClick={() => copyToClipboard(request.email, "Email")}
                              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group"
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[200px]">{request.email}</span>
                            </div>
                          )}
                          <div 
                            onClick={() => copyToClipboard(request.phone, "Phone number")}
                            className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            {request.phone}
                          </div>
                          <div className={`flex items-center gap-1 mt-0.5 ${isOldContact(request.lastContacted) ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                            <Clock className="w-3 h-3 shrink-0" />
                            {request.lastContacted ? (
                              <>
                                <span>{new Date(request.lastContacted).toLocaleDateString("en-GB")}</span>
                                {isOldContact(request.lastContacted) && <span className="text-[9px] uppercase font-bold ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Needs Contact!</span>}
                              </>
                            ) : (
                              <span className="italic opacity-50">Never contacted</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 gap-1 h-8 px-2"
                        onClick={() => window.open(`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">WA</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={request.source} 
                        onValueChange={(val) => handleUpdateField(request._id, { source: val })}
                      >
                        <SelectTrigger className="h-8 w-[120px] text-xs px-2 bg-transparent border-border focus:ring-0">
                          <SelectValue className="truncate" />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                          {!sourceOptions.find(opt => opt.value === request.source) && (
                            <SelectItem value={request.source} className="text-xs">
                              {request.source.replace(/-/g, ' ')}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={request.status} 
                        onValueChange={(val) => {
                          if (val === "confirm") openConfirmModal(request);
                          else handleStatusChange(request._id, val);
                        }}
                      >
                        <SelectTrigger className={`h-8 w-[120px] text-xs font-semibold ${statusOptions.find(o => o.value === request.status)?.color} text-white border-none`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 min-w-[100px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium text-muted-foreground">Free:</span>
                          <Switch 
                            checked={request.freeOffered} 
                            onCheckedChange={(val) => handleUpdateField(request._id, { freeOffered: val })}
                            className="scale-75 origin-right m-0"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-medium text-muted-foreground">Today:</span>
                          <Switch 
                            checked={request.contactedToday} 
                            onCheckedChange={(val) => {
                              const updates: any = { contactedToday: val };
                              if (val) updates.lastContacted = new Date().toISOString();
                              handleUpdateField(request._id, updates);
                            }}
                            className="scale-75 origin-right m-0"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {request.quickNote ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary"
                          onClick={() => openNoteModal(request, "quickNote")}
                          title="View Note"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-dashed"
                          onClick={() => openNoteModal(request, "quickNote")}
                          title="Add Note"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {request.credential ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary"
                          onClick={() => openNoteModal(request, "credential")}
                          title="View Credential"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 border-dashed"
                          onClick={() => openNoteModal(request, "credential")}
                          title="Add Credential"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => window.open(`tel:${request.phone}`)} className="gap-2">
                            <Phone className="w-4 h-4 text-green-500" /> Call
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${request.email}`)} className="gap-2">
                            <Mail className="w-4 h-4 text-blue-500" /> Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              const newDate = new Date().toISOString();
                              handleUpdateField(request._id, { lastContacted: newDate });
                            }} 
                            className="gap-2"
                          >
                            <RefreshCw className="w-4 h-4" /> Mark as Contacted Now
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(request._id)} className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" /> Delete
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

      {/* Pagination */}
      <div className="py-4">
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => updateQueryParams({ page: page.toString() })}
        />
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Project Request</DialogTitle>
            <DialogDescription>
              Enter the project details and proposal link for <strong>{selectedRequest?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input
                id="projectTitle"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. My Awesome Shop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="proposalUrl">Proposal Link (URL)</Label>
              <Input
                id="proposalUrl"
                value={proposalUrl}
                onChange={(e) => setProposalUrl(e.target.value)}
                placeholder="e.g. /proposal/904584a84be88a27611"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Confirm & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Request Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Request</DialogTitle>
            <DialogDescription>
              Enter customer details to manually add a new request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRequest} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-name">Customer Name</Label>
                <Input
                  id="add-name"
                  value={newRequestData.name}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name (Optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone Number *</Label>
                <Input
                  id="add-phone"
                  value={newRequestData.phone}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="01xxxxxxxxx"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="add-email">Email Address</Label>
              <Input
                id="add-email"
                type="email"
                value={newRequestData.email}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@mail.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-source">Source</Label>
                <Select 
                  value={newRequestData.source} 
                  onValueChange={(val) => setNewRequestData(prev => ({ ...prev, source: val }))}
                >
                  <SelectTrigger id="add-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-price">Budget (৳)</Label>
                <Input
                  id="add-price"
                  type="number"
                  value={newRequestData.price}
                  onChange={(e) => {
                    const val = e.target.value;
                    const parsed = parseInt(val, 10);
                    setNewRequestData(prev => ({ ...prev, price: isNaN(parsed) ? 0 : parsed }));
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-status">Initial Status</Label>
              <Select 
                value={newRequestData.status} 
                onValueChange={(val) => setNewRequestData(prev => ({ ...prev, status: val as RequestStatus }))}
              >
                <SelectTrigger id="add-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-details">Details / Note</Label>
              <Input
                id="add-details"
                value={newRequestData.details}
                onChange={(e) => setNewRequestData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Any specific requirements..."
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Note/Credential Modal */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{noteModalConfig?.title}</DialogTitle>
            <DialogDescription>
              View or edit the {noteModalConfig?.title.toLowerCase()} for this customer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              className="min-h-[150px] resize-none"
              value={noteModalConfig?.value || ""}
              onChange={(e) => setNoteModalConfig(prev => prev ? { ...prev, value: e.target.value } : null)}
              placeholder={`Enter ${noteModalConfig?.title.toLowerCase()} here...`}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageRequestsClient;
