import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

interface GrowthTrendBarProps {
  data: Array<{ date: string; count: number }>
}

export function GrowthTrendBar({ data }: GrowthTrendBarProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const maxCount = Math.max(...data.map((item) => item.count), 1)

  // 取最近 14 天数据用于展示迷你柱状图
  const recentData = data.slice(-14)

  // 计算趋势：比较后半段和前半段
  const midPoint = Math.floor(data.length / 2)
  const firstHalf = data.slice(0, midPoint).reduce((sum, item) => sum + item.count, 0)
  const secondHalf = data.slice(midPoint).reduce((sum, item) => sum + item.count, 0)
  const isGrowing = secondHalf >= firstHalf

  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>收藏增长趋势</Text>
        <Text style={styles.empty}>暂无数据</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>收藏增长趋势</Text>
        <View style={[styles.trendBadge, isGrowing ? styles.trendUp : styles.trendDown]}>
          <Ionicons
            color={isGrowing ? "#10b981" : "#ef4444"}
            name={isGrowing ? "trending-up" : "trending-down"}
            size={14}
          />
          <Text style={[styles.trendText, isGrowing ? styles.trendTextUp : styles.trendTextDown]}>
            {isGrowing ? "上升" : "下降"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>期间新增</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(total / (data.length || 1))}</Text>
          <Text style={styles.statLabel}>日均</Text>
        </View>
      </View>

      {/* Mini Bar Chart */}
      <View style={styles.chartContainer}>
        {recentData.map((item, index) => (
          <View key={item.date} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: index === recentData.length - 1 ? "#3b82f6" : "#dbeafe",
                },
              ]}
            />
          </View>
        ))}
      </View>

      <View style={styles.dateRange}>
        <Text style={styles.dateText}>{formatDate(recentData[0]?.date)}</Text>
        <Text style={styles.dateText}>{formatDate(recentData.at(-1)?.date)}</Text>
      </View>
    </View>
  )
}

function formatDate(dateStr?: string): string {
  if (!dateStr) {
    return ""
  }
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
  },
  empty: {
    fontSize: 14,
    color: "#a3a3a3",
    textAlign: "center",
    paddingVertical: 20,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: "#ecfdf5",
  },
  trendDown: {
    backgroundColor: "#fef2f2",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  trendTextUp: {
    color: "#10b981",
  },
  trendTextDown: {
    color: "#ef4444",
  },
  statsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  statItem: {
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#262626",
  },
  statLabel: {
    fontSize: 13,
    color: "#737373",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 2,
    minHeight: 2,
  },
  dateRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: "#a3a3a3",
  },
})
