import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import Tutorial from "./components/Tutorial";

export default function ChooseSignGame() {
  const [step, setStep] = useState<"tutorial" | "select" | "game" | "result">(
    "tutorial"
  );
  const [numbers, setNumbers] = useState({ a: 0, b: 0 });
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

  // Sinh số ngẫu nhiên
  const generateNumbers = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b };
  };

  // Bắt đầu game
  const startGame = (count: number | null) => {
    setTotalQuestions(count);
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

    if (totalQuestions && question < totalQuestions) {
      setQuestion((prev) => prev + 1);
      setNumbers(generateNumbers());
    } else if (totalQuestions === null) {
      // Vô hạn: cứ sinh số mới
      setQuestion((prev) => prev + 1);
      setNumbers(generateNumbers());
    } else {
      setStep("result");
    }
  };

  const exitGame = () => {
    router.back();
  };

  // Tutorial
  if (step === "tutorial") {
    return (
      <View style={styles.container}>
        <Tutorial />
        <Text style={styles.text}>
          📘 Hướng dẫn: So sánh 2 số và chọn dấu thích hợp {"<"} {">"} {"="}.
        </Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setStep("select")}
        >
          <Text style={styles.startText}>➡ Tiếp tục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Select number of questions
  if (step === "select") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chọn số câu hỏi</Text>
        {[10, 15, 20].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.startBtn}
            onPress={() => startGame(num)}
          >
            <Text style={styles.startText}>{num} câu</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => startGame(null)}
        >
          <Text style={styles.startText}>♾ Vô hạn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Result
  if (step === "result") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kết thúc 🎉</Text>
        <Text style={styles.text}>
          Điểm số: {score}/{totalQuestions}
        </Text>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => setStep("select")}
        >
          <Text style={styles.startText}>🔁 Chơi lại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
          <Text style={styles.startText}>⬅ Thoát</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Game
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Câu {question}
        {totalQuestions ? `/${totalQuestions}` : ""}
      </Text>

      <View style={styles.row}>
        <Text style={styles.number}>{numbers.a}</Text>
        <Text style={styles.placeholder}> ? </Text>
        <Text style={styles.number}>{numbers.b}</Text>
      </View>

      <Text style={styles.text}>Chọn dấu để điền vào chỗ trống:</Text>

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

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setStep("select")}
        >
          <Text style={styles.startText}>⏸ Dừng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exitBtn} onPress={exitGame}>
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
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  number: { fontSize: 36, fontWeight: "bold", marginHorizontal: 10 },
  placeholder: { fontSize: 36, fontWeight: "bold", color: "#e67e22" },
  btn: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    minWidth: 60,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  startBtn: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    minWidth: 150,
    alignItems: "center",
  },
  pauseBtn: {
    backgroundColor: "#f39c12",
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
    marginHorizontal: 10,
  },
  exitBtn: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 120,
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  text: { fontSize: 18, marginTop: 10, textAlign: "center" },
});
