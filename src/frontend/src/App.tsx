import Layout from "@/components/Layout";
import CanisterConfig from "@/pages/CanisterConfig";
import Composer from "@/pages/Composer";
import DeploymentChecklist from "@/pages/DeploymentChecklist";
import Gallery from "@/pages/Gallery";
import Hero from "@/pages/Hero";
import JobHistory from "@/pages/JobHistory";
import PaymentIntents from "@/pages/PaymentIntents";
import Pricing from "@/pages/Pricing";
import ProviderSettings from "@/pages/ProviderSettings";
import SystemStatus from "@/pages/SystemStatus";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <Layout>
        <Outlet />
      </Layout>
      <Toaster position="bottom-right" theme="dark" richColors />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Hero,
});
const composerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/composer",
  component: Composer,
});
const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: Gallery,
});
const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: Pricing,
});
const paymentIntentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-intents",
  component: PaymentIntents,
});
const providerSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/provider-settings",
  component: ProviderSettings,
});
const canisterConfigRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/canister-config",
  component: CanisterConfig,
});
const jobHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/job-history",
  component: JobHistory,
});
const systemStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system-status",
  component: SystemStatus,
});
const deploymentChecklistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/deployment-checklist",
  component: DeploymentChecklist,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  composerRoute,
  galleryRoute,
  pricingRoute,
  paymentIntentsRoute,
  providerSettingsRoute,
  canisterConfigRoute,
  jobHistoryRoute,
  systemStatusRoute,
  deploymentChecklistRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
