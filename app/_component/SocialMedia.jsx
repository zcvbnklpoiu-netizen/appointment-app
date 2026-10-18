import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTelegram } from "react-icons/fa6";

// Add an official URL here when the MediaBook account has been provided.
const SOCIAL_CHANNELS = [
  { name: "Facebook", Icon: FaFacebookF, url: null },
  { name: "Instagram", Icon: FaInstagram, url: null },
  { name: "Telegram", Icon: FaTelegram, url: null },
  { name: "LinkedIn", Icon: FaLinkedinIn, url: null },
];

const iconClassName = "flex size-12 items-center justify-center rounded-full border border-[#C8D5CC] bg-white text-[#263F3A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#263F3A] hover:bg-[#263F3A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#263F3A]";

export default function SocialMedia() {
  return (
    <section aria-labelledby="social-heading" className="bg-[#EEF2EB] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 text-center sm:flex-row sm:text-left">
        <div>
          <h2 id="social-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Stay connected with MediaBook</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">Follow our official channels for clinic updates and platform news.</p>
        </div>
        <ul aria-label="MediaBook social media channels" className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
          {SOCIAL_CHANNELS.map(({ name, Icon, url }) => (
            <li key={name}>
              {url ? (
                <Link href={url} aria-label={`MediaBook on ${name}`} title={name} className={iconClassName}>
                  <Icon aria-hidden="true" className="size-5" />
                </Link>
              ) : (
                <span role="img" aria-label={`${name} link not configured`} title={`${name} link not configured`} className={`${iconClassName} cursor-default opacity-80 hover:translate-y-0 hover:border-[#C8D5CC] hover:bg-white hover:text-[#263F3A]`}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-5 max-w-7xl text-center text-xs text-slate-500 sm:text-right">Official social links will be activated when configured.</p>
    </section>
  );
}
