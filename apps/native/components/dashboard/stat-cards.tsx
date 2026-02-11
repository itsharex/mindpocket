import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

interface StatCardsProps {
  totalBookmarks: number
  weekBookmarks: number
  totalChats: number
  embeddingRate: number
}

interface CardData {
  title: string
  value: string | number
  icon: keyof typeof Ionicons.glyphMap
  color: string
  bgColor: string
}

export function StatCards({
  totalBookmarks,
  weekBookmarks,
  totalChats,
  embeddingRate,
}: StatCardsProps) {
  const cards: CardData[] = [
    {
      title: "总收藏",
      value: totalBookmarks,
      icon: "bookmark",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      title: "本周新增",
      value: weekBookmarks,
      icon: "trending-up",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      title: "AI 对话",
      value: totalChats,
      icon: "chatbubbles",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
    },
    {
      title: "向量化率",
      value: `${embeddingRate}%`,
      icon: "analytics",
      color: "#f59e0b",
      bgColor: "#fffbeb",
    },
  ]

  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <View key={card.title} style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: card.bgColor }]}>
            <Ionicons color={card.color} name={card.icon} size={20} />
          </View>
          <Text style={styles.value}>{card.value}</Text>
          <Text style={styles.title}>{card.title}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  value: {
    fontSize: 28,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: "#737373",
  },
})
