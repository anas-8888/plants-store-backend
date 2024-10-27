const favoriteRepository = require("../repositories/favorite.repository");

// Save Favorite
async function saveFavorite(req, res) {
  try {
    // Check if dataFavorite exists
    const dataFavorite = req.body;

    if (!dataFavorite) {
      return res.status(400).json({ message: "dataFavorite is required" });
    }

    // Destructure customerId and plantId from dataFavorite
    const { customerId, plantId } = dataFavorite;

    // Ensure customerId and plantId are provided
    if (customerId === undefined || plantId === undefined) {
      return res
        .status(400)
        .json({ message: "customerId and plantId are required" });
    }

    // Call repository method
    const result = await favoriteRepository.saveFavorite(dataFavorite);

    // Respond with success
    res.status(201).json({
      message: "Favorite added successfully",
      favoriteId: result.insertId,
    });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res
      .status(500)
      .json({ message: "Error saving favorite", error: error.message });
  }
}

// Find All Favorites
async function findAllFavorites(req, res) {
  try {
    const favorites = await favoriteRepository.findAllFavorite();
    res.status(200).json(favorites);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving favorites", error: error.message });
  }
}

// Find Favorite by ID
async function findFavoriteById(req, res) {
  try {
    const { id } = req.params;
    const favorite = await favoriteRepository.findFavoriteById(id);
    res.status(200).json(favorite);
  } catch (error) {
    res
      .status(404)
      .json({ message: "Favorite not found", error: error.message });
  }
}

// Delete Favorite
async function deleteFavorite(req, res) {
  try {
    const { id } = req.params;
    await favoriteRepository.deleteFavorite(id);
    res.status(200).json({
      message: "Favorite deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "Favorite not found or already deleted",
      error: error.message,
    });
  }
}

module.exports = {
  saveFavorite,
  findAllFavorites,
  findFavoriteById,
  deleteFavorite,
};
