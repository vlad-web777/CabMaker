import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

type ProductOption = {
  label: string;
  xmlTag: string;
  type: "number" | "text" | "select";
  required?: boolean;
  visible?: boolean;
  values?: string[];
};

type ProductRecord = {
  cabinetType: "frameless" | "framed";
  cabinetKey: string;
  id: string;
  name: string;
  menu: string;
  image?: string;
  directory?: string;
  description?: string;
  fileName?: string;
  options: ProductOption[];
};

const emptyProduct: ProductRecord = {
  cabinetType: "frameless",
  cabinetKey: "",
  id: "",
  name: "",
  menu: "Base",
  image: "",
  directory: "FRAMELESS",
  fileName: "",
  description: "",
  options: [],
};

const menuOptions = ["Base", "Upper", "Tall", "Base Corner"];

function ProductsAdminSection() {
  const auth = useAuth();
  const [showXmlHelp, setShowXmlHelp] = useState(false);
  const [imageSearch, setImageSearch] = useState("");
  const [showImageSuggestions, setShowImageSuggestions] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const CREATE_CABINET_URL = import.meta.env.VITE_CREATE_CABINET;
  const DELETE_CABINET_URL = import.meta.env.VITE_DELETE_CABINET;

  const token = auth.user?.access_token;

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRecord>(emptyProduct);

  const getProductRowId = (product: ProductRecord) =>
    (product.id || product.cabinetKey || "").trim();

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      (product.name ?? "").toLowerCase().includes(query)
    );
  }, [products, searchTerm]);

  const productCountLabel = useMemo(() => {
    if (loading) return "Loading...";
    return `${filteredProducts.length} of ${products.length} product${products.length === 1 ? "" : "s"
      }`;
  }, [loading, filteredProducts.length, products.length]);

  const existingImages = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((p) => p.image?.trim())
          .filter((img): img is string => !!img)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredImages = useMemo(() => {
    const query = imageSearch.trim().toLowerCase();

    if (!query) return existingImages;

    return existingImages.filter((img) => img.toLowerCase().includes(query));
  }, [existingImages, imageSearch]);

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) =>
      selectedProductIds.includes(getProductRowId(product))
    );

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/fetchCabinetList`);

      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }

      const data = await response.json();

      const normalized: ProductRecord[] = Array.isArray(data)
        ? data.map((item) => ({
          cabinetType: item.cabinetType ?? "frameless",
          cabinetKey: item.cabinetKey ?? "",
          id: item.id ?? item.cabinetKey ?? "",
          name: item.name ?? "",
          menu: item.menu ?? "Base",
          image: item.image ?? "",
          directory: item.directory ?? "",
          fileName: item.fileName ?? "",
          description: item.description ?? "",
          options: Array.isArray(item.options) ? item.options : [],
        }))
        : [];

      setProducts(normalized);
    } catch (err) {
      console.error("loadProducts error:", err);
      setError("Could not load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    const newId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cabinet-${Date.now()}`;

    setIsEditMode(false);

    const nextProduct = {
      ...emptyProduct,
      cabinetKey: newId,
      id: newId,
    };

    setEditingProduct(nextProduct);
    setImageSearch(nextProduct.image ?? "");
    setShowImageSuggestions(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductRecord) => {
    setIsEditMode(true);

    const nextProduct = {
      cabinetType: product.cabinetType ?? "frameless",
      cabinetKey: product.cabinetKey ?? "",
      id: product.id ?? "",
      name: product.name ?? "",
      menu: product.menu ?? "Base",
      image: product.image ?? "",
      directory: product.directory ?? "",
      fileName: product.fileName ?? "",
      description: product.description ?? "",
      options: Array.isArray(product.options) ? product.options : [],
    };

    setEditingProduct(nextProduct);
    setImageSearch(nextProduct.image ?? "");
    setShowImageSuggestions(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingProduct(emptyProduct);
    setImageSearch("");
    setShowImageSuggestions(false);
    setDragActive(false);
  };

  const handleFieldChange = <K extends keyof ProductRecord>(
    field: K,
    value: ProductRecord[K]
  ) => {
    setEditingProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectImage = (imagePath: string) => {
    handleFieldChange("image", imagePath);
    setImageSearch(imagePath);
    setShowImageSuggestions(false);
  };

  const handleImageInputChange = (value: string) => {
    handleFieldChange("image", value);
    setImageSearch(value);
    setShowImageSuggestions(true);
  };

  const handleDroppedFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please drop an image file.");
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      handleFieldChange("image", previewUrl);
      setImageSearch(file.name);

      // Replace later with S3 upload if needed
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Could not upload image.");
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleDroppedFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    await handleDroppedFile(file);
  };

  const handleOptionChange = <K extends keyof ProductOption>(
    index: number,
    field: K,
    value: ProductOption[K]
  ) => {
    setEditingProduct((prev) => {
      const updated = [...prev.options];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...prev,
        options: updated,
      };
    });
  };

  const addOption = () => {
    setEditingProduct((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          label: "",
          xmlTag: "",
          type: "text",
          required: false,
          visible: true,
          values: [],
        },
      ],
    }));
  };

  const removeOption = (index: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = filteredProducts.map(getProductRowId).filter(Boolean);

    if (allVisibleSelected) {
      setSelectedProductIds((prev) =>
        prev.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedProductIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  const saveProduct = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const payload: ProductRecord = {
        cabinetType: editingProduct.cabinetType ?? "frameless",
        cabinetKey: editingProduct.cabinetKey?.trim() || "",
        id: editingProduct.id?.trim() || editingProduct.cabinetKey?.trim() || "",
        name: editingProduct.name?.trim() || "",
        menu: editingProduct.menu?.trim() || "Base",
        image: editingProduct.image?.trim() || "",
        directory: editingProduct.directory?.trim() || "",
        fileName: editingProduct.fileName?.trim() || "",
        description: editingProduct.description?.trim() || "",
        options: Array.isArray(editingProduct.options)
          ? editingProduct.options.map((option) => ({
            label: option.label ?? "",
            xmlTag: option.xmlTag ?? "",
            type: option.type ?? "text",
            required: !!option.required,
            visible: option.visible !== false,
            values:
              option.type === "select"
                ? (option.values ?? []).filter(Boolean)
                : undefined,
          }))
          : [],
      };

      if (!payload.cabinetKey || !payload.name) {
        alert("Cabinet Key and Product Name are required.");
        return;
      }

      const response = await fetch(CREATE_CABINET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to save product");
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      console.error("saveProduct error:", err);
      alert("Could not save product. " + err);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSelectedProducts = async () => {
    if (selectedProductIds.length === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedProductIds.length} selected cabinet(s)?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);

      const selectedItems = products
        .filter((product) => selectedProductIds.includes(getProductRowId(product)))
        .map((product) => ({
          cabinetType: product.cabinetType,
          cabinetKey: product.cabinetKey,
        }));

      const response = await fetch(DELETE_CABINET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: selectedItems,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to delete selected cabinets");
      }

      setSelectedProductIds([]);
      await loadProducts();
    } catch (err) {
      console.error("deleteSelectedProducts error:", err);
      alert("Could not delete selected cabinets. " + err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b bg-gray-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Products</h2>
          <p className="text-sm text-gray-500">{productCountLabel}</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search by cabinet name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm md:w-72"
          />

          <button
            onClick={openAddModal}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            New Product
          </button>

          <button
            onClick={deleteSelectedProducts}
            disabled={selectedProductIds.length === 0 || isDeleting}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </button>
        </div>
      </div>

      <div className="p-5">
        {loading && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-500">
            Loading products...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                      />
                    </th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Cabinet Type</th>
                    <th className="px-4 py-3">Menu</th>
                    <th className="px-4 py-3">File Name</th>
                    <th className="px-4 py-3">Directory</th>
                    <th className="px-4 py-3">Options</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const rowId = getProductRowId(product);
                    const isSelected = selectedProductIds.includes(rowId);

                    return (
                      <tr key={rowId} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProductSelection(rowId)}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-left font-medium text-green-600 hover:underline"
                          >
                            {product.name || "(Untitled Product)"}
                          </button>
                        </td>

                        <td className="px-4 py-3">{product.cabinetType || "-"}</td>
                        <td className="px-4 py-3">{product.menu || "-"}</td>
                        <td className="px-4 py-3">{product.fileName || "-"}</td>
                        <td className="px-4 py-3">{product.directory || "-"}</td>
                        <td className="px-4 py-3">{product.options?.length || 0}</td>
                      </tr>
                    );
                  })}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-sm text-gray-500">
                  Manage cabinet details, image path, and options.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 hover:text-black"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-6">
                <section className="rounded-xl border p-4">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900">Basic Info</h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Product Name
                      </label>
                      <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Base 1 Drawer Cabinet"
                        value={editingProduct.name ?? ""}
                        onChange={(e) => handleFieldChange("name", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Cabinet Key
                      </label>
                      <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="base-1-drawer-cabinet"
                        value={editingProduct.cabinetKey ?? ""}
                        onChange={(e) => handleFieldChange("cabinetKey", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">ID</label>
                      <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="base-1-drawer-cabinet"
                        value={editingProduct.id ?? ""}
                        onChange={(e) => handleFieldChange("id", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Cabinet Type
                      </label>
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={editingProduct.cabinetType ?? "frameless"}
                        onChange={(e) =>
                          handleFieldChange(
                            "cabinetType",
                            e.target.value as "frameless" | "framed"
                          )
                        }
                      >
                        <option value="frameless">frameless</option>
                        <option value="framed">framed</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Menu</label>
                      <select
                        className="w-full rounded-lg border px-3 py-2"
                        value={editingProduct.menu ?? "Base"}
                        onChange={(e) => handleFieldChange("menu", e.target.value)}
                      >
                        {menuOptions.map((menu) => (
                          <option key={menu} value={menu}>
                            {menu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        File Name
                      </label>
                      <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="201.cab"
                        value={editingProduct.fileName ?? ""}
                        onChange={(e) => handleFieldChange("fileName", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Directory
                      </label>
                      <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="FRAMELESS"
                        value={editingProduct.directory ?? ""}
                        onChange={(e) => handleFieldChange("directory", e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Image Path / URL
                      </label>

                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border px-3 py-2"
                            placeholder="Type image path or URL..."
                            value={imageSearch}
                            onChange={(e) => handleImageInputChange(e.target.value)}
                            onFocus={() => setShowImageSuggestions(true)}
                          />

                          {showImageSuggestions && filteredImages.length > 0 && (
                            <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                              {filteredImages.map((img) => (
                                <button
                                  key={img}
                                  type="button"
                                  onClick={() => selectImage(img)}
                                  className="flex w-full items-center gap-3 border-b px-3 py-2 text-left hover:bg-gray-50"
                                >
                                  <div className="h-10 w-10 overflow-hidden rounded border bg-gray-50">
                                    <img
                                      src={img}
                                      alt={img}
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).style.display = "none";
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm text-gray-800">{img}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <select
                            className="w-full rounded-lg border px-3 py-2"
                            value=""
                            onChange={(e) => {
                              if (e.target.value) selectImage(e.target.value);
                            }}
                          >
                            <option value="">Choose from existing images</option>
                            {existingImages.map((img) => (
                              <option key={img} value={img}>
                                {img}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="shrink-0 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                          >
                            Browse
                          </button>
                        </div>

                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`cursor-pointer rounded-xl border-2 border-dashed px-4 py-6 text-center transition ${dragActive
                            ? "border-black bg-gray-100"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                            }`}
                        >
                          <div className="text-sm font-medium text-gray-700">
                            Drag & drop image here
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            or click to browse
                          </div>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      className="min-h-[100px] w-full rounded-lg border px-3 py-2"
                      placeholder="Product description..."
                      value={editingProduct.description ?? ""}
                      onChange={(e) => handleFieldChange("description", e.target.value)}
                    />
                  </div>
                </section>

                <section className="rounded-xl border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Options</h4>
                    <button
                      type="button"
                      onClick={addOption}
                      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editingProduct.options.length === 0 && (
                      <div className="rounded-lg border border-dashed px-4 py-6 text-sm text-gray-500">
                        No options added yet.
                      </div>
                    )}

                    {editingProduct.options.map((option, index) => (
                      <div key={index} className="rounded-xl border p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900">
                            Option {index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <input
                            className="rounded-lg border px-3 py-2"
                            placeholder="Label"
                            value={option.label ?? ""}
                            onChange={(e) =>
                              handleOptionChange(index, "label", e.target.value)
                            }
                          />

                          <input
                            className="rounded-lg border px-3 py-2"
                            placeholder="xmlTag"
                            value={option.xmlTag ?? ""}
                            onChange={(e) =>
                              handleOptionChange(index, "xmlTag", e.target.value)
                            }
                          />

                          <select
                            className="rounded-lg border px-3 py-2"
                            value={option.type ?? "text"}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "type",
                                e.target.value as "number" | "text" | "select"
                              )
                            }
                          >
                            <option value="text">text</option>
                            <option value="number">number</option>
                            <option value="select">select</option>
                          </select>

                          <input
                            className="rounded-lg border px-3 py-2"
                            placeholder="Select values: Ply UV Maple, White Mel"
                            value={option.values?.join(", ") ?? ""}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "values",
                                e.target.value
                                  .split(",")
                                  .map((v) => v.trim())
                                  .filter(Boolean)
                              )
                            }
                            disabled={option.type !== "select"}
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-6 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!option.required}
                              onChange={(e) =>
                                handleOptionChange(index, "required", e.target.checked)
                              }
                            />
                            Required
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={option.visible !== false}
                              onChange={(e) =>
                                handleOptionChange(index, "visible", e.target.checked)
                              }
                            />
                            Visible
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="rounded-xl border p-4">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900">Preview</h4>

                  <div className="overflow-hidden rounded-xl border bg-gray-50">
                    <div className="flex aspect-[4/3] items-center justify-center bg-white">
                      {editingProduct.image ? (
                        <img
                          src={editingProduct.image}
                          alt={editingProduct.name || "Product image"}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="px-4 text-center text-sm text-gray-400">
                          No image selected
                        </div>
                      )}
                    </div>

                    <div className="border-t bg-white p-4">
                      <div className="font-medium text-gray-900">
                        {editingProduct.name || "Untitled Product"}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {editingProduct.cabinetType || "-"} • {editingProduct.menu || "-"}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {editingProduct.fileName || "No file name"}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-xl border p-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-900">Quick Summary</h4>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium text-gray-900">Cabinet Key:</span>{" "}
                      {editingProduct.cabinetKey || "-"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">ID:</span>{" "}
                      {editingProduct.id || "-"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Directory:</span>{" "}
                      {editingProduct.directory || "-"}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Options:</span>{" "}
                      {editingProduct.options.length}
                    </div>
                  </div>
                </section>





                <button
                  type="button"
                  onClick={() => setShowXmlHelp(true)}
                  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-black text-white text-2xl font-bold shadow-lg hover:bg-gray-800 transition"
                  aria-label="XML Tag Help"
                >
                  ?
                </button>





                {showXmlHelp && (
                  <div className="fixed inset-0 z-[60] flex items-end justify-end bg-green">
                    <div className="relative mb-24 mr-6 w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border">
                      <button
                        type="button"
                        onClick={() => setShowXmlHelp(false)}
                        className="absolute top-3 right-3 bg-amber-50 text-gray-500 hover:text-black text-lg"
                      >
                        ×
                      </button>

                      <h3 className="text-lg font-semibold mb-3">XML Tag Help</h3>
                      <p className="text-sm text-gray-700">
                        xmlTag is the variable name used when exporting this option into the XML.
                        Example tags: Width, Height, Depth, Material, FinishColor.
                      </p>
                    </div>
                  </div>
                )}





              </div>
            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={closeModal}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveProduct}
                disabled={isSaving}
                className="rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>


  );
}

export default ProductsAdminSection;