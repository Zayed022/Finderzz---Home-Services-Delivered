
import toast from "react-hot-toast";
import API from "../../api/api";

export default function DeleteArea({ area, refresh, close }) {

  const deleteArea = async () => {
    try {

      await API.delete(`/area/${area._id}`);

      toast.success("Area disabled");
      refresh();
      close();

    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

      <h2 className="text-lg font-semibold mb-4">
        Disable Area
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to disable <b>{area.name}</b>?
      </p>

      <div className="flex gap-4">

        <button
          onClick={deleteArea}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Disable
        </button>

        <button
          onClick={close}
          className="border px-4 py-2 rounded-lg"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}