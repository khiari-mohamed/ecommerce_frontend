import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import {
  getProductListPage,
  deleteProduct,
  // deleteManyProducts,
} from "@/services/products";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Table, { TableColumn } from "../ui/Table";
import Loader from "../ui/Loader";
import Switch from "../ui/Switch";
import Toast from "../ui/Toast";
import { formatDate } from "../../utils/formatDate";
import { fetchCategories } from "../../utils/fetchCategories";
import "../../styles/dashboard.css";

interface ProductTableProps {
  onEdit: (product: Product | null) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  onView: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<{ _id: string; designation: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch categories for filter
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    getProductListPage(
      `page=${page}&limit=10${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`
    )
      .then((res) => {
        setProducts(res.products);
        setPagination(res.pagination);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page, search, category]);

  // Bulk select logic
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => setSelected(new Set(products.map((p) => p._id)));
  const clearSelection = () => setSelected(new Set());

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    setLoading(true);
    try {
      // await deleteManyProducts(Array.from(selected));
      setToast({ type: "success", message: "Products deleted successfully!" });
      setSelected(new Set());
      fetchProducts();
    } catch {
      setToast({ type: "error", message: "Failed to delete products." });
    } finally {
      setLoading(false);
    }
  };

  // Table columns
  const columns: TableColumn<Product>[] = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={selected.size === products.length && products.length > 0}
          onChange={(e) => (e.target.checked ? selectAll() : clearSelection())}
        />
      ),
      render: (_value, row) => (
        <input
          type="checkbox"
          checked={selected.has(row._id)}
          onChange={() => toggleSelect(row._id)}
        />
      ),
      align: "center",
    },
    {
      key: "mainImage",
      label: "Image",
      render: (_value, row) => (
        <img
          src={
            row.cover
              ? "/" + row.cover.replace(/^\/+/, "")
              : row.mainImage?.url
              ? "/" + row.mainImage.url.replace(/^\/+/, "")
              : "/images/placeholder.png"
          }
          alt={row.designation || row.title || "Product image"}
          className="product-table-image"
          style={{ maxWidth: 60, maxHeight: 60, objectFit: "contain" }}
        />
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value, row) => (
        <span className="product-table-title">
          {value}
          {row.isBestSeller && <Badge color="yellow">Best Seller</Badge>}
          {row.isNewProduct && <Badge color="green">New</Badge>}
          {row.isFlashSale && <Badge color="red">Flash Sale</Badge>}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) =>
        typeof value === "object" && value !== null
          ? value.designation
          : value,
    },
    {
      key: "inStock",
      label: "Stock",
      render: (value) =>
        value ? (
          <Badge color="green">In Stock</Badge>
        ) : (
          <Badge color="red">Out of Stock</Badge>
        ),
    },
    {
      key: "price",
      label: "Price",
      render: (_value, row) => (
        <span className="product-table-price">
          {row.price} DT
          {row.oldPrice && row.oldPrice > row.price && (
            <span className="product-table-oldprice">
              {row.oldPrice} DT
            </span>
          )}
        </span>
      ),
    },
    {
      key: "promo",
      label: "Promo",
      render: (_value, row) =>
        row.promo ? (
          <Badge color="blue">{row.promo} DT</Badge>
        ) : (
          <span style={{ color: '#aaa' }}>—</span>
        ),
    },
    {
      key: "aroma_ids",
      label: "Flavors/Aromas",
      render: (_value, row) =>
        Array.isArray(row.aroma_ids) && row.aroma_ids.length > 0 ? (
          <span>
            {row.aroma_ids.join(", ")}
          </span>
        ) : (
          <span style={{ color: '#aaa' }}>—</span>
        ),
    },
    {
      key: "nutrition_meta",
      label: "Info",
      render: (_value, row) => (
        <span>
          {row.nutrition_values ? <Badge color="green">N</Badge> : null}
          {row.questions ? <Badge color="yellow">Q</Badge> : null}
          {row.meta_description_fr || row.meta || row.content_seo ? <Badge color="green">SEO</Badge> : null}
          {!(row.nutrition_values || row.questions || row.meta_description_fr || row.meta || row.content_seo) && <span style={{ color: '#aaa' }}>—</span>}
        </span>
      ),
    },
    {
      key: "aggregateRating",
      label: "Rating",
      render: (value, row) => {
        const rating = Number(row.aggregateRating);
        return (
          <span className="product-table-rating">
            {!isNaN(rating) ? rating.toFixed(1) : "—"}
            <span className="product-table-rating-star">★</span>
            <span className="product-table-rating-count">
              ({row.reviews?.length || 0})
            </span>
          </span>
        );
      },
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value, row) => (
        <Switch
          checked={!!row.isPublished}
          onChange={() => onToggleStatus(row)}
          label={row.isPublished ? "Published" : "Hidden"}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => formatDate(value),
    },
    {
      key: "actions" as keyof Product,
      label: "Actions",
      render: (_value, row) => (
        <div className="product-table-actions">
          <Button size="sm" onClick={() => onEdit(row)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(row)}>
            Delete
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onView(row)}>
            View
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader label="Loading products..." />;
  if (error) return <div className="product-table-error">{error}</div>;

  return (
    <div className="product-table-root">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="product-table-toolbar">
        <div className="product-table-filters">
          <input
            type="text"
            placeholder="Search products..."
            className="product-table-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="product-table-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.designation}
              </option>
            ))}
          </select>
        </div>
        <div className="product-table-toolbar-actions">
          <Button onClick={() => onEdit(null)} variant="primary">
            + Add Product
          </Button>
          {selected.size > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              Delete Selected ({selected.size})
            </Button>
          )}
        </div>
      </div>
      <div className="product-table-tablewrap">
        <Table columns={columns} data={products} emptyText="No products found." />
      </div>
      {pagination && (
        <div className="product-table-pagination">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="product-table-pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;