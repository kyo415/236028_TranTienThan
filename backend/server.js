require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;
const DB_NAME = process.env.DB_NAME || "236028_TranTienThan";

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "1mb" }));

let db;
let foods;

const requiredStringFields = [
  "foodId",
  "name",
  "category",
  "cuisine",
  "description"
];

function validateFood(body) {
  const errors = [];

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["Dữ liệu phải là một JSON object"];
  }

  for (const field of requiredStringFields) {
    if (
      typeof body[field] !== "string" ||
      body[field].trim() === ""
    ) {
      errors.push(`${field} là bắt buộc và phải là chuỗi`);
    }
  }

  if (
    body.price === undefined ||
    !Number.isFinite(body.price) ||
    body.price < 0
  ) {
    errors.push("price phải là số không âm");
  }

  if (
    body.quantity === undefined ||
    !Number.isInteger(body.quantity) ||
    body.quantity < 0
  ) {
    errors.push("quantity phải là số nguyên không âm");
  }

  if (
    body.ingredients !== undefined &&
    (!Array.isArray(body.ingredients) ||
      !body.ingredients.every(item => typeof item === "string"))
  ) {
    errors.push("ingredients phải là mảng chuỗi");
  }

  if (
    body.imageUrl !== undefined &&
    typeof body.imageUrl !== "string"
  ) {
    errors.push("imageUrl phải là chuỗi");
  }

  return errors;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeFood(body) {
  return {
    foodId: body.foodId.trim(),
    name: body.name.trim(),
    category: body.category.trim(),
    cuisine: body.cuisine.trim(),
    ingredients: body.ingredients || [],
    price: body.price,
    quantity: body.quantity,
    description: body.description.trim(),
    imageUrl: body.imageUrl || ""
  };
}

function parseId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// Health check
app.get("/health", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// GET /api/foods?search=pho
app.get("/api/foods", async (req, res, next) => {
  try {
    const search = String(req.query.search || "").trim();
    const filter = {};

    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filter.$or = [
        { name: pattern },
        { category: pattern },
        { cuisine: pattern }
      ];
    }

    const result = await foods.find(filter)
      .sort({ name: 1 })
      .toArray();

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/foods/:id
app.get("/api/foods/:id", async (req, res, next) => {
  try {
    if (!parseId(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const food = await foods.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!food) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    res.json(food);
  } catch (error) {
    next(error);
  }
});

// POST /api/foods
app.post("/api/foods", async (req, res, next) => {
  try {
    const errors = validateFood(req.body);

    if (errors.length) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const food = normalizeFood(req.body);

    const existing = await foods.findOne({ foodId: food.foodId });
    if (existing) {
      return res.status(409).json({ message: "foodId đã tồn tại" });
    }

    const result = await foods.insertOne(food);
    res.status(201).json({
      message: "Thêm món ăn thành công",
      data: { ...food, _id: result.insertedId }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/foods/:id
app.put("/api/foods/:id", async (req, res, next) => {
  try {
    if (!parseId(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const errors = validateFood(req.body);

    if (errors.length) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const id = new ObjectId(req.params.id);
    const food = normalizeFood(req.body);

    const existing = await foods.findOne({ _id: id });
    if (!existing) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    const duplicate = await foods.findOne({
      foodId: food.foodId,
      _id: { $ne: id }
    });

    if (duplicate) {
      return res.status(409).json({ message: "foodId đã tồn tại" });
    }

    await foods.updateOne({ _id: id }, { $set: food });

    res.json({
      message: "Cập nhật món ăn thành công",
      data: { ...food, _id: id }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/foods/:id
app.delete("/api/foods/:id", async (req, res, next) => {
  try {
    if (!parseId(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const result = await foods.deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    res.json({ message: "Xóa món ăn thành công" });
  } catch (error) {
    next(error);
  }
});

// JSON parsing errors and other errors
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "JSON không hợp lệ" });
  }

  console.error(err.message);
  res.status(500).json({ message: "Lỗi máy chủ hoặc cơ sở dữ liệu" });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Thiếu biến môi trường MONGODB_URI");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  db = client.db(DB_NAME);
  foods = db.collection("foods");

  // Bảo đảm foodId không trùng, kể cả khi có nhiều yêu cầu đồng thời.
  await foods.createIndex({ foodId: 1 }, { unique: true });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend đang chạy tại cổng ${PORT}`);
    console.log(`Database: ${DB_NAME}`);
  });
}

startServer().catch(error => {
  console.error("Không thể khởi động backend:", error.message);
  process.exit(1);
});
