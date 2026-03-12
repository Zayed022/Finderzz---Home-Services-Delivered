import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function SubServicePanel({
  subServices,
  editSubService,
  deleteSubService
}){

  if(!subServices?.length){
    return(
      <p className="text-sm text-gray-500">
        No SubServices found
      </p>
    );
  }

  return(

    <div className="space-y-4">

      {subServices.map(sub=>(
        <div
          key={sub._id}
          className="border rounded-xl p-4 hover:shadow-md transition"
        >

          {/* HEADER */}

          <div className="flex justify-between items-start">

            <div>
              <h3 className="font-semibold text-gray-800">
                {sub.name}
              </h3>

              <p className="text-xs text-gray-500">
                {sub.description}
              </p>
            </div>

            <div className="flex gap-3">

              <button
                onClick={()=>editSubService(sub._id)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit/>
              </button>

              <button
                onClick={()=>deleteSubService(sub._id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiTrash2/>
              </button>

            </div>

          </div>


          {/* PRICING */}

          <div className="grid grid-cols-3 gap-3 mt-4 text-sm">

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-500 text-xs">Worker</p>
              <p className="font-medium">
                ₹{sub.workerPrice}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-500 text-xs">Platform</p>
              <p className="font-medium">
                ₹{sub.platformFee}
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-gray-500 text-xs">Customer</p>
              <p className="font-semibold text-blue-700">
                ₹{sub.customerPrice}
              </p>
            </div>

          </div>


          {/* META */}

          <div className="flex justify-between items-center mt-3 text-xs text-gray-500">

            <span>
              Duration: {sub.durationEstimate} min
            </span>

            <span
              className={`px-2 py-1 rounded ${
                sub.active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {sub.active ? "Active" : "Disabled"}
            </span>

          </div>


          {/* INSPECTION DETAILS */}

          {sub.inspectionAvailable && (

            <div className="mt-4 bg-purple-50 p-3 rounded">

              <p className="text-xs font-semibold text-purple-700 mb-1">
                Inspection Available
              </p>

              <div className="text-xs text-gray-700">

                <p>
                  Price: ₹{sub.inspectionPrice}
                </p>

                <p>
                  Duration: {sub.inspectionDuration} min
                </p>

                <p>
                  {sub.inspectionDescription}
                </p>

              </div>

            </div>

          )}

        </div>
      ))}

    </div>

  );

}