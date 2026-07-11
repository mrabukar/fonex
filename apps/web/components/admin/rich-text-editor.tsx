"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "rte-content min-h-[220px] focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const items = [
    { icon: Bold, label: "Bold", onClick: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, label: "Italic", onClick: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    {
      icon: Heading2,
      label: "Heading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      label: "Subheading",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: List,
      label: "Bullet list",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      icon: Quote,
      label: "Quote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    { icon: Link2, label: "Link", onClick: setLink, active: editor.isActive("link") },
  ];

  return (
    <div className="rounded-xl border border-[#E7EAF3] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E7EAF3] p-1.5">
        {items.map(({ icon: Icon, label, onClick, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F4F6FB]",
              active ? "bg-[#EEF1FB] text-[#1A1C74]" : "text-muted-foreground",
            )}
          >
            <Icon size={15} />
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#F4F6FB]"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#F4F6FB]"
          >
            <Redo2 size={15} />
          </button>
        </div>
      </div>
      <EditorContent editor={editor} className="px-3.5 py-3" />
    </div>
  );
}
