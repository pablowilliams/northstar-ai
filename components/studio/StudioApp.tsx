"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Boxes,
  ChevronRight,
  CircleHelp,
  Command,
  FileBarChart,
  LayoutDashboard,
  Menu,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Sparkles,
  TestTubeDiagonal,
  X,
} from "lucide-react";
import { ArchitectureView } from "./views/ArchitectureView";
import { EvidenceView } from "./views/EvidenceView";
import { OverviewView } from "./views/OverviewView";
import { PortfolioView } from "./views/PortfolioView";
import { PrototypeView } from "./views/PrototypeView";
import { RoadmapView } from "./views/RoadmapView";
import {
  isWorkspaceId,
  workspaceDefinitions,
  type WorkspaceId,
} from "@/lib/workspaces";

type View = WorkspaceId;
const icons = {
  overview: LayoutDashboard,
  portfolio: Boxes,
  prototype: TestTubeDiagonal,
  evidence: FileBarChart,
  architecture: Network,
  roadmap: Activity,
};
const navigation = workspaceDefinitions.map((item) => ({
  ...item,
  icon: icons[item.id],
}));

export function StudioApp() {
  const [view, setView] = useState<View>("overview"),
    [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [commandOpen, setCommandOpen] = useState(false),
    [query, setQuery] = useState(""),
    [commandIndex, setCommandIndex] = useState(0);
  const navigate = useCallback((target: string) => {
    if (!isWorkspaceId(target)) return;
    setView(target);
    setMobileOpen(false);
    window.history.replaceState(null, "", `#${target}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hash = window.location.hash.slice(1);
      if (isWorkspaceId(hash)) setView(hash);
      setCollapsed(
        window.localStorage.getItem("northstar-sidebar") === "collapsed",
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    function keys(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((x) => !x);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setMobileOpen(false);
      }
      if (
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        /^[1-6]$/.test(event.key) &&
        !["INPUT", "TEXTAREA"].includes((event.target as HTMLElement).tagName)
      )
        navigate(navigation[Number(event.key) - 1].id);
    }
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [navigate]);
  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(
      "northstar-sidebar",
      next ? "collapsed" : "expanded",
    );
  }
  const current = navigation.find((x) => x.id === view)!;
  const filtered = useMemo(
    () =>
      navigation.filter((x) =>
        (x.label + " " + x.hint).toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  function selectCommand(index: number) {
    const item = filtered[index];
    if (!item) return;
    navigate(item.id);
    setCommandOpen(false);
    setQuery("");
    setCommandIndex(0);
  }
  return (
    <main className={`app-shell ${collapsed ? "app-shell--collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside
        className={`app-sidebar ${mobileOpen ? "app-sidebar--open" : ""}`}
        aria-label="Primary navigation"
      >
        <div className="brand-lockup">
          <span className="brand-mark">
            <Sparkles size={17} />
          </span>
          <div>
            <b>Northstar</b>
            <small>Transformation Studio</small>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="engagement-chip">
          <div>
            <span className="live-dot" /> Active engagement
          </div>
          <b>Aster & Row</b>
          <small>Customer resolution · Investment gate</small>
          <div className="engagement-progress">
            <i>
              <b />
            </i>
            <span>82%</span>
          </div>
        </div>
        <nav>
          {navigation.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={view === item.id ? "active" : ""}
                aria-current={view === item.id ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">
                  <Icon size={17} />
                </span>
                <span className="nav-copy">
                  <b>{item.label}</b>
                  <small>{item.hint}</small>
                </span>
                <kbd>{index + 1}</kbd>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-lower">
          <button>
            <span className="nav-icon">
              <CircleHelp size={17} />
            </span>
            <span className="nav-copy">
              <b>Delivery guide</b>
              <small>108-page blueprint</small>
            </span>
          </button>
          <button>
            <span className="nav-icon">
              <Settings2 size={17} />
            </span>
            <span className="nav-copy">
              <b>Environment</b>
              <small>Synthetic simulation</small>
            </span>
          </button>
        </div>
        <footer>
          <div className="user-avatar">PW</div>
          <span>
            <b>Pablo Williams</b>
            <small>Solution architect</small>
          </span>
          <button
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </footer>
      </aside>
      <section className="app-main" id="main-content" tabIndex={-1}>
        <header className="app-topbar">
          <div className="topbar-path">
            <button
              className="mobile-menu"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>
            <span>Northstar</span>
            <ChevronRight size={13} />
            <b>{current.label}</b>
          </div>
          <div className="topbar-actions">
            <button
              className="command-trigger"
              onClick={() => setCommandOpen(true)}
            >
              <Search size={14} />
              <span>Search workspace</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="system-status">
              <span />
              <b>All systems operational</b>
            </div>
            <a href="/api/export/steerco" className="topbar-export">
              Export brief
            </a>
            <div className="top-avatar">PW</div>
          </div>
        </header>
        <div className="app-content">
          {view === "overview" && <OverviewView navigate={navigate} />}{" "}
          {view === "portfolio" && <PortfolioView navigate={navigate} />}{" "}
          {view === "prototype" && <PrototypeView />}{" "}
          {view === "evidence" && <EvidenceView />}{" "}
          {view === "architecture" && <ArchitectureView />}{" "}
          {view === "roadmap" && <RoadmapView />}
        </div>
      </section>
      {mobileOpen && (
        <button
          className="sidebar-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      {commandOpen && (
        <div
          className="command-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Search workspace"
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) setCommandOpen(false);
          }}
        >
          <div className="command-menu">
            <header>
              <Search size={18} />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCommandIndex(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCommandIndex((i) =>
                      Math.min(i + 1, filtered.length - 1),
                    );
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCommandIndex((i) => Math.max(i - 1, 0));
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    selectCommand(commandIndex);
                  }
                }}
                placeholder="Go to a workspace…"
                aria-controls="workspace-command-results"
                aria-activedescendant={
                  filtered[commandIndex]
                    ? `command-${filtered[commandIndex].id}`
                    : undefined
                }
              />
              <kbd>ESC</kbd>
            </header>
            <div className="command-results" id="workspace-command-results">
              <span>Workspaces</span>
              {filtered.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    id={`command-${item.id}`}
                    key={item.id}
                    className={commandIndex === index ? "active" : ""}
                    onMouseEnter={() => setCommandIndex(index)}
                    onClick={() => selectCommand(index)}
                  >
                    <Icon size={17} />
                    <span>
                      <b>{item.label}</b>
                      <small>{item.hint}</small>
                    </span>
                    <kbd>{item.shortcut}</kbd>
                  </button>
                );
              })}
              {filtered.length === 0 && <p>No workspace matches “{query}”.</p>}
            </div>
            <footer>
              <span>
                <Command size={12} /> + K to open
              </span>
              <span>↑↓ navigate</span>
              <span>↵ select</span>
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
