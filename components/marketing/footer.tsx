import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-muted py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-[14px] text-muted-foreground">{SITE.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/sign-in" className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-5xl px-5 text-[12px] text-muted-foreground sm:px-6">
        Demo figures are for a fictional business (Northstar Café) and are not real-world
        claims.
      </p>
    </footer>
  );
}
