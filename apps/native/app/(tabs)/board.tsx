import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FolderRankingList } from "@/components/dashboard/folder-ranking-list"
import { GrowthTrendBar } from "@/components/dashboard/growth-trend-bar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { TypeDistributionBar } from "@/components/dashboard/type-distribution-bar"
import { ApiError } from "@/lib/api-client"
import { type DashboardData, fetchDashboard } from "@/lib/dashboard-api"

export default function BoardScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string>()

  const loadData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }
        setError(undefined)
        const result = await fetchDashboard(30)
        setData(result)
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login")
          return
        }
        setError("加载失败，请下拉刷新重试")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [router]
  )

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRefresh = useCallback(() => {
    loadData(true)
  }, [loadData])

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>数据看板</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <DashboardContent data={data} error={error} loading={loading} />
      </ScrollView>
    </View>
  )
}

interface DashboardContentProps {
  data: DashboardData | null
  loading: boolean
  error?: string
}

function DashboardContent({ data, loading, error }: DashboardContentProps) {
  if (loading && !data) {
    return (
      <View style={styles.content}>
        <View style={skeletonStyles.statCards}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={skeletonStyles.statCard} />
          ))}
        </View>
        <View style={skeletonStyles.chart} />
        <View style={skeletonStyles.chart} />
        <View style={skeletonStyles.chart} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  if (!data) {
    return null
  }

  return (
    <View style={styles.content}>
      <StatCards
        embeddingRate={data.embeddingRate}
        totalBookmarks={data.totalBookmarks}
        totalChats={data.totalChats}
        weekBookmarks={data.weekBookmarks}
      />
      <GrowthTrendBar data={data.growthTrend} />
      <TypeDistributionBar data={data.typeDistribution} />
      <FolderRankingList data={data.folderRanking} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    height: 56,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#262626",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  content: {
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 14,
    color: "#a3a3a3",
  },
})

const skeletonStyles = StyleSheet.create({
  statCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    height: 120,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
  },
  chart: {
    height: 180,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
  },
})
