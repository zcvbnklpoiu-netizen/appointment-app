import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";

function SocialMedia() {
  return (
    <section className="bg-blue-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">

        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          Follow MediaBook
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
          Stay connected with MediaBook and discover the latest healthcare
          updates, helpful tips, and news from our medical community.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5">

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <FaFacebookF className="text-xl" />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-pink-500 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <FaInstagram className="text-xl" />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            aria-label="Telegram"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-500 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <FaTelegramPlane className="text-xl" />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <FaYoutube className="text-xl" />
          </a>

          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
          >
            <FaTiktok className="text-xl" />
          </a>

        </div>

      </div>
    </section>
  );
}

export default SocialMedia;