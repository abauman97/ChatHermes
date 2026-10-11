import type { Activity } from "../../../types/hermes";

export const isCommand = (activity: Activity) =>
  ["terminal", "execute_code", "python"].includes(activity.toolName || "");

function argumentsOf(activity: Activity): Record<string, unknown> {
  try {
    return JSON.parse(activity.content) || {};
  } catch {
    // Streaming arguments may not yet be valid JSON.
    return {};
  }
}

export function commandPreview(activity: Activity): string {
  const args = argumentsOf(activity);
  const command = args.command ?? args.code;
  return typeof command === "string" ? command.trim().split("\n")[0] || "" : "";
}

export function toolLabel(activity: Activity, active: boolean): string {
  if (isCommand(activity)) {
    const verb = active ? "Running" : activity.state === "completed" ? "Ran" : "Command";
    return `${verb} ${commandPreview(activity) || "command"}`;
  }
  const name = (activity.toolName || "tool").replace(/_/g, " ");
  if (/^(used|using) tool$/i.test(activity.title))
    return `${active ? "Using" : activity.state === "completed" ? "Used" : "Tool:"} ${name}`;
  return activity.title || name;
}

// Mirror Desktop's run-summary categories and clause order. Cards are split
// out before this runs; the rows below the summary retain each call's details.
const categories = {
  explore: { past: "Explored", present: "Exploring", nouns: ["file", "files"] },
  search: { past: "Searched", present: "Searching", nouns: ["query", "queries"] },
  read: { past: "Read", present: "Reading", nouns: ["page", "pages"] },
  browse: { past: "Opened", present: "Opening", nouns: ["page", "pages"] },
  interact: {
    past: "Performed",
    present: "Performing",
    nouns: ["browser action", "browser actions"],
  },
  analyze: { past: "Analyzed", present: "Analyzing", nouns: ["image", "images"] },
  run: { past: "Ran", present: "Running", nouns: ["command", "commands"] },
  other: { past: "Used", present: "Using", nouns: ["tool", "tools"] },
} as const;
type Category = keyof typeof categories;
function categoryOf(activity: Activity): Category {
  const name = activity.toolName || "";
  if (isCommand(activity)) return "run";
  if (["read_file", "list_files", "search_files", "file_search", "search"].includes(name))
    return "explore";
  if (["web_search", "session_search_recall"].includes(name)) return "search";
  if (name === "web_extract") return "read";
  if (name === "browser_navigate") return "browse";
  if (name.startsWith("browser_")) return "interact";
  if (name === "vision_analyze") return "analyze";
  return "other";
}
function targetOf(activity: Activity, category: Category): string {
  const args = argumentsOf(activity);
  if (category === "run") return commandPreview(activity);
  if (category === "other" || category === "interact") return "";
  if (category === "search") {
    const query = args.query ?? args.search_term;
    return typeof query === "string" ? `“${query.slice(0, 48)}”` : "";
  }
  if (category === "read" || category === "browse") {
    const url = Array.isArray(args.urls) ? args.urls[0] : args.url;
    try {
      return typeof url === "string" ? new URL(url).hostname : "";
    } catch {
      return "";
    }
  }
  const path = args.path ?? args.file ?? args.filepath;
  return typeof path === "string" ? path.split(/[\\/]/).at(-1) || "" : "";
}
export function toolGroupLabel(activities: Activity[], live: boolean): string {
  const narrating = live
    ? (activities.find((activity) => !activity.complete) ?? activities.at(-1))
    : undefined;
  const liveCategory = narrating ? categoryOf(narrating) : undefined;
  const clauses: string[] = [];
  for (const category of Object.keys(categories) as Category[]) {
    const group = activities.filter((activity) => categoryOf(activity) === category);
    if (!group.length) continue;
    const copy = categories[category];
    const active = category === liveCategory;
    const completed = group.every((activity) => activity.state === "completed");
    const count = group.reduce((sum, activity) => {
      const urls = argumentsOf(activity).urls;
      return sum + (category === "read" && Array.isArray(urls) && urls.length ? urls.length : 1);
    }, 0);
    const target =
      count === 1 && (active || category !== "run") ? targetOf(group[0]!, category) : "";
    const verb = active ? copy.present : completed ? copy.past : "";
    clauses.push(
      [verb, target || `${count} ${copy.nouns[count === 1 ? 0 : 1]}`].filter(Boolean).join(" "),
    );
  }
  const failed = activities.filter((activity) => activity.state === "failed").length;
  if (failed) clauses.push(`${failed} failed`);
  return clauses
    .map((clause, index) => (index ? clause.charAt(0).toLowerCase() + clause.slice(1) : clause))
    .join(", ");
}
