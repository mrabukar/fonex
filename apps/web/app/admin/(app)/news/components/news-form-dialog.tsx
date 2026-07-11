"use client";

import { useState } from "react";
import { toast } from "sonner";
import { newsStatusValues, slugify, type NewsInput } from "@fonex/shared";
import type { NewsArticle } from "@/lib/types";
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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";

export interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: NewsArticle | null;
  onSaved: () => void | Promise<void>;
}

export function NewsFormDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: NewsFormDialogProps) {
  const isEdit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [status, setStatus] = useState<NewsArticle["status"]>(initial?.status ?? "draft");
  const [submitting, setSubmitting] = useState(false);
  const [savedArticle, setSavedArticle] = useState<NewsArticle | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [hasPendingImage, setHasPendingImage] = useState(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

  const activeArticle = savedArticle ?? initial;
  const isImageStep = !isEdit && Boolean(savedArticle);
  const slug = slugify(title);
  const slugInvalid = title.trim().length > 0 && !slug;

  function requestClose(nextOpen: boolean) {
    if (!nextOpen && hasPendingImage) {
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
    const generatedSlug = slugify(title);
    if (!generatedSlug || !body.trim()) return;

    setSubmitting(true);
    const payload: NewsInput = {
      title,
      slug: generatedSlug,
      excerpt: excerpt.trim() || undefined,
      body,
      status,
    };

    try {
      if (isEdit && initial) {
        await apiClient.patch<NewsArticle>(`/api/news/${initial.id}`, payload);
        toast.success("Article updated");
        await onSaved();
        onOpenChange(false);
      } else {
        const article = await apiClient.post<NewsArticle>("/api/news", payload);
        setSavedArticle(article);
        setImageUrl(article.imageUrl);
        toast.success("Article created — add a cover image or click Done");
        await onSaved();
      }
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to save article",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={requestClose}>
      <DialogContent
        className={`overflow-hidden ${isImageStep || isEdit ? "sm:max-w-2xl" : "sm:max-w-lg"}`}
      >
        <form onSubmit={onSubmit} className="min-w-0">
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? "Edit article"
                : isImageStep
                  ? "Add cover image"
                  : "New article"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update this article's content and cover image."
                : isImageStep
                  ? `"${savedArticle?.title}" was created. Add a cover image now or click Done to skip.`
                  : "Fill in the details to create a new article."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex max-h-[65vh] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto pr-1">
            {!isImageStep && (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="n-title">Title</Label>
                  <Input
                    id="n-title"
                    required
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fonex partners with Acme Electronics"
                  />
                  {slugInvalid && (
                    <p className="text-xs text-destructive">
                      Title must contain at least one letter or number.
                    </p>
                  )}
                  {slug && <p className="text-xs text-muted-foreground">/news/{slug}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="n-excerpt">Excerpt</Label>
                  <Textarea
                    id="n-excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Optional short summary shown on teaser cards"
                    rows={2}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Body</Label>
                  <RichTextEditor value={body} onChange={setBody} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Status</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => v && setStatus(v as NewsArticle["status"])}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue>{humanize(status)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {newsStatusValues.map((s) => (
                        <SelectItem key={s} value={s}>
                          {humanize(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeArticle && (isImageStep || isEdit) && (
              <div className="flex flex-col gap-1.5">
                <Label>Cover image</Label>
                <ImageUpload
                  uploadUrl={`/api/news/${activeArticle.id}/image-upload-url`}
                  imageUrl={imageUrl}
                  onUploaded={(url) => {
                    setImageUrl(url);
                    onSaved();
                  }}
                  onPendingChange={setHasPendingImage}
                  label="cover image"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            {isImageStep ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => requestClose(false)}
                >
                  Skip image
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
                <Button type="submit" disabled={submitting || !slug || !body.trim()}>
                  {submitting
                    ? "Saving…"
                    : isEdit
                      ? "Save changes"
                      : "Create article"}
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
            <AlertDialogTitle>Discard unsaved image?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved cover image preview. Discard it and close?
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
