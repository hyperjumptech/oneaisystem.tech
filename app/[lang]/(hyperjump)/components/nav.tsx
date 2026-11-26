"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  oneaiNavCapabilities,
  oneaiNavComparison,
  oneaiNavGetStarted,
  oneaiNavFaq,
  oneaiNavSupport
} from "@/locales/.generated/server";
import type { SupportedLanguage } from "@/locales/.generated/types";
import StickyNavigationMain from "../../../components/sticky-nav-main";

function menu(lang: SupportedLanguage) {
  return [
    { label: oneaiNavCapabilities(lang), href: `/${lang}#capabilities` },
    { label: oneaiNavComparison(lang), href: `/${lang}#comparison` },
    { label: oneaiNavGetStarted(lang), href: `/${lang}/get-started` },
    { label: oneaiNavSupport(lang), href: `/${lang}#support` },
    { label: oneaiNavFaq(lang), href: `/${lang}#faqs` }
  ];
}

type NavProps = {
  lang: SupportedLanguage;
};

export default function Nav({ lang }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const solid =
    pathname === `/${lang}/get-started` ||
    pathname.startsWith(`/${lang}/get-started/`);

  return (
    <StickyNavigationMain solid={solid}>
      <NavContainer
        className={cn(
          "w-full",
          solid || isOpen
            ? "border-b border-black/6 bg-white/95"
            : "transition-[background-color,border-color] duration-500 group-data-[scroll=true]:border-b group-data-[scroll=true]:border-black/6 group-data-[scroll=true]:bg-white/95"
        )}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 md:px-20 xl:px-0">
          <Link
            href={`/${lang}`}
            onClick={() => setIsOpen(false)}
            className="inline-flex shrink-0 items-center">
            <Logo isOpen={isOpen} solid={solid} />
          </Link>
          <CenterNavItems>
            <NavigationMenu className="mx-8 xl:mx-0">
              <NavigationMenuList className="flex items-center gap-1">
                {menu(lang).map(({ href, label }) => (
                  <NavigationMenuItem key={label} className="flex items-center">
                    <Link
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-[15px] font-medium tracking-tight",
                        solid
                          ? "text-hyperjump-black hover:bg-black/4"
                          : "group-data-[scroll=true]:text-hyperjump-black transition-all duration-300 group-data-[scroll=false]:text-white/80 hover:group-data-[scroll=false]:bg-white/10 hover:group-data-[scroll=false]:text-white hover:group-data-[scroll=true]:bg-black/4"
                      )}>
                      {label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </CenterNavItems>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "ml-2 rounded-lg p-1.5 hover:bg-black/4 lg:hidden",
                !solid && "transition-colors"
              )}
              aria-label="Toggle menu">
              <svg
                className={cn(
                  "h-5 w-5",
                  solid || isOpen
                    ? "stroke-hyperjump-black"
                    : "group-data-[scroll=true]:stroke-hyperjump-black stroke-white transition-colors"
                )}
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </NavContainer>

      {isOpen && (
        <div className="border-b border-black/6 bg-white/95 lg:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-4 md:px-20 xl:px-0">
            {menu(lang).map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "text-hyperjump-black rounded-xl px-4 py-3 text-lg font-medium tracking-tight hover:bg-black/3",
                  !solid && "transition-all duration-200"
                )}
                onClick={() => setIsOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </StickyNavigationMain>
  );
}

function NavContainer({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto mt-0 flex w-full flex-wrap items-center justify-between border border-transparent py-2.5 md:py-3.5",
        className
      )}>
      {children}
    </div>
  );
}

function CenterNavItems({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden flex-1 items-center justify-end space-x-8 lg:flex">
      {children}
    </div>
  );
}

function Logo({ isOpen, solid }: { isOpen: boolean; solid: boolean }) {
  if (solid || isOpen) {
    return (
      <Image
        src="/images/oneai/logo-on-light.png"
        alt="OneAI"
        width={315}
        height={110}
        className="h-8 w-auto"
        priority
      />
    );
  }

  return (
    <>
      <Image
        src="/images/oneai/logo-on-dark.png"
        alt="OneAI"
        width={315}
        height={110}
        className="h-8 w-auto group-data-[scroll=true]:hidden"
        priority
      />
      <Image
        src="/images/oneai/logo-on-light.png"
        alt="OneAI"
        width={315}
        height={110}
        className="hidden h-8 w-auto group-data-[scroll=true]:block"
      />
    </>
  );
}
