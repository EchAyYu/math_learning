import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Tutorial from "./components/Tutorial";

export default function HybridMode() {
  const [step, setStep] = useState<"tutorial" | "game" | "result">("tutorial");
  const [numbers, setNumbers] = useState({ a: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const totalQuestions = 10;

  const generateNumbers = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b };
  };

  useEffect(() => {
    if (step === "game") {
      setNumbers(generateNumbers());
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep("result");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const checkAnswer = (choice: "<" | ">" | "=") => {
    let correct: "<" | ">" | "=" = "=";
    if (numbers.a < numbers.b) correct = "<";
    else if (numbers.a > numbers.b) correct = ">";
    if (choice === correct) setScore(score + 1);

    if (question < totalQuestions) {
      setQuestion(question + 1);
      setNumbers(generateNumbers());
    } else {
      setStep("result");
    }
  };

  if (step === "tutorial") {
    return (
      <View style={styles.container}>
        <Tutorial />
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setStep("game")}
        >
          <Text style={styles.startText}>🎮 Bắt đầu chơi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === "result") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kết thúc 🎉</Text>
        <Text style={styles.text}>
          Điểm số: {score}/{totalQuestions}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Câu {question}/{totalQuestions} | ⏱ {timeLeft}s
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
  row: { flexDirection: "row", gap: 15 },
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
  startText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  text: { fontSize: 18, marginTop: 10 },
});
