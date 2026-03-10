import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

export default function ServicePanel({services,selectService}){

  return(

    <div className="bg-white shadow rounded-xl p-4">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Services
        </h2>

        <button className="text-blue-600">
          <FiPlus/>
        </button>
      </div>

      <div className="space-y-2">

        {services.map(service=>(
          
          <div
            key={service._id}
            onClick={()=>selectService(service)}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between"
          >

            <span>{service.name}</span>

            <div className="flex gap-2">
              <FiEdit className="text-blue-500"/>
              <FiTrash className="text-red-500"/>
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}