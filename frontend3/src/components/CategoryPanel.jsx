import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CategoryPanel({
  categories,
  selectCategory,
  editCategory,
  deleteCategory
}){

  return(

    <div className="bg-white shadow rounded-xl p-4">

      <h2 className="font-semibold mb-4">
        Categories
      </h2>

      {categories.map(cat=>(
        <div
          key={cat._id}
          className="flex justify-between items-center p-2 border-b"
        >

          <span
            onClick={()=>selectCategory(cat)}
            className="cursor-pointer"
          >
            {cat.name}
          </span>

          <div className="flex gap-3">

            <button
              onClick={()=>editCategory(cat._id)}
              className="text-blue-600"
            >
              <FiEdit/>
            </button>

            <button
              onClick={()=>deleteCategory(cat._id)}
              className="text-red-600"
            >
              <FiTrash2/>
            </button>

          </div>

        </div>
      ))}

    </div>

  );
}