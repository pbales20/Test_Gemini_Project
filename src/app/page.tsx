export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-12 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
        Welcome to the CFB Draft League Portal
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        The backend schema and data APIs are set up. We are ready to start building out the draft room and the Baylor weekly pick hub.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            1
          </div>
          <h2 className="text-xl font-semibold mb-2">The Draft Room</h2>
          <p className="text-slate-500">Pick your 5 Win Teams and 2 Loss Teams.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
            2
          </div>
          <h2 className="text-xl font-semibold mb-2">Baylor Hub</h2>
          <p className="text-slate-500">Make your weekly Baylor pick Against The Spread.</p>
        </div>
      </div>
    </div>
  );
}
