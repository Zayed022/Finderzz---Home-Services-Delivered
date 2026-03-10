export default function SubServicePanel({
  subServices,
  updateSubService,
  deleteSubService
}){

  return(

    <div className="bg-white p-4 rounded-xl shadow">

      <h2 className="font-semibold mb-4">SubServices</h2>

      {subServices.map(sub=>(
        <div
          key={sub._id}
          className="flex justify-between p-2 border-b"
        >

          <span>{sub.name}</span>

          <div className="flex gap-2">

            <button
              onClick={()=>{
                const price = prompt("Worker price");
                updateSubService(sub._id,{workerPrice:price});
              }}
            >
              Edit
            </button>

            <button
              onClick={()=>deleteSubService(sub._id)}
              className="text-red-600"
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>

  );

}