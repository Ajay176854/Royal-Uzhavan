import { Router } from "express";
import { query } from "../db/pool.js";

const router = Router();

// GET /api/products/categories — must come before /:id
router.get("/categories", async (_req, res) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.image, COUNT(p.id)::int AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       GROUP BY c.id, c.name, c.image
       ORDER BY c.name`
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      search,
      tag,
      min_price,
      max_price,
      in_stock,
      sort,
      page = "1",
      limit = "20",
    } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Filter by category name
    if (category) {
      conditions.push(`c.name = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    // Search by name
    if (search) {
      conditions.push(`p.name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by tag
    if (tag) {
      conditions.push(`$${paramIndex} = ANY(p.tags)`);
      params.push(tag);
      paramIndex++;
    }

    // Price range
    if (min_price) {
      conditions.push(`p.price >= $${paramIndex}`);
      params.push(Number(min_price));
      paramIndex++;
    }
    if (max_price) {
      conditions.push(`p.price <= $${paramIndex}`);
      params.push(Number(max_price));
      paramIndex++;
    }

    // In-stock filter
    if (in_stock === "true") {
      conditions.push("p.in_stock = true");
    }

    // Build WHERE clause
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Sorting
    let orderClause = "ORDER BY p.created_at DESC";
    if (sort === "price_asc") orderClause = "ORDER BY p.price ASC";
    else if (sort === "price_desc") orderClause = "ORDER BY p.price DESC";
    else if (sort === "rating") orderClause = "ORDER BY p.rating DESC";
    else if (sort === "name") orderClause = "ORDER BY p.name ASC";
    else if (sort === "popular") orderClause = "ORDER BY p.reviews DESC";

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const offset = (pageNum - 1) * limitNum;

    // Count total
    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}`,
      params
    );

    // Fetch products
    const result = await query(
      `SELECT p.id, p.slug, p.name, c.name AS category, p.animal_type,
              p.price, p.original_price, p.discount, p.rating, p.reviews,
              p.image, p.tags, p.variants, p.in_stock, p.description,
              p.created_at
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${whereClause}
       ${orderClause}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limitNum, offset]
    );

    res.json({
      products: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countResult.rows[0].total,
        totalPages: Math.ceil(countResult.rows[0].total / limitNum),
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Support both UUID and slug lookup
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    const result = await query(
      `SELECT p.id, p.slug, p.name, c.name AS category, p.animal_type,
              p.price, p.original_price, p.discount, p.rating, p.reviews,
              p.image, p.tags, p.variants, p.in_stock, p.description,
              p.created_at
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${isUUID ? "p.id = $1" : "p.slug = $1"}`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    console.error("Product fetch error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export { router as productRoutes };
