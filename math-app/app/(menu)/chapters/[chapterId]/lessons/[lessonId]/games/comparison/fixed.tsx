import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import Tutorial from "./components/Tutorial";

export default function FixedMode() {
  const [step, setStep] = useState<"tutorial" | "game" | "paused" | "result">(
    "tutorial"
  );
  const [numbers, setNumbers] = useState({ a: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(1);
  const totalQuestions = 10;

  const generateNumbers = () => ({
    a: Math.floor(Math.random() * 10) + 1,
    b: Math.floor(Math.random() * 10) + 1,
  });

  const startGame = () => {
    setNumbers(generateNumbers());
    setScore(0);
    setQuestion(1);
    setStep("game");
  };

  const checkAnswer = (choice: "<" | ">" | "=") => {
    let correct: "<" | ">" | "=" = "=";
    if (numbers.a < numbers.b) correct = "<";
    else if (numbers.a > numbers.b) correct = ">";
    if (choice === correct) setScore((prev) => prev + 1);

    if (question < totalQuestions) {
      setQuestion((prev) => prev + 1);
      setNumbers(generateNumbers());
    } else {
      setStep("result");
    }
  };

  // 👉 Tutorial
  if (step === "tutorial") {
    return (
      <View style={styles.container}>
        <Tutorial />
        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.startText}>🎮 Bắt đầu chơi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => router.back()} // quay về màn hình chọn chế độ
        >
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👉 Result
  if (step === "result") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kết thúc 🎉</Text>
        <Text style={styles.text}>
          Điểm số: {score}/{totalQuestions}
        </Text>
        <TouchableOpacity style={styles.startBtn} onPress={startGame}>
          <Text style={styles.startText}>🔁 Chơi lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👉 Paused
  if (step === "paused") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>⏸ Trò chơi đã dừng</Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setStep("game")}
        >
          <Text style={styles.startText}>▶ Tiếp tục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👉 Game
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Câu {question}/{totalQuestions}
      </Text>
      <Text style={styles.numbers}>
        {numbers.a} ? {numbers.b}
      </Text>
      <View style={styles.row}>
        {["<", ">", "="].map((sign) => (
          <TouchableOpacity
            key={sign}
            style={styles.btn}
            onPress={() => checkAnswer(sign as "<" | ">" | "=")}
          >
            <Text style={styles.btnText}>{sign}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.text}>Điểm: {score}</Text>

      {/* Nút điều khiển */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setStep("paused")}
        >
          <Text style={styles.startText}>⏸ Dừng lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  numbers: { fontSize: 36, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", marginBottom: 20, gap: 10 },
  btn: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  btnText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  startBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  pauseBtn: {
    backgroundColor: "#f39c12",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  exitBtn: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  startText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  text: { fontSize: 18, marginTop: 10 },
});
