import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

export default function SubServicePanel({subServices}){

  return(

    <div className="bg-white shadow rounded-xl p-4">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">
          SubServices
        </h2>

        <button className="text-blue-600">
          <FiPlus/>
        </button>
      </div>

      <div className="space-y-3">

        {subServices.map(sub=>(
          
          <div
            key={sub._id}
            className="border p-3 rounded-lg"
          >

            <div className="font-medium">
              {sub.name}
            </div>

            <div className="text-sm text-gray-500">
              ₹{sub.customerPrice}
            </div>

          </div>

        ))}

      </div>

    </div>

  );

}