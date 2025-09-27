import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function ComparisonIndex() {
  const { chapterId, lessonId } = useLocalSearchParams();

  const goToMode = (modeId: string) => {
    router.push(
      `/(menu)/chapters/${chapterId}/lessons/${lessonId}/games/comparison/${modeId}`
    );
  };

  const modes = [
    { id: "fixed", title: "🎯 10 câu cố định" },
    { id: "timed", title: "⏱ Tính giờ" },
    { id: "lives", title: "❤️ 3 mạng" },
    { id: "hybrid", title: "⚡ Kết hợp" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chế độ chơi</Text>
      {modes.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.button}
          onPress={() => goToMode(m.id)}
        >
          <Text style={styles.text}>{m.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
