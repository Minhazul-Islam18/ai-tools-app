import { LogIn, Menu, Sparkles } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link as ReactRouterLink } from "react-router";
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../client/components/ui/sheet";
import { throttleWithTrailingInvocation } from "../../../shared/utils";
import { UserDropdown } from "../../../user/UserDropdown";
import { UserMenuItems } from "../../../user/UserMenuItems";
import { useIsLandingPage } from "../../hooks/useIsLandingPage";
import { cn } from "../../utils";
import { DarkModeSwitcher } from "../DarkModeSwitcher";
import { Announcement } from "./Announcement";

export interface NavigationItem {
  name: string;
  to: string;
}

export function NavBar({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const isLandingPage = useIsLandingPage();

  useEffect(() => {
    const throttledHandler = throttleWithTrailingInvocation(() => {
      setIsScrolled(window.scrollY > 0);
    }, 50);

    window.addEventListener("scroll", throttledHandler);

    return () => {
      window.removeEventListener("scroll", throttledHandler);
      throttledHandler.cancel();
    };
  }, []);

  return (
    <>
      {isLandingPage && <Announcement />}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled && "top-4",
        )}
      >
        <div
          className={cn("transition-all duration-300", {
            "bg-background/90 border-border mx-4 rounded-full border pr-2 shadow-lg backdrop-blur-lg md:mx-20 lg:pr-0":
              isScrolled,
            "bg-background/80 border-border mx-0 border-b backdrop-blur-lg":
              !isScrolled,
          })}
        >
          <nav
            className={cn(
              "flex items-center justify-between transition-all duration-300",
              {
                "p-3 lg:px-6": isScrolled,
                "p-6 lg:px-8": !isScrolled,
              },
            )}
            aria-label="Global"
          >
            <div className="flex items-center gap-6">
              <WaspRouterLink
                to={routes.LandingPageRoute.to}
                className="flex items-center gap-2 transition-colors duration-300 ease-in-out group"
              >
                <div className="p-1.5 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
                  <Sparkles className={cn("text-primary-foreground transition-all duration-300", {
                    "w-4 h-4": !isScrolled,
                    "w-3.5 h-3.5": isScrolled,
                  })} />
                </div>
                <span
                  className={cn(
                    "font-bold tracking-tight text-foreground transition-all duration-300",
                    {
                      "text-base": !isScrolled,
                      "text-sm": isScrolled,
                    },
                  )}
                >
                  Gen<span className="text-primary">Kit</span>
                </span>
              </WaspRouterLink>

              <ul className="ml-4 hidden items-center gap-6 lg:flex">
                {renderNavigationItems(navigationItems)}
              </ul>
            </div>
            <NavBarMobileMenu
              isScrolled={isScrolled}
              navigationItems={navigationItems}
            />
            <NavBarDesktopUserDropdown isScrolled={isScrolled} />
          </nav>
        </div>
      </header>
    </>
  );
}

function NavBarDesktopUserDropdown({ isScrolled }: { isScrolled: boolean }) {
  const { data: user, isLoading: isUserLoading } = useAuth();

  return (
    <div className="hidden items-center justify-end gap-3 lg:flex lg:flex-1">
      <ul className="flex items-center justify-center gap-2 sm:gap-4">
        <DarkModeSwitcher />
      </ul>
      {isUserLoading ? null : !user ? (
        <div className="flex items-center gap-3 ml-3">
          <WaspRouterLink
            to={routes.LoginRoute.to}
            className={cn(
              "font-medium text-muted-foreground hover:text-foreground transition-colors duration-200",
              { "text-sm": !isScrolled, "text-xs": isScrolled }
            )}
          >
            <div className="flex items-center gap-1">
              Log in <LogIn size={isScrolled ? "0.85rem" : "0.95rem"} className="ml-0.5" />
            </div>
          </WaspRouterLink>
          <WaspRouterLink
            to={routes.SignupRoute.to}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors duration-200",
              { "text-sm": !isScrolled, "text-xs": isScrolled }
            )}
          >
            <Sparkles size={isScrolled ? "0.8rem" : "0.9rem"} />
            Get Started
          </WaspRouterLink>
        </div>
      ) : (
        <div className="ml-3">
          <UserDropdown user={user} />
        </div>
      )}
    </div>
  );
}

function NavBarMobileMenu({
  isScrolled,
  navigationItems,
}: {
  isScrolled: boolean;
  navigationItems: NavigationItem[];
}) {
  const { data: user, isLoading: isUserLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex lg:hidden">
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              "text-muted-foreground hover:text-muted hover:bg-accent inline-flex items-center justify-center rounded-md transition-colors",
            )}
          >
            <span className="sr-only">Open main menu</span>
            <Menu
              className={cn("transition-all duration-300", {
                "size-8 p-1": !isScrolled,
                "size-6 p-0.5": isScrolled,
              })}
              aria-hidden="true"
            />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <WaspRouterLink to={routes.LandingPageRoute.to} className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-base tracking-tight">
                  Gen<span className="text-primary">Kit</span>
                </span>
              </WaspRouterLink>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 flow-root">
            <div className="divide-border -my-6 divide-y">
              <ul className="space-y-2 py-6">
                {renderNavigationItems(navigationItems, setMobileMenuOpen)}
              </ul>
              <div className="py-6">
                {isUserLoading ? null : !user ? (
                  <WaspRouterLink to={routes.LoginRoute.to}>
                    <div className="text-foreground hover:text-primary flex items-center justify-end transition-colors duration-300 ease-in-out">
                      Log in <LogIn size="1.1rem" className="ml-1" />
                    </div>
                  </WaspRouterLink>
                ) : (
                  <ul className="space-y-2">
                    <UserMenuItems
                      user={user}
                      onItemClick={() => setMobileMenuOpen(false)}
                    />
                  </ul>
                )}
              </div>
              <div className="py-6">
                <DarkModeSwitcher />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function renderNavigationItems(
  navigationItems: NavigationItem[],
  setMobileMenuOpen?: Dispatch<SetStateAction<boolean>>,
) {
  const menuStyles = cn({
    "block rounded-lg px-3 py-2 text-sm font-medium leading-7 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors":
      !!setMobileMenuOpen,
    "text-sm font-normal leading-6 text-foreground duration-300 ease-in-out hover:text-primary transition-colors":
      !setMobileMenuOpen,
  });

  return navigationItems.map((item) => {
    return (
      <li key={item.name}>
        <ReactRouterLink
          to={item.to}
          className={menuStyles}
          onClick={setMobileMenuOpen && (() => setMobileMenuOpen(false))}
          target={item.to.startsWith("http") ? "_blank" : undefined}
        >
          {item.name}
        </ReactRouterLink>
      </li>
    );
  });
}

