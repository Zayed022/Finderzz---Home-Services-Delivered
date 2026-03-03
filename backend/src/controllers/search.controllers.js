import Service from "../models/service.models.js";
import SubService from "../models/subService.models.js";

export const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          services: [],
          subServices: [],
        },
      });
    }

    const searchRegex = new RegExp(q, "i");

    const services = await Service.find({
      active: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    })
      .select("name icon")
      .limit(10)
      .lean();

    const subServices = await SubService.find({
      active: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    })
      .select("name customerPrice durationEstimate")
      .limit(10)
      .lean();

    res.json({
      success: true,
      data: {
        services,
        subServices,
      },
    });
  } catch (error) {
    next(error);
  }
};