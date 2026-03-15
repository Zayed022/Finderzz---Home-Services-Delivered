import Settlement from "../models/settlement.models.js"

export const submitSettlement = async(req,res)=>{

    try{
  
      const {workerId,date} = req.body;
  
      const settlement = await Settlement.findOneAndUpdate(
        {workerId,date},
        {
          status:"submitted",
          submittedAt:new Date()
        },
        {new:true,upsert:true}
      );
  
      res.json({
        success:true,
        settlement
      });
  
    }catch(error){
  
      res.status(500).json({
        success:false,
        message:"Failed to submit settlement"
      });
  
    }
  
  };

  export const approveSettlement = async (req, res) => {
    try {
  
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Settlement ID is required"
        });
      }
  
      const settlement = await Settlement.findById(id);
  
      if (!settlement) {
        return res.status(404).json({
          success: false,
          message: "Settlement not found"
        });
      }
  
      if (settlement.status === "approved") {
        return res.status(400).json({
          success: false,
          message: "Settlement already approved"
        });
      }
  
      settlement.status = "approved";
      settlement.approvedAt = new Date();
  
      await settlement.save();
  
      res.status(200).json({
        success: true,
        message: "Settlement approved successfully",
        settlement
      });
  
    } catch (error) {
  
      console.error("Approve settlement error:", error);
  
      res.status(500).json({
        success: false,
        message: "Failed to approve settlement"
      });
  
    }
  };
  