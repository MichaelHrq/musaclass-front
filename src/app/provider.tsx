'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react"
import { Toaster } from "sonner"

export default function Provider({children}: {children: React.ReactNode}) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors visibleToasts={1} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )

}