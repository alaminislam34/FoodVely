"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  Save,
  Image as ImageIcon,
  Video,
  X,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { adminApi } from "@/api/adminApi";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/utils/apiError";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "@/components/admin/AdminStates";
import { AdminPaginator } from "@/components/admin/AdminPaginator";
import { useAdminListControls } from "@/hooks/useAdminListControls";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  blog_video?: string;
  category: { id: string; name: string; slug: string };
  author: { id: string; name: string; role: string };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  status: "published" | "draft";
}

export default function BlogManage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const {
    searchInput,
    setSearchInput,
    debouncedSearch,
    page: currentPage,
    setPage: setCurrentPage,
    reloadKey,
    retry,
  } = useAdminListControls({ debounceMs: 450 });

  // State for Form/Editor
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      setError(null);
      const { items, meta } = await adminApi.listBlogPostsPaged({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
      });

      const mapped: Blog[] = items.map((item) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? "Untitled"),
        slug: String(item.slug ?? ""),
        excerpt: String(item.excerpt ?? item.summary ?? ""),
        content: String(item.content ?? ""),
        thumbnail: String(item.thumbnail ?? item.imageUrl ?? ""),
        blog_video: String(item.blog_video ?? item.videoUrl ?? ""),
        category: {
          id: String((item.category as { id?: string } | undefined)?.id ?? "general"),
          name: String((item.category as { name?: string } | undefined)?.name ?? "General"),
          slug: String((item.category as { slug?: string } | undefined)?.slug ?? "general"),
        },
        author: {
          id: String((item.author as { id?: string } | undefined)?.id ?? "admin"),
          name: String((item.author as { name?: string } | undefined)?.name ?? "Admin"),
          role: String((item.author as { role?: string } | undefined)?.role ?? "admin"),
        },
        publishedAt: String(item.publishedAt ?? new Date().toISOString()),
        readingTime: String(item.readingTime ?? "5 min read"),
        tags: ((item.tags as string[] | undefined) ?? []) as string[],
        status: (String(item.status ?? "draft") as "published" | "draft"),
      }));
      setBlogs(mapped);
      setTotalPages(Math.max(meta?.totalPages ?? 1, 1));
      setSelectedId((prev) =>
        mapped.some((blog) => blog.id === prev) ? prev : (mapped[0]?.id ?? null),
      );
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, "Failed to load blog posts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [currentPage, debouncedSearch, reloadKey]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Helpers
  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const currentBlog = useMemo(
    () => blogs.find((b) => b.id === selectedId),
    [blogs, selectedId],
  );

  const handleCreateNew = () => {
    setEditingBlog({
      id: `blog_${Date.now()}`,
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      blog_video: "",
      status: "draft",
      publishedAt: new Date().toISOString().split("T")[0],
      author: { id: "admin_01", name: "Admin", role: "admin" },
      tags: [],
      category: { id: "cat_new", name: "General", slug: "general" },
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!editingBlog || !editingBlog.title) return;

    const finalBlog = {
      ...editingBlog,
      slug: editingBlog.slug || generateSlug(editingBlog.title),
    } as Blog;

    const payload = {
      title: finalBlog.title,
      slug: finalBlog.slug,
      summary: finalBlog.excerpt,
      content: finalBlog.content,
      status: finalBlog.status,
      imageUrl: finalBlog.thumbnail,
      videoUrl: finalBlog.blog_video,
      readingTime: finalBlog.readingTime,
      tags: finalBlog.tags,
      category: finalBlog.category,
    };

    try {
      const exists = blogs.find((b) => b.id === finalBlog.id);
      if (exists) {
        await adminApi.updateBlogPost(finalBlog.id, payload);
        toast.success("Blog post updated");
      } else {
        await adminApi.createBlogPost(payload);
        toast.success("Blog post created");
      }
      await loadBlogs();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save blog post"));
    }

    setIsEditorOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      try {
        await adminApi.deleteBlogPost(id);
        const remaining = blogs.filter((b) => b.id !== id);
        setBlogs(remaining);
        setSelectedId(remaining[0]?.id || null);
        toast.success("Blog post deleted");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to delete blog post"));
      }
    }
  };

  return (
    <div className="relative space-y-6 lg:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl  font-bold text-gray-800 tracking-tight">
            Admin Editorial
          </h1>
          <p className="text-gray-500 font-medium">
            Create and manage content for the restaurant network.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Write New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter articles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 font-medium"
            />
          </div>

          <div className="bg-white/60 border border-gray-200 rounded-3xl h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
            {loading ? <AdminLoadingState label="Loading blog posts..." /> : null}
            {error ? (
              <AdminErrorState
                description={error}
                onAction={retry}
              />
            ) : null}
            {!loading && !error && blogs.length === 0 ? (
              <AdminEmptyState title="No blog posts found" description="Create a new article or adjust search query." />
            ) : null}

            {blogs.map((blog) => (
              <button
                key={blog.id}
                onClick={() => setSelectedId(blog.id)}
                className={`w-full p-4 border-b border-gray-100 text-left transition-all ${selectedId === blog.id ? "bg-rose-50/50 shadow-inner" : "hover:bg-gray-50"}`}
              >
                <div className="flex gap-4">
                  <img
                    src={blog.thumbnail}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100"
                    alt=""
                  />
                  <div className="min-w-0">
                    <span
                      className={`text-[10px] font-bold uppercase ${blog.status === "draft" ? "text-amber-500" : "text-rose-500"}`}
                    >
                      {blog.status} • {blog.category.name}
                    </span>
                    <h3 className="font-bold text-gray-800 text-sm truncate">
                      {blog.title}
                    </h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <AdminPaginator
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="lg:col-span-8">
          {currentBlog ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
              <div className="relative h-64 bg-gray-900">
                <img
                  src={currentBlog.thumbnail}
                  className="w-full h-full object-cover opacity-60"
                  alt=""
                />
                <div className="absolute inset-0 flex items-end p-8 bg-linear-to-t from-black/90 via-transparent to-transparent">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {currentBlog.title}
                  </h2>
                </div>
                <div className="absolute top-6 right-6 flex gap-2">
                  <button
                    onClick={() => handleEdit(currentBlog)}
                    className="p-3 bg-white text-gray-900 rounded-xl hover:text-rose-500 transition-all font-bold flex items-center gap-2 shadow-lg"
                  >
                    <Edit2 size={18} /> Edit Post
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider">
                  <span className="flex items-center gap-2">
                    <User size={14} className="text-rose-500" />{" "}
                    {currentBlog.author.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-rose-500" />{" "}
                    {currentBlog.readingTime}
                  </span>
                  <span className="ml-auto text-gray-300">
                    ID: {currentBlog.id}
                  </span>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                  {currentBlog.content}
                </p>

                {currentBlog.blog_video && (
                  <div className="rounded-2xl overflow-hidden aspect-video border bg-black shadow-xl">
                    <iframe
                      src={currentBlog.blog_video}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}

                <button
                  onClick={() => handleDelete(currentBlog.id)}
                  className="w-full py-4 border-2 border-dashed border-red-100 text-red-400 rounded-2xl font-bold hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete Article Permanently
                </button>
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isEditorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-300 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="text-rose-500" />{" "}
                  {editingBlog?.title ? "Edit Article" : "Compose New Post"}
                </h2>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                <div className="space-y-4">
                  <input
                    value={editingBlog?.title || ""}
                    onChange={(e) =>
                      setEditingBlog({ ...editingBlog!, title: e.target.value })
                    }
                    placeholder="Article Title"
                    className="w-full text-3xl font-bold outline-none border-b-2 border-gray-100 focus:border-rose-500 py-2 transition-all"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Category
                      </label>
                      <select
                        value={editingBlog?.category?.name}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog!,
                            category: {
                              ...editingBlog!.category!,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-rose-200"
                      >
                        <option>Food Guides</option>
                        <option>Restaurant News</option>
                        <option>Recipes</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Read Time
                      </label>
                      <input
                        value={editingBlog?.readingTime || ""}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog!,
                            readingTime: e.target.value,
                          })
                        }
                        placeholder="e.g. 5 min read"
                        className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-transparent focus:border-rose-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2">
                        <ImageIcon size={12} /> Thumbnail URL
                      </label>
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0">
                          {editingBlog?.thumbnail ? (
                            <img
                              src={editingBlog.thumbnail}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="text-gray-300" />
                          )}
                        </div>
                        <input
                          value={editingBlog?.thumbnail || ""}
                          onChange={(e) =>
                            setEditingBlog({
                              ...editingBlog!,
                              thumbnail: e.target.value,
                            })
                          }
                          placeholder="Paste image URL..."
                          className="flex-1 p-3 h-fit bg-gray-50 rounded-xl text-sm font-medium outline-none border border-transparent focus:border-rose-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2">
                        <Video size={12} /> Video Embed URL (Optional)
                      </label>
                      <input
                        value={editingBlog?.blog_video || ""}
                        onChange={(e) =>
                          setEditingBlog({
                            ...editingBlog!,
                            blog_video: e.target.value,
                          })
                        }
                        placeholder="https://www.youtube.com/embed/..."
                        className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none border border-transparent focus:border-rose-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Article Content
                    </label>
                    <textarea
                      rows={10}
                      value={editingBlog?.content || ""}
                      onChange={(e) =>
                        setEditingBlog({
                          ...editingBlog!,
                          content: e.target.value,
                        })
                      }
                      placeholder="Share the story..."
                      className="w-full p-4 bg-gray-50 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-rose-500/10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-300 bg-gray-50 flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-600 transition-all"
                >
                  <Save size={18} /> Save & Publish
                </button>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-8 py-4 bg-white text-gray-500 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-100 bg-white rounded-3xl border-2 border-dashed border-gray-100 text-gray-300">
      <FileText size={80} strokeWidth={1} className="mb-4 opacity-10" />
      <p className=" font-bold text-xl">Article Viewer</p>
      <p className="text-sm font-medium text-gray-400">
        Select an article to preview or edit.
      </p>
    </div>
  );
}
