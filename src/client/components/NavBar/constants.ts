import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

export const marketingNavigationItems: NavigationItem[] = [
  { name: "Features", to: "/#features" },
  { name: "Pricing", to: routes.PricingPageRoute.to },
  { name: "Documentation", to: DocsUrl },
  { name: "Blog", to: BlogUrl },
] as const;

export const demoNavigationitems: NavigationItem[] = [
  { name: "Tools", to: routes.ToolsRoute.to },
  { name: "Pricing", to: routes.PricingPageRoute.to },
] as const;
