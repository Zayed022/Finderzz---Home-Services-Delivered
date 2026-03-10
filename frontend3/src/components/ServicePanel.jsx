export default function ServicePanel({
  services,
  selectService,
  createService,
  updateService,
  deleteService
}){

  return(

    <div className="bg-white p-4 rounded-xl shadow">

      <h2 className="font-semibold mb-4">Services</h2>

      {services.map(service=>(
        <div
          key={service._id}
          className="flex justify-between p-2 border-b"
        >

          <span
            onClick={()=>selectService(service)}
            className="cursor-pointer"
          >
            {service.name}
          </span>

          <div className="flex gap-2">

            <button
              onClick={()=>{
                const name = prompt("New name",service.name);
                updateService(service._id,{name});
              }}
            >
              Edit
            </button>

            <button
              onClick={()=>deleteService(service._id)}
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