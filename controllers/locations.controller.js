const {
  createNewLocation,
  getAllLocations,
  getLocationById,
  deleteOneLocation,
  updateOneLocation
} = require("../repositories/locations.repository");

// Helper function for validating input
function validateLocationInput(data) {
  const errors = {};
  if (!data.location_name_AR) errors.location_name_AR = "Arabic location name is required.";
  if (!data.location_name_EN) errors.location_name_EN = "English location name is required.";
  if (data.price == null) errors.price = "Price is required.";
  return errors;
}

const locationsController = {
  // Create new location
  async createLocation(req, res) {
    const { location_name_AR, location_name_EN, price } = req.body;
    const errors = validateLocationInput({ location_name_AR, location_name_EN, price });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      await createNewLocation({ location_name_AR, location_name_EN, price });
      return res.status(201).json({ message: "Location created successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create location", details: error.message });
    }
  },

  // Get all locations
  async findAllLocations(req, res) {
    try {
      const locations = await getAllLocations(req.language);

      const responseLocations = locations.map(location => ({
        id: location.id,
        name: req.language === "ar" ? location.location_name_AR : location.location_name_EN,
        price: location.price
      }));

      return res.status(200).json(responseLocations);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve locations", details: error.message });
    }
  },

  // Get location by ID
  async findLocationById(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    try {
      const location = await getLocationById(id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }

      const responseLocation = {
        id: location.id,
        name: req.language === "ar" ? location.location_name_AR : location.location_name_EN,
        price: location.price
      };

      return res.status(200).json(responseLocation);
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve location", details: error.message });
    }
  },

  // Delete location by ID
  async deleteLocation(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    try {
      const isExist = await getLocationById(id);
      if (!isExist) {
        return res.status(400).json({ error: "Location ID not found!" });
      }

      await deleteOneLocation(id);
      return res.status(200).json({ message: "Location deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete location", details: error.message });
    }
  },

  // Update location by ID
  async updateLocation(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    let { location_name_AR, location_name_EN, price } = req.body;
    if (!location_name_AR && !location_name_EN && !price) {
      return res.status(400).json({ error: "Nothing to update!" });
    }

    try {
      const isExist = await getLocationById(id);
      if (!isExist) {
        return res.status(400).json({ error: "Location ID not found!" });
      }
      
      location_name_AR = location_name_AR || isExist.location_name_AR;
      location_name_EN = location_name_EN || isExist.location_name_EN;
      price = price || isExist.price;

      const errors = validateLocationInput({ location_name_AR, location_name_EN, price });
      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      await updateOneLocation({ id, location_name_AR, location_name_EN, price });
      return res.status(200).json({ message: "Location updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update location", details: error.message });
    }
  },
};

module.exports = { locationsController };
