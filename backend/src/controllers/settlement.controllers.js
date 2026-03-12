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

  export const approveSettlement = async(req,res)=>{

    try{
  
      const {id} = req.params;
  
      const settlement = await Settlement.findByIdAndUpdate(
        id,
        {
          status:"approved",
          approvedAt:new Date()
        },
        {new:true}
      );
  
      res.json({
        success:true,
        settlement
      });
  
    }catch(error){
  
      res.status(500).json({
        success:false
      });
  
    }
  
  };