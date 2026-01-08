// Clean, merged Game Dispatcher
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import CountingGame from "./types/CountingGame";
import MatchingGame from "./types/MatchingGame";
import SortingGame from "./types/SortingGame";
import MissingNumberGame from "./types/MissingNumberGame";
import PointLineGame from "./types/PointLineGame";
import ComparisonIndex from "./comparison";
import ChooseSignGame from "./comparison/ChooseSignGame";

import { lessonsData } from "../../../../data/lessons.data";

function asString(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

interface GameProps {
  chapterId: string;
  lessonId: string;
  gameId: string;
  gameData: {
    id: number;
    title: string;
    type: string;
    difficulty: string;
    description?: string;
  };
}

export default function GameDispatcher() {
  const params = useLocalSearchParams<{
    chapterId?: string | string[];
    lessonId?: string | string[];
    gameId?: string | string[];
  }>();

  const chapterId = asString(params.chapterId);
  const lessonId = asString(params.lessonId);
  const gameId = asString(params.gameId);

  if (!chapterId || !lessonId || !gameId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️</Text>
          <Text style={styles.errorText}>Thiếu tham số route!</Text>
          <Text style={styles.errorSubtext}>
            chapterId={String(chapterId)} | lessonId={String(lessonId)} |
            gameId={String(gameId)}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const chapterNum = Number(chapterId);
  const lessonNum = Number(lessonId);
  const gameNum = Number(gameId);

  if (
    Number.isNaN(chapterNum) ||
    Number.isNaN(lessonNum) ||
    Number.isNaN(gameNum)
  ) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️</Text>
          <Text style={styles.errorText}>Tham số route không hợp lệ!</Text>
          <Text
            style={styles.errorSubtext}
          >{`chapterId=${chapterId}, lessonId=${lessonId}, gameId=${gameId}`}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const lessonData = (lessonsData as any)?.[chapterNum]?.[lessonNum];
  const gameData = lessonData?.games?.find((g: any) => g.id === gameNum);

  if (!lessonData || !gameData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Lỗi</Text>
          <Text style={styles.errorText}>
            {!lessonData ? "Bài học không tồn tại!" : "Trò chơi không tồn tại!"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const props: GameProps = {
    chapterId,
    lessonId,
    gameId,
    gameData: {
      ...gameData,
      description: gameData.description ?? "No description available",
    },
  };

  switch (gameData.type) {
    case "counting":
      return <CountingGame {...props} />;
    case "matching":
      return <MatchingGame {...props} />;
    case "sorting":
      return <SortingGame {...props} />;
    case "puzzle":
      return <MissingNumberGame {...props} />;
    case "draw":
    case "pointline":
      return <PointLineGame {...props} />;
    case "comparison":
      return <ComparisonIndex />;
    case "quiz":
      return <ChooseSignGame />;
    default:
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>🚧</Text>
            <Text
              style={styles.errorText}
            >{`Game type "${gameData.type}" chưa được implement!`}</Text>
            <Text style={styles.errorSubtext}>
              Hãy thêm component cho loại game này
            </Text>
          </View>
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: { fontSize: 48, marginBottom: 20 },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  errorSubtext: { fontSize: 14, color: "#7f8c8d", textAlign: "center" },
});
