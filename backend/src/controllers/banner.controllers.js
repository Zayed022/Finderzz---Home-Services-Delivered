import Banner from "../models/banner.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createBanner = async (req, res, next) => {
  try {
    const { title, redirectUrl, order } = req.body;

    const bannerPath = req.files?.bannerImage?.[0]?.path;
    

    if (!bannerPath) return res.status(400).json({ message: "Banner image is required" });

    const bannerUploaded = await uploadOnCloudinary(bannerPath);

    const banner = await Banner.create({
      bannerImage: bannerUploaded.secure_url,
      title,
      redirectUrl,
      order,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

export const getActiveBanners = async (req, res, next) => {
    try {
      const banners = await Banner.find({ active: true })
        .select("bannerImage title redirectUrl order")
        .sort({ order: 1 })
        .lean();
  
      res.json({
        success: true,
        data: banners,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Banner.findByIdAndUpdate(id, { active: false });

    res.json({ success: true, message: "Banner disabled" });
  } catch (error) {
    next(error);
  }
};

export const updateBannerOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { order } = req.body;

    const banner = await Banner.findByIdAndUpdate(
      id,
      { order },
      { new: true }
    );

    res.json({
      success: true,
      data: banner
    });

  } catch (error) {
    next(error);
  }
};