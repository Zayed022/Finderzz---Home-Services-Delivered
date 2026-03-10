import Layout from "../components/Layout";

export default function Dashboard() {

  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Orders</p>
          <h2 className="text-2xl font-bold">
            124
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold">
            ₹54,000
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Total Workers</p>
          <h2 className="text-2xl font-bold">
            32
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p>Active Services</p>
          <h2 className="text-2xl font-bold">
            18
          </h2>
        </div>

      </div>

    </Layout>
  );
}