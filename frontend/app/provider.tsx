"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
<<<<<<< HEAD
import { baseSepolia, base } from "wagmi/chains";
=======
import { baseGoerli, base, baseSepolia } from "wagmi/chains";
>>>>>>> b153ae9efbf98516fef189fb184d0064fc4b707c
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "afdac16b07284976cc7f71299771b2b7",
<<<<<<< HEAD
  chains: [baseSepolia],
=======
  chains: [baseSepolia, baseGoerli, base],
>>>>>>> b153ae9efbf98516fef189fb184d0064fc4b707c
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
