// Controller for admin-related endpoints

// Get admin dashboard (empty for now)
export const getDashboard = async (req, res) => {
  try {
    // For now, return an empty object
    return res.json({ dashboard: {} });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};