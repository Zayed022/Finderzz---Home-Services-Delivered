export default function CategoryPanel({
  categories,
  selectCategory,
  createCategory,
  updateCategory,
  deleteCategory
}){

  const handleAdd = ()=>{
    const name = prompt("Category name");
    if(!name) return;

    createCategory({name});
  };

  return(

    <div className="bg-white p-4 rounded-xl shadow">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Categories</h2>

        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>

      {categories.map(cat=>(
        <div
          key={cat._id}
          className="flex justify-between p-2 border-b"
        >

          <span
            onClick={()=>selectCategory(cat)}
            className="cursor-pointer"
          >
            {cat.name}
          </span>

          <div className="flex gap-2">

            <button
              onClick={()=>{
                const name = prompt("New name",cat.name);
                updateCategory(cat._id,{name});
              }}
            >
              Edit
            </button>

            <button
              onClick={()=>deleteCategory(cat._id)}
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