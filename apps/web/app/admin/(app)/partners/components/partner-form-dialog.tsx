"use client";

import { useState } from "react";
import { toast } from "sonner";
import { partnerTypeValues, type PartnerInput } from "@fonex/shared";
import type { Partner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient, ApiError } from "@/lib/api-client";
import { humanize } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";
import { Textarea } from "@/components/ui/textarea";

export interface PartnerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Partner | null;
  onSaved: () => void | Promise<void>;
}

export function PartnerFormDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: PartnerFormDialogProps) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<Partner["type"]>(initial?.type ?? "manufacturer");
  const [websiteUrl, setWebsiteUrl] = useState(initial?.websiteUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [savedPartner, setSavedPartner] = useState<Partner | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(initial?.logoUrl ?? null);
  const [hasPendingLogo, setHasPendingLogo] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  const activePartner = savedPartner ?? initial;
  const isLogoStep = !isEdit && Boolean(savedPartner);

  function requestClose(nextOpen: boolean) {
    if (!nextOpen && hasPendingLogo) {
      setDiscardConfirmOpen(true);
      return;
    }
    onOpenChange(nextOpen);
  }

  function confirmDiscard() {
    setDiscardConfirmOpen(false);
    onOpenChange(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload: PartnerInput = {
      name,
      type,
      websiteUrl: websiteUrl.trim() || undefined,
      description: description.trim() || undefined,
      order,
    };

    try {
      if (isEdit && initial) {
        await apiClient.patch<Partner>(`/api/partners/${initial.id}`, payload);
        toast.success("Partner updated");
        await onSaved();
        onOpenChange(false);
      } else {
        const partner = await apiClient.post<Partner>("/api/partners", payload);
        setSavedPartner(partner);
        setLogoUrl(partner.logoUrl);
        toast.success("Partner created — add a logo or click Done");
        await onSaved();
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save partner",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={requestClose}>
      <DialogContent
        className={`overflow-hidden ${isLogoStep || isEdit ? "sm:max-w-lg" : "sm:max-w-md"}`}
      >
        <form onSubmit={onSubmit} className="min-w-0">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? "Edit partner"
                : isLogoStep
                  ? "Add partner logo"
                  : "New partner"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this partner's details and logo."
                : isLogoStep
                  ? `"${savedPartner?.name}" was created. Add a logo now or click Done to skip.`
                  : "Fill in the details to add a new partner."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[60vh] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
            {!isLogoStep && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pt-name">Name</Label>
                  <Input
                    id="pt-name"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Electronics"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => v && setType(v as Partner["type"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>{humanize(type)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {partnerTypeValues.map((t) => (
                        <SelectItem key={t} value={t}>
                          {humanize(t)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pt-website">Website</Label>
                    <Input
                      id="pt-website"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="pt-order">Display order</Label>
                    <Input
                      id="pt-order"
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pt-description">Description</Label>
                  <Textarea
                    id="pt-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional short description"
                    rows={3}
                  />
                </div>
              </>
            )}

            {activePartner && (isLogoStep || isEdit) && (
              <div className="flex flex-col gap-1.5">
                <Label>Logo</Label>
                <ImageUpload
                  uploadUrl={`/api/partners/${activePartner.id}/logo-upload-url`}
                  imageUrl={logoUrl}
                  onUploaded={(url) => {
                    setLogoUrl(url);
                    onSaved();
                  }}
                  onPendingChange={setHasPendingLogo}
                  label="logo"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            {isLogoStep ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => requestClose(false)}
                >
                  Skip logo
                </Button>
                <Button type="button" onClick={() => requestClose(false)}>
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => requestClose(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving…"
                    : isEdit
                      ? "Save changes"
                      : "Create partner"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
      </Dialog>

      <AlertDialog open={discardConfirmOpen} onOpenChange={setDiscardConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved logo?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved logo preview. Discard it and close?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDiscard}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
