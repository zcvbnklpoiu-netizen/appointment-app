import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Header() {
  const Menu = [
    {
      id: 1,
      name: "Home",
      path: "/",
    },
    {
      id: 2,
      name: "Explore",
      path: "/explore",
    },
    {
      id: 3,
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <div className="flex w-full items-center justify-between px-10 py-4">
      <div className="flex items-center gap-7">
        <Image
          src="/logo.png"
          alt="Logo"
          width={50}
          height={50}
        />

        <ul className="hidden gap-7 md:flex">
          {Menu.map((item) => (
            <li key={item.id}>
              <Link
                href={item.path}
                className="cursor-pointer rounded-md px-3 py-2 hover:bg-amber-600"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Button>Get Started</Button>
    </div>
  );
}

export default Header;