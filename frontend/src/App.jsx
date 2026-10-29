
import { useEffect, useState } from "react";
import { foodApi } from "./services/foodApi";
import "./App.css";

const emptyForm = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadFoods(keyword = search) {
    try {
      setLoading(true);
      setError("");
      const data = await foodApi.getAll(keyword);
      setFoods(data);
    } catch (err) {
      setError(err.message || "Không thể tải danh sách món ăn.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadFoods(search);
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(food) {
    setEditingId(food._id);
    setForm({
      foodId: food.foodId ?? "",
      name: food.name ?? "",
      category: food.category ?? "",
      cuisine: food.cuisine ?? "",
      ingredients: Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : "",
      price: String(food.price ?? ""),
      quantity: String(food.quantity ?? ""),
      description: food.description ?? "",
      imageUrl: food.imageUrl ?? "",
    });
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!Number.isFinite(price) || price < 0) {
      setError("Giá bán phải là số không âm.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Số lượng phải là số nguyên không âm.");
      return;
    }

    const food = {
      foodId: form.foodId.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      ingredients: form.ingredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      price,
      quantity,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await foodApi.update(editingId, food);
        setNotice("Cập nhật món ăn thành công.");
      } else {
        await foodApi.create(food);
        setNotice("Thêm món ăn thành công.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadFoods();
    } catch (err) {
      setError(err.message || "Không thể lưu món ăn.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(food) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa món "${food.name}" không?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await foodApi.remove(food._id);
      setNotice(`Đã xóa món "${food.name}".`);
      await loadFoods();
    } catch (err) {
      setError(err.message || "Không thể xóa món ăn.");
    }
  }

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <p className="eyebrow">FOOD MANAGEMENT SYSTEM</p>
          <h1>Quản lý món ăn</h1>
          <p className="subtitle">
            Quản lý dữ liệu món ăn trên MongoDB Atlas
          </p>
        </div>

        <button className="primary-button" onClick={openCreateForm}>
          + Thêm món ăn
        </button>
      </header>

      <section className="toolbar">
        <input
          type="search"
          placeholder="Tìm theo tên, danh mục hoặc ẩm thực..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Tìm kiếm món ăn"
        />
      </section>

      {notice && <p className="message success">{notice}</p>}
      {error && <p className="message error">{error}</p>}
      {loading && <p className="message">Đang tải dữ liệu...</p>}

      {showForm && (
        <section className="form-panel">
          <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn mới"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Mã món ăn *
                <input
                  name="foodId"
                  value={form.foodId}
                  onChange={handleChange}
                  placeholder="Ví dụ: F004"
                  required
                />
              </label>

              <label>
                Tên món ăn *
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Danh mục *
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Ví dụ: Món nước"
                  required
                />
              </label>

              <label>
                Ẩm thực *
                <input
                  name="cuisine"
                  value={form.cuisine}
                  onChange={handleChange}
                  placeholder="Ví dụ: Việt Nam"
                  required
                />
              </label>

              <label>
                Giá bán (VNĐ) *
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Số lượng *
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="full-width">
                Nguyên liệu (phân cách bằng dấu phẩy)
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Bánh phở, Thịt bò, Hành"
                />
              </label>

              <label className="full-width">
                Mô tả *
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </label>

              <label className="full-width">
                URL hình ảnh (không bắt buộc)
                <input
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : editingId
                    ? "Lưu thay đổi"
                    : "Thêm món ăn"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError("");
                }}
                disabled={saving}
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {!loading && !error && foods.length === 0 && (
        <p className="message">Không tìm thấy món ăn phù hợp.</p>
      )}

      {!loading && foods.length > 0 && (
        <section className="food-grid">
          {foods.map((food) => (
            <article className="food-card" key={food._id}>
              <div className="food-card-header">
                <span>{food.foodId}</span>
                <span className="food-category">{food.category}</span>
              </div>

              <h2>{food.name}</h2>
              <p className="muted">Ẩm thực: {food.cuisine}</p>
              <p>{food.description}</p>

              <div className="food-details">
                <div>
                  <span className="detail-label">Giá bán</span>
                  <strong className="price">
                    {formatPrice(food.price)}
                  </strong>
                </div>

                <div>
                  <span className="detail-label">Số lượng</span>
                  <strong>{food.quantity}</strong>
                </div>
              </div>

              <div className="ingredients">
                <span className="detail-label">Nguyên liệu</span>
                <p>
                  {Array.isArray(food.ingredients)
                    ? food.ingredients.join(", ")
                    : "Chưa cập nhật"}
                </p>
              </div>

              <div className="card-actions">
                <button
                  className="secondary-button"
                  onClick={() => openEditForm(food)}
                >
                  Sửa
                </button>

                <button
                  className="danger-button"
                  onClick={() => handleDelete(food)}
                >
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
