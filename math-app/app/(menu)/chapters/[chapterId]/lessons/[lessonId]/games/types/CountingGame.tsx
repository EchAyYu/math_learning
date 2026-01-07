import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

interface CountingGameProps {
  chapterId: string;
  lessonId: string;
  gameId: string;
  gameData: {
    id: number;
    title: string;
    type: string;
    difficulty: string;
    description: string;
  };
}

const TOTAL_QUESTIONS = 5;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRange(lessonId: string) {
  // Chapter 1:
  // lesson 1 => 1..10
  // lesson 2 => 10..20
  if (lessonId === "1") return { min: 1, max: 10 };
  if (lessonId === "2") return { min: 10, max: 20 };
  // fallback
  return { min: 1, max: 10 };
}

function buildOptions(correct: number, min: number, max: number) {
  const set = new Set<number>();
  set.add(correct);
  while (set.size < 4) {
    set.add(randInt(min, max));
  }
  // shuffle
  return Array.from(set).sort(() => Math.random() - 0.5);
}

export default function CountingGame({
  chapterId,
  lessonId,
  gameId,
  gameData,
}: CountingGameProps) {
  const range = useMemo(() => getRange(lessonId), [lessonId]);

  const [qIndex, setQIndex] = useState(1);
  const [score, setScore] = useState(0); // mỗi câu đúng +10
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const [currentCount, setCurrentCount] = useState(() =>
    randInt(range.min, range.max)
  );
  const [options, setOptions] = useState(() =>
    buildOptions(currentCount, range.min, range.max)
  );

  const resetQuestion = () => {
    const nextCount = randInt(range.min, range.max);
    setCurrentCount(nextCount);
    setOptions(buildOptions(nextCount, range.min, range.max));
    setSelected(null);
    setFeedback("");
  };

  const submit = (value: number) => {
    if (selected !== null) return; // tránh bấm nhiều lần
    setSelected(value);

    const isCorrect = value === currentCount;
    if (isCorrect) {
      setScore((s) => s + 10);
      setFeedback("✅ Đúng rồi!");
    } else {
      setFeedback("❌ Sai rồi!");
    }

    setTimeout(() => {
      if (qIndex >= TOTAL_QUESTIONS) {
        router.replace({
          pathname: `/(menu)/chapters/[chapterId]/lessons/[lessonId]/games/result`,
          params: {
            chapterId,
            lessonId,
            gameId,
            score: String(isCorrect ? score + 10 : score),
            totalQuestions: String(TOTAL_QUESTIONS),
          },
        });
      } else {
        setQIndex((i) => i + 1);
        resetQuestion();
      }
    }, 700);
  };

  const icons = "🍎"; // bạn có thể đổi sang 🍬 cho bài 2 nếu muốn
  const renderIcons = () => {
    // hiện tối đa 20 icon để không tràn UI
    const n = Math.min(currentCount, 20);
    return (
      <View style={styles.iconsWrap}>
        {Array.from({ length: n }).map((_, i) => (
          <Text key={i} style={styles.icon}>
            {icons}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{gameData.title || "Đếm"}</Text>

      <View style={styles.topRow}>
        <Text style={styles.score}>Điểm: {score}</Text>
        <Text style={styles.q}>
          Câu {qIndex}/{TOTAL_QUESTIONS}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.prompt}>Đếm và chọn đáp án đúng:</Text>
        {renderIcons()}
        <Text style={styles.prompt2}>Có bao nhiêu?</Text>
      </View>

      <View style={styles.optionsRow}>
        {options.map((op) => {
          const active = selected !== null;
          const isCorrect = op === currentCount;
          const isSelected = op === selected;

          return (
            <TouchableOpacity
              key={op}
              style={[
                styles.circleBtn,
                active && isSelected && !isCorrect && { opacity: 0.5 },
                active && isCorrect && isSelected && { opacity: 1 },
              ]}
              onPress={() => submit(op)}
            >
              <Text style={styles.circleText}>{op}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.feedback}>{feedback}</Text>

      <TouchableOpacity style={styles.exitBtn} onPress={() => router.back()}>
        <Text style={styles.exitText}>🚪 Thoát</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F6FBFF" },
  title: { fontSize: 20, fontWeight: "800", textAlign: "center", marginTop: 6 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  score: { fontSize: 16, fontWeight: "700", color: "#1B5E20" },
  q: { fontSize: 16, fontWeight: "700", color: "#455A64" },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
    elevation: 2,
  },
  prompt: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  prompt2: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    color: "#607D8B",
  },

  iconsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 12,
  },
  icon: { fontSize: 26, margin: 4 },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginTop: 18,
  },
  circleBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#2D9CDB",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: { color: "white", fontSize: 20, fontWeight: "900" },

  feedback: {
    textAlign: "center",
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#00897B",
  },
  exitBtn: {
    marginTop: "auto",
    backgroundColor: "#B0BEC5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  exitText: { fontWeight: "800", color: "#263238" },
});
