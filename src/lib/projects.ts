import type { Project, Session } from '../types/hermes'
export function projectRoot(project: Project): string | undefined {
  return project.path || project.repos.find(repo => repo.path)?.path || undefined
}
export function projectSessions(project: Project): Session[] {
  const rows = project.repos.flatMap(repo => repo.groups.flatMap(lane => lane.sessions))
  return [...new Map(rows.map(row => [row.id, row])).values()].sort((a, b) => (b.last_active || 0) - (a.last_active || 0))
}
