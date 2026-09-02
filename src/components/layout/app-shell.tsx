import * as React from "react";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { Composer } from "@/components/mail/composer";
import { OfflineBanner } from "@/components/common/states";
import { useMail } from "@/lib/mail/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { offline } = useMail();
  const [query, setQuery] = React.useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[272px] shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header query={query} onQueryChange={setQuery} />
        {offline && <OfflineBanner />}
        <main className="min-w-0 flex-1">
          <SearchContext.Provider value={query}>{children}</SearchContext.Provider>
        </main>
      </div>

      <Composer />
    </div>
  );
}

export const SearchContext = React.createContext("");
export const useSearchQuery = () => React.useContext(SearchContext);
