import { Product } from "@/types/product";
import { Save, X } from "lucide-react";
import { motion } from "motion/react";

interface EditForm {
  name: string;
  price: string;
  category: string;
  stock: string;
  isAvailable: boolean;
}
interface EditProductModalProps {
  editingProduct: Product;
  closeEditModal: () => void;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  handleSaveEdit: () => void;
  isSavingEdit: boolean;
}
export default function EditProductModal({
  editingProduct,
  closeEditModal,
  editForm,
  setEditForm,
  handleSaveEdit,
  isSavingEdit,
}: EditProductModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeEditModal}
        className="absolute inset-0 bg-black/40"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl  font-bold text-gray-800">Edit Product</h2>
          <button
            onClick={closeEditModal}
            className="p-2 rounded-xl hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Name
            </label>
            <input
              value={editForm.name}
              onChange={(event) =>
                setEditForm((prev: EditForm) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Price
              </label>
              <input
                type="number"
                value={editForm.price}
                onChange={(event) =>
                  setEditForm((prev: EditForm) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Stock
              </label>
              <input
                type="number"
                value={editForm.stock}
                onChange={(event) =>
                  setEditForm((prev: EditForm) => ({
                    ...prev,
                    stock: event.target.value,
                  }))
                }
                className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Category
            </label>
            <input
              value={editForm.category}
              onChange={(event) =>
                setEditForm((prev: EditForm) => ({
                  ...prev,
                  category: event.target.value,
                }))
              }
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={editForm.isAvailable}
              onChange={(event) =>
                setEditForm((prev: EditForm) => ({
                  ...prev,
                  isAvailable: event.target.checked,
                }))
              }
            />
            Product is available
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={closeEditModal}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={isSavingEdit}
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={14} /> {isSavingEdit ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
