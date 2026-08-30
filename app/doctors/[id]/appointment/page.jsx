import Link from 'next/link';

export default async function BookAppointmentPage({ params }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

        <Link
          href={`/doctors/${id}`}
          className="text-blue-600 font-semibold text-sm"
        >
          ← Back to Doctor
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Book Appointment
          </h1>

          <p className="text-slate-500 mt-2">
            Schedule an appointment with this doctor.
          </p>
        </div>

        <form className="mt-8 space-y-5">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Appointment Date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Appointment Time
            </label>

            <input
              type="time"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Notes
            </label>

            <textarea
              rows="4"
              placeholder="Tell us anything important..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Confirm Appointment
          </button>

        </form>
      </div>
    </main>
  );
}