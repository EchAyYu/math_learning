import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function ComparisonMenu() {
  const goToMode = (mode: string) => {
    router.push(`/games/comparison/${mode}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn chế độ chơi So sánh số</Text>

      <TouchableOpacity style={styles.button} onPress={() => goToMode("fixed")}>
        <Text style={styles.buttonText}>📘 10 câu cố định</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => goToMode("timed")}>
        <Text style={styles.buttonText}>⏱️ 60 giây</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => goToMode("lives")}>
        <Text style={styles.buttonText}>❤️ 3 mạng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => goToMode("hybrid")}
      >
        <Text style={styles.buttonText}>⚡ Kết hợp</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 30 },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
