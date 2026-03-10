import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";

export default function CategoryPanel({categories,selectCategory}){

  return(

    <div className="bg-white shadow rounded-xl p-4">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-lg">
          Categories
        </h2>

        <button className="text-blue-600">
          <FiPlus/>
        </button>
      </div>

      <div className="space-y-2">

        {categories.map(cat=>(
          
          <div
            key={cat._id}
            onClick={()=>selectCategory(cat)}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between"
          >

            <span>{cat.name}</span>

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