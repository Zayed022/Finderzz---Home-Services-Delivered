import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ServicePanel({
  services,
  selectService,
  editService,
  deleteService
}){

  return(

    <div className="space-y-2">

      {services.map(service=>(
        <div
          key={service._id}
          className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
        >

          <span
            onClick={()=>selectService(service)}
            className="cursor-pointer font-medium"
          >
            {service.name}
          </span>

          <div className="flex gap-3">

            <button
              onClick={()=>editService(service._id)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FiEdit/>
            </button>

            <button
              onClick={()=>deleteService(service._id)}
              className="text-red-600 hover:text-red-800"
            >
              <FiTrash2/>
            </button>

          </div>

        </div>
      ))}

    </div>

  );
}