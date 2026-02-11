import { requestJson } from "./api-client"

export interface DashboardData {
  totalBookmarks: number
  weekBookmarks: number
  totalChats: number
  embeddingRate: number
  typeDistribution: Array<{ type: string; count: number }>
  folderRanking: Array<{ name: string; emoji: string; count: number }>
  growthTrend: Array<{ date: string; count: number }>
}

export function fetchDashboard(days = 30): Promise<DashboardData> {
  return requestJson<DashboardData>(`/api/dashboard?days=${days}`)
}
