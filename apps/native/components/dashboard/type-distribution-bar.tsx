import { StyleSheet, Text, View } from "react-native"

interface TypeDistributionBarProps {
  data: Array<{ type: string; count: number }>
}

const typeLabels: Record<string, string> = {
  link: "链接",
  text: "文字",
  image: "图片",
  video: "视频",
  audio: "音频",
  pdf: "PDF",
}

const typeColors: Record<string, string> = {
  link: "#3b82f6",
  text: "#10b981",
  image: "#f59e0b",
  video: "#ef4444",
  audio: "#8b5cf6",
  pdf: "#ec4899",
}

export function TypeDistributionBar({ data }: TypeDistributionBarProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  if (total === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>内容类型分布</Text>
        <Text style={styles.empty}>暂无数据</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>内容类型分布</Text>

      {/* Stacked Bar */}
      <View style={styles.barContainer}>
        {data.map((item) => {
          const percentage = (item.count / total) * 100
          if (percentage < 1) {
            return null
          }
          return (
            <View
              key={item.type}
              style={[
                styles.barSegment,
                {
                  width: `${percentage}%`,
                  backgroundColor: typeColors[item.type] || "#a3a3a3",
                },
              ]}
            />
          )
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item) => {
          const percentage = Math.round((item.count / total) * 100)
          if (percentage < 1) {
            return null
          }
          return (
            <View key={item.type} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: typeColors[item.type] || "#a3a3a3" }]}
              />
              <Text style={styles.legendLabel}>{typeLabels[item.type] || item.type}</Text>
              <Text style={styles.legendValue}>{percentage}%</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: "#a3a3a3",
    textAlign: "center",
    paddingVertical: 20,
  },
  barContainer: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  barSegment: {
    height: "100%",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    color: "#525252",
  },
  legendValue: {
    fontSize: 13,
    color: "#a3a3a3",
  },
})
