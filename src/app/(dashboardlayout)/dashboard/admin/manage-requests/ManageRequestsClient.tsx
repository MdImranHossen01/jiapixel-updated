"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Mail, Phone, ExternalLink, Trash2, CheckCircle2, Clock, MessageCircle, Zap, XCircle, Copy } from "lucide-react";
import { toast } from "sonner";

interface LandingRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: "requested" | "contacted" | "confirm" | "cancel" | "completed";
  source: string;
  price: number;
  details?: string;
  projectTitle?: string;
  proposalUrl?: string;
  createdAt: string;
}

const ManageRequestsClient = () => {
  const [requests, setRequests] = useState<LandingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LandingRequest | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [proposalUrl, setProposalUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy text");
    });
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/landing-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(`An error occurred while fetching requests: ${error?.message ?? error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, status: string, additionalData = {}) => {
    try {
      const res = await fetch("/api/landing-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, ...additionalData }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${status}`);
        fetchRequests();
        setIsConfirmModalOpen(false);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(`An error occurred while updating status: ${error?.message ?? error}`);
    } finally {
      setIsSubmitting(false);
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

  const getStatusVariant = (status: LandingRequest["status"]) => {
    switch (status) {
      case "completed":
      case "confirm":
        return "default";
      case "contacted":
        return "secondary";
      case "requested":
        return "outline";
      case "cancel":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    // ... existing code ...
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 font-medium">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[200px]">Customer</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Source & Project</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20 text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="w-10 h-10 opacity-20" />
                  <p>No landing page requests found yet.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request._id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    {request.proposalUrl ? (
                      <a
                        href={request.proposalUrl.startsWith('http') ? request.proposalUrl : `https://${request.proposalUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base text-primary hover:underline flex items-center gap-1"
                      >
                        {request.projectTitle || request.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <div className="font-bold text-base">{request.name}</div>
                    )}
                    {request.details && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-1 italic" title={request.details}>
                        "{request.details}"
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div 
                      onClick={() => copyToClipboard(request.email, "Email")}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer group"
                      title="Click to copy email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {request.email}
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div 
                      onClick={() => copyToClipboard(request.phone, "Phone number")}
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors cursor-pointer group"
                      title="Click to copy phone number"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {request.phone}
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium bg-primary/5 border-primary/20">
                    {request.source.replace(/-/g, ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-primary">৳ {request.price}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)} className="capitalize">
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-9 w-9 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => window.open(`tel:${request.phone}`)} className="gap-2">
                        <Phone className="w-4 h-4 text-green-500" /> Call Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`mailto:${request.email}`)} className="gap-2">
                        <Mail className="w-4 h-4 text-blue-500" /> Send Email
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Update Status
                      </div>
                      <DropdownMenuItem onClick={() => handleStatusChange(request._id, "requested")} className="gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" /> Mark as Requested
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(request._id, "contacted")} className="gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-400" /> Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openConfirmModal(request)} className="gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" /> Mark as Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(request._id, "completed")} className="gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(request._id, "cancel")} className="gap-2">
                        <XCircle className="w-4 h-4 text-red-500" /> Mark as Cancel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(request._id)} className="gap-2 text-destructive">
                        <Trash2 className="w-4 h-4" /> Delete Request
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
              <Label htmlFor="projectTitle">Project Title (to show in table)</Label>
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
    </div>
  );
};

export default ManageRequestsClient;
