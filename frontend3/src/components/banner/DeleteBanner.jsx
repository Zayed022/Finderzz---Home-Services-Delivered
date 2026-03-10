
import toast from "react-hot-toast";
import API from "../../api/api";

export default function DeleteBanner({ banner, refresh, close }) {

  const deleteHandler = async()=>{

    try{

      await API.delete(`/banner/${banner._id}`);

      toast.success("Banner removed");

      refresh();
      close();

    }catch{
      toast.error("Failed to delete");
    }

  };

  return(

    <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">

      <h2 className="text-lg font-semibold mb-4">
        Delete Banner
      </h2>

      <p className="mb-6">
        Are you sure you want to delete this banner?
      </p>

      <div className="flex gap-4">

        <button
          onClick={deleteHandler}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>

        <button
          onClick={close}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}