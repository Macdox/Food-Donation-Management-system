const express = require("express");
const router = express.Router();
const pool = require("../db");

// Add Donation
router.post("/add", async (req, res) => {
  try {
    const { hotel_id, food_type, quantity, pickup_time, expiry_time } =
      req.body;

    // Parse quantity to integer to match DB schema
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a number" });
    }

    const donation = await pool.query(
      `INSERT INTO food_donations
      (hotel_id, food_type, quantity, pickup_time, expiry_time)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [hotel_id, food_type, parsedQuantity, pickup_time, expiry_time],
    );

    res.status(201).json({
      success: true,
      message: "Donation added successfully",
      donation: donation.rows[0],
    });
  } catch (error) {
    console.error("Error adding donation:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// View All Donations
router.get("/all", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, u.full_name as hotel_name, n.full_name as ngo_name 
      FROM food_donations f 
      LEFT JOIN users u ON f.hotel_id = u.user_id 
      LEFT JOIN users n ON f.ngo_id = n.user_id 
      ORDER BY f.created_at DESC
    `);

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// View Available Donations
router.get("/available", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, u.full_name as hotel_name 
      FROM food_donations f 
      JOIN users u ON f.hotel_id = u.user_id 
      WHERE f.status = 'available'
      ORDER BY f.created_at DESC
    `);

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// View Hotel Donations
router.get("/hotel/:hotel_id", async (req, res) => {
  try {
    const { hotel_id } = req.params;
    const result = await pool.query(`
      SELECT f.*, n.full_name as ngo_name 
      FROM food_donations f 
      LEFT JOIN users n ON f.ngo_id = n.user_id 
      WHERE f.hotel_id = $1
      ORDER BY f.created_at DESC
    `, [hotel_id]);

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// View NGO Claims (Past Orders)
router.get("/ngo/:ngo_id", async (req, res) => {
  try {
    const { ngo_id } = req.params;
    const result = await pool.query(`
      SELECT f.*, u.full_name as hotel_name 
      FROM food_donations f 
      JOIN users u ON f.hotel_id = u.user_id 
      WHERE f.ngo_id = $1
      ORDER BY f.created_at DESC
    `, [ngo_id]);

    res.json({
      success: true,
      donations: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Claim Donation
router.post("/claim/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_id } = req.body;

    const check = await pool.query(
      "SELECT * FROM food_donations WHERE donation_id = $1",
      [id],
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (check.rows[0].status === "claimed") {
      return res.status(400).json({ message: "Donation already claimed" });
    }

    const result = await pool.query(
      "UPDATE food_donations SET status = 'claimed', ngo_id = $1 WHERE donation_id = $2 RETURNING *",
      [ngo_id, id],
    );

    res.json({
      success: true,
      message: "Donation claimed successfully",
      donation: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update Donation
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { food_type, quantity, pickup_time, expiry_time } = req.body;

    const check = await pool.query(
      "SELECT * FROM food_donations WHERE donation_id = $1",
      [id],
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (check.rows[0].status === "claimed") {
      return res
        .status(400)
        .json({ message: "Cannot update a claimed donation" });
    }

    // Parse quantity to integer to match DB schema
    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a number" });
    }

    const result = await pool.query(
      "UPDATE food_donations SET food_type = $1, quantity = $2, pickup_time = $3, expiry_time = $4 WHERE donation_id = $5 RETURNING *",
      [food_type, parsedQuantity, pickup_time, expiry_time, id],
    );

    res.json({
      success: true,
      message: "Donation updated successfully",
      donation: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete Donation
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT * FROM food_donations WHERE donation_id = $1",
      [id],
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (check.rows[0].status === "claimed") {
      return res
        .status(400)
        .json({ message: "Cannot delete a claimed donation" });
    }

    await pool.query("DELETE FROM food_donations WHERE donation_id = $1", [id]);

    res.json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
