import Process from "../models/process.models.js";

/**
 * @desc Get process by processId
 * @route GET /api/process/:id
 */
export const getProcessById = async (req, res) => {
  try {
    const process = await Process.findById(req.params.id);

    if (!process) {
      return res.status(404).json({
        success: false,
        message: "Process not found",
      });
    }

    res.status(200).json({
      success: true,
      data: process,
    });
  } catch (error) {
    console.error("Error fetching process:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getProcessByServiceId = async (req, res) => {
    try {
      const process = await Process.findOne({
        serviceId: req.params.serviceId,
      });
  
      if (!process) {
        return res.status(404).json({
          success: false,
          message: "Process not found for this service",
        });
      }
  
      res.status(200).json({
        success: true,
        data: process,
      });
    } catch (error) {
      console.error("Error fetching process:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

export const getProcessBySubServiceId = async (req, res) => {
    try {
      const process = await Process.findOne({
        subServiceId: req.params.subServiceId,
      });
  
      if (!process) {
        return res.status(404).json({
          success: false,
          message: "Process not found for this sub-service",
        });
      }
  
      res.status(200).json({
        success: true,
        data: process,
      });
    } catch (error) {
      console.error("Error fetching process:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };