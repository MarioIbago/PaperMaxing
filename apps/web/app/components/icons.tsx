import type { ReactElement, SVGProps } from "react";

export type IconName =
  | "home" | "file" | "claims" | "figures" | "methods" | "references" | "authors"
  | "notebook" | "settings" | "menu" | "chevronDown" | "chevronRight" | "chevronLeft" | "chevronUp"
  | "external" | "download" | "upload" | "link" | "globe" | "cloud" | "lock" | "code"
  | "users" | "search" | "filter" | "more" | "bookmark" | "sparkles" | "building"
  | "database" | "sliders" | "gear" | "chart" | "warning" | "check" | "info" | "question"
  | "eye" | "grid" | "graph" | "plus" | "minus" | "fullscreen" | "close" | "send"
  | "arrow" | "copy" | "refresh" | "share" | "edit" | "book" | "cube" | "layers"
  | "target" | "quote" | "lightbulb" | "brain" | "shield" | "star" | "calendar" | "tag"
  | "graduation" | "balance" | "scale" | "flask" | "paperclip" | "archive" | "pin";

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, size = 18, ...props }: IconProps) {
  const p = { ...common, ...props };
  const c = (d: string) => <path d={d} />;
  const shapes: Record<IconName, ReactElement> = {
    home: <><path {...common} d="M3.5 10.8 12 3.8l8.5 7" /><path {...common} d="M5.4 9.8v9.4h13.2V9.8M9.2 19.2v-5.4h5.6v5.4" /></>,
    file: <><path {...common} d="M6 2.8h7.2l4.8 4.8v13.6H6z" /><path {...common} d="M13 2.8v5h5M8.6 12h6.8M8.6 15.5h5" /></>,
    claims: <><path {...common} d="M5 3.5h14v17H5z" /><path {...common} d="M8 8h8M8 11.5h8M8 15h4" /><path {...common} d="m15.3 16.4 1.3 1.3 2.6-2.8" /></>,
    figures: <><rect {...common} x="3.2" y="4" width="17.6" height="16" rx="1.6" /><circle {...common} cx="8" cy="9" r="1.5" /><path {...common} d="m5.3 17 4.2-4 3.1 2.8 2.2-2.1 3.9 3.3" /></>,
    methods: <><path {...common} d="M9.5 3.5h5M10.2 3.5v5.2L5.8 17a2 2 0 0 0 1.7 3h9a2 2 0 0 0 1.7-3l-4.4-8.3V3.5" /><path {...common} d="M7.8 15h8.4" /></>,
    references: <><path {...common} d="M8.3 8.2 10 6.5a3.3 3.3 0 0 1 4.7 4.7l-2.4 2.4a3.3 3.3 0 0 1-4.7 0" /><path {...common} d="m15.7 15.8-1.8 1.7a3.3 3.3 0 0 1-4.6-4.7l2.3-2.3a3.3 3.3 0 0 1 4.7 0" /></>,
    authors: <><circle {...common} cx="12" cy="8" r="3.3" /><path {...common} d="M5.3 20a6.7 6.7 0 0 1 13.4 0" /><path {...common} d="M17.5 5.5a3 3 0 0 1 0 5.8M19.2 14.5a4.8 4.8 0 0 1 2.1 4" /></>,
    notebook: <><path {...common} d="M6.5 3.5h11v17h-11zM4 7h2.5M4 11h2.5M4 15h2.5" /><path {...common} d="M10 8.5h4.5M10 12h4.5M10 15.5h3" /></>,
    settings: <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3.1 1.3v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3.1-1.3l-.1.1a1.8 1.8 0 0 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-1.3-3.1h-.2a1.8 1.8 0 0 1 0-3.6h.2a1.8 1.8 0 0 0 1.3-3.1l-.1-.1A1.8 1.8 0 0 1 7 2.6l.1.1a1.8 1.8 0 0 0 3.1-1.3v-.2a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3.1 1.3l.1-.1a1.8 1.8 0 0 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 1.3 3.1h.2a1.8 1.8 0 0 1 0 3.6h-.2a1.8 1.8 0 0 0-1.3 3.1Z" transform="scale(.73) translate(4.5 4.5)" /></>,
    menu: <><path {...common} d="M4 7h16M4 12h16M4 17h16" /></>,
    chevronDown: <path {...common} d="m6 9 6 6 6-6" />,
    chevronRight: <path {...common} d="m9 6 6 6-6 6" />,
    chevronLeft: <path {...common} d="m15 6-6 6 6 6" />,
    chevronUp: <path {...common} d="m6 15 6-6 6 6" />,
    external: <><path {...common} d="M13 5h6v6M19 5l-8 8" /><path {...common} d="M18 13v5H5V5h5" /></>,
    download: <><path {...common} d="M12 3v11M7.5 10.5 12 15l4.5-4.5M4 19.5h16" /></>,
    upload: <><path {...common} d="M12 16V5M7.5 9.5 12 5l4.5 4.5M4 19.5h16" /></>,
    link: <><path {...common} d="M8.3 8.2 10 6.5a3.3 3.3 0 0 1 4.7 4.7l-2.4 2.4a3.3 3.3 0 0 1-4.7 0" /><path {...common} d="m15.7 15.8-1.8 1.7a3.3 3.3 0 0 1-4.6-4.7l2.3-2.3a3.3 3.3 0 0 1 4.7 0" /></>,
    globe: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M3.8 12h16.4M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5C9.8 18.1 8.7 15.3 8.7 12S9.8 5.9 12 3.5Z" /></>,
    cloud: <><path {...common} d="M7.2 18.5h9.4a4.1 4.1 0 0 0 .3-8.2A5.3 5.3 0 0 0 6.5 9a4.8 4.8 0 0 0 .7 9.5Z" /></>,
    lock: <><rect {...common} x="5" y="10" width="14" height="10" rx="1.8" /><path {...common} d="M8 10V7.5a4 4 0 0 1 8 0V10M12 14v2.5" /></>,
    code: <><path {...common} d="m8.5 7-4 5 4 5M15.5 7l4 5-4 5M13.2 4.5l-2.4 15" /></>,
    users: <><circle {...common} cx="9" cy="8" r="3" /><path {...common} d="M3.8 20a5.2 5.2 0 0 1 10.4 0M16 5.5a2.8 2.8 0 0 1 0 5.4M17 14.7a4.2 4.2 0 0 1 3.2 4" /></>,
    search: <><circle {...common} cx="10.8" cy="10.8" r="6.3" /><path {...common} d="m16 16 4.2 4.2" /></>,
    filter: <><path {...common} d="M4 5h16l-6.3 7.2v5l-3.4 1.8v-6.8Z" /></>,
    more: <><circle fill="currentColor" cx="5" cy="12" r="1.3" /><circle fill="currentColor" cx="12" cy="12" r="1.3" /><circle fill="currentColor" cx="19" cy="12" r="1.3" /></>,
    bookmark: <path {...common} d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v16l-6-3.7-6 3.7Z" />,
    sparkles: <><path {...common} d="m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2Z" /><path {...common} d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" /><path {...common} d="m5 15 .5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5Z" /></>,
    building: <><path {...common} d="M4 20h16M5.5 20V8h13v12M3.5 8h17L12 3 3.5 8ZM8 11v5M12 11v5M16 11v5" /></>,
    database: <><ellipse {...common} cx="12" cy="5.5" rx="7.5" ry="2.8" /><path {...common} d="M4.5 5.5v6.4c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8V5.5M4.5 11.9v6.4c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6.4" /></>,
    sliders: <><path {...common} d="M4 6h16M4 12h16M4 18h16M8 4v4M15 10v4M10 16v4" /></>,
    gear: <><circle {...common} cx="12" cy="12" r="3" /><path {...common} d="m12 2 1 2.3a8.3 8.3 0 0 1 2.5 1l2.3-1 1.9 1.9-1 2.3a8.3 8.3 0 0 1 1 2.5l2.3 1v2.6l-2.3 1a8.3 8.3 0 0 1-1 2.5l1 2.3-1.9 1.9-2.3-1a8.3 8.3 0 0 1-2.5 1L12 22l-2.6-1-1-2.3a8.3 8.3 0 0 1-2.5-1l-2.3 1-1.9-1.9 1-2.3a8.3 8.3 0 0 1-1-2.5l-2.3-1V8.4l2.3-1a8.3 8.3 0 0 1 1-2.5l-1-2.3L5.6.7l2.3 1a8.3 8.3 0 0 1 2.5-1Z" transform="scale(.82) translate(2.6 2.6)" /></>,
    chart: <><path {...common} d="M4 20V4M4 20h17" /><path {...common} d="m7 16 3.1-4 3 2 4.9-7" /></>,
    warning: <><path {...common} d="m12 3 9 16H3Z" /><path {...common} d="M12 9v4M12 16.5v.2" /></>,
    check: <path {...common} d="m5 12 4.2 4.2L19 6.5" />,
    info: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M12 10.5v5M12 7.5v.2" /></>,
    question: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="M9.4 9.3a2.7 2.7 0 1 1 4.8 1.7c-1.4 1.2-2.2 1.7-2.2 3.2M12 17.4v.2" /></>,
    eye: <><path {...common} d="M2.8 12s3.2-5.1 9.2-5.1 9.2 5.1 9.2 5.1-3.2 5.1-9.2 5.1S2.8 12 2.8 12Z" /><circle {...common} cx="12" cy="12" r="2.1" /></>,
    grid: <><rect {...common} x="4" y="4" width="6" height="6" rx=".7" /><rect {...common} x="14" y="4" width="6" height="6" rx=".7" /><rect {...common} x="4" y="14" width="6" height="6" rx=".7" /><rect {...common} x="14" y="14" width="6" height="6" rx=".7" /></>,
    graph: <><circle {...common} cx="12" cy="6" r="2.2" /><circle {...common} cx="5" cy="17" r="2.2" /><circle {...common} cx="19" cy="17" r="2.2" /><path {...common} d="m10.4 7.8-3.8 7.4M13.6 7.8l3.8 7.4M7.2 17h9.6" /></>,
    plus: <><path {...common} d="M12 4v16M4 12h16" /></>,
    minus: <path {...common} d="M4 12h16" />,
    fullscreen: <><path {...common} d="M8 4H4v4M16 4h4v4M8 20H4v-4M20 16v4h-4" /></>,
    close: <><path {...common} d="m5 5 14 14M19 5 5 19" /></>,
    send: <><path {...common} d="m4 5 16 7-16 7 3.5-7Z" /><path {...common} d="M7.5 12H20" /></>,
    arrow: <><path {...common} d="M4 12h15M14 6l6 6-6 6" /></>,
    copy: <><rect {...common} x="8" y="8" width="11" height="11" rx="1.3" /><path {...common} d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" /></>,
    refresh: <><path {...common} d="M19 8a7.7 7.7 0 0 0-13-1.6L4 8.5M4 4.5v4h4" /><path {...common} d="M5 16a7.7 7.7 0 0 0 13 1.6l2-2.1M20 19.5v-4h-4" /></>,
    share: <><circle {...common} cx="6" cy="12" r="2.2" /><circle {...common} cx="18" cy="6" r="2.2" /><circle {...common} cx="18" cy="18" r="2.2" /><path {...common} d="m8 11 7.8-4M8 13l7.8 4" /></>,
    edit: <><path {...common} d="m5 16-.8 4 4-.8L18.8 8.6a2.8 2.8 0 0 0-4-4Z" /><path {...common} d="m13.5 6.5 4 4" /></>,
    book: <><path {...common} d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5Z" /><path {...common} d="M5 4.5v17M8.5 6h6.5" /></>,
    cube: <><path {...common} d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path {...common} d="m4 7.5 8 4.6 8-4.6M12 12.1V21" /></>,
    layers: <><path {...common} d="m12 4 8 4-8 4-8-4Z" /><path {...common} d="m4 12 8 4 8-4M4 16l8 4 8-4" /></>,
    target: <><circle {...common} cx="12" cy="12" r="8.5" /><circle {...common} cx="12" cy="12" r="4.5" /><circle fill="currentColor" cx="12" cy="12" r="1.2" /></>,
    quote: <><path {...common} d="M8.2 10.2H4.8A1.8 1.8 0 0 0 3 12v3.2A1.8 1.8 0 0 0 4.8 17h3.4A1.8 1.8 0 0 0 10 15.2v-6A3.2 3.2 0 0 0 6.8 6M16.2 10.2h-3.4a1.8 1.8 0 0 0-1.8 1.8v3.2a1.8 1.8 0 0 0 1.8 1.8h3.4a1.8 1.8 0 0 0 1.8-1.8v-6A3.2 3.2 0 0 0 14.8 6" /></>,
    lightbulb: <><path {...common} d="M8.5 14.6a5.1 5.1 0 1 1 7 0c-.9.8-1.5 1.7-1.6 2.6H10c-.1-.9-.7-1.8-1.5-2.6ZM10 20h4M10.6 22h2.8" /></>,
    brain: <><path {...common} d="M9.5 5.2a3.3 3.3 0 0 0-5.1 3.1A3.6 3.6 0 0 0 5 15a3.4 3.4 0 0 0 4.8 3.8 3.4 3.4 0 0 0 4.4 0A3.4 3.4 0 0 0 19 15a3.6 3.6 0 0 0 .6-6.7 3.3 3.3 0 0 0-5.1-3.1A3.4 3.4 0 0 0 9.5 5.2Z" /><path {...common} d="M12 5v14M8.3 8.2H10M14 8.2h1.7M7.5 13H10M14 13h2.5" /></>,
    shield: <><path {...common} d="M12 3 20 6v5.6c0 4.8-3.2 8-8 9.4-4.8-1.4-8-4.6-8-9.4V6Z" /><path {...common} d="m8.5 12 2.2 2.2 4.8-5" /></>,
    star: <path {...common} d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
    calendar: <><rect {...common} x="4" y="5" width="16" height="15" rx="1.5" /><path {...common} d="M8 3v4M16 3v4M4 9h16" /></>,
    tag: <><path {...common} d="m4 4 8.8.5L20 11.7 11.7 20 4.5 12.8Z" /><circle {...common} cx="8" cy="8" r="1.2" /></>,
    graduation: <><path {...common} d="m3 9 9-5 9 5-9 5Z" /><path {...common} d="M7 11.2V16c2.9 2.1 7.1 2.1 10 0v-4.8M21 9v6" /></>,
    balance: <><path {...common} d="M12 4v16M7 7h10M5 7l-3 6a3.5 3.5 0 0 0 6 0ZM19 7l-3 6a3.5 3.5 0 0 0 6 0ZM8 20h8" /></>,
    scale: <><path {...common} d="M12 4v16M7 7h10M5 7l-3 6a3.5 3.5 0 0 0 6 0ZM19 7l-3 6a3.5 3.5 0 0 0 6 0ZM8 20h8" /></>,
    flask: <><path {...common} d="M9 3h6M10 3v5l-5.4 9.2A2 2 0 0 0 6.3 20h11.4a2 2 0 0 0 1.7-2.8L14 8V3" /><path {...common} d="M7.2 15h9.6" /></>,
    paperclip: <path {...common} d="m8 12.5 5.8-5.8a3.4 3.4 0 0 1 4.8 4.8l-7 7a4.8 4.8 0 0 1-6.8-6.8l7-7" />,
    archive: <><path {...common} d="M4 6h16v14H4zM3 3h18v3H3zM9 10h6" /></>,
    pin: <><path {...common} d="m15 4 5 5-3 1-3 6-2-2-2 2-1-1 2-2-2-2 6-3Z" /><path {...common} d="m7 17-3 3" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" {...p}>{shapes[name] ?? c("M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z")}</svg>;
}

export function LaurelMark({ size = 54, withLetter = true }: { size?: number; withLetter?: boolean }) {
  return (
    <svg className="laurel-mark" aria-hidden="true" width={size} height={size} viewBox="0 0 64 64">
      <g fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 51C10 42 7 28 12 15" />
        <path d="M43 51c11-9 14-23 9-36" />
        <path d="M14 19c5-1 8 1 10 5M11 27c5-1 9 1 11 5M12 36c5-1 8 1 10 5M16 44c4 0 7 2 8 5" />
        <path d="M50 19c-5-1-8 1-10 5M53 27c-5-1-9 1-11 5M52 36c-5-1-8 1-10 5M48 44c-4 0-7 2-8 5" />
        <path d="M28 54c2-3 6-3 8 0" />
      </g>
      {withLetter ? <text x="32" y="39" textAnchor="middle" fontFamily="Georgia, serif" fontSize="29" fill="currentColor">P</text> : null}
    </svg>
  );
}

export function IonicColumn({ className = "" }: { className?: string }) {
  return (
    <svg className={`ionic-column ${className}`} viewBox="0 0 150 430" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".62">
        <path d="M9 45h132M1 58h148M17 74h116M23 74v282M127 74v282M31 90h88M31 356h88M24 371h102M14 386h122M4 399h142" />
        <path d="M18 46c-9-12-2-27 12-33 6 4 13 10 19 10 7 0 10-7 15-12 5 5 8 12 15 12 6 0 13-6 19-10 14 6 21 21 12 33" />
        <path d="M43 84v272M107 84v272M48 95v255M102 95v255" />
        <path d="M7 405c34 7 102 7 136 0" />
      </g>
    </svg>
  );
}

export function Avatar({ initials = "YV", variant = "violet" }: { initials?: string; variant?: "violet" | "olive" | "gold" }) {
  return <span className={`avatar avatar-${variant}`} aria-label={`Avatar ${initials}`}>{initials}</span>;
}
