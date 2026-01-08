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

import { lessonsData } from "../../../../data/lessonsData";

function asString(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
// games/[gameId].tsx - Game Dispatcher
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import các game components

// Shared data (nên move ra file riêng)
import { lessonsData } from "../../../../data/lessons.data";
import DrawPointGame from "./types/PointLineGame";
import MeasureLengthGame from "./types/MeasureLength";
import AdditionGame from "./components/theory/ToanVo/Addition/LearnAddScene";
import SubtractionGame from "./components/theory/ToanVo/Subtraction/LearnSubtractScene";

import AdditionGame100 from "./components/theory/ToanVo1/Addition/AddTheoryScene";
import SubtractionGame100 from "./components/theory/ToanVo1/Subtraction/SubtractionTheoryScene";

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

  // guard missing params
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
          <Text style={styles.errorSubtext}>
            chapterId={chapterId}, lessonId={lessonId}, gameId={gameId}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const lessonData = (lessonsData as any)?.[chapterNum as any]?.[
    lessonNum as any
  ];

  const gameData = lessonData?.games?.find((g: any) => g.id === gameNum);

  if (!lessonData || !gameData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️</Text>
          <Text style={styles.errorText}>
            {!lessonData ? "Bài học không tồn tại!" : "Trò chơi không tồn tại!"}
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
      // luôn đảm bảo string để các game không bị TS complain
      description: gameData.description ?? "No description available",
    },
  };
  // Game type dispatcher
  const renderGame = () => {
    // For components that accept props
    const gameProps: GameProps = {
      chapterId: chapterId as string,
      lessonId: lessonId as string,
      gameId: gameId as string,
      gameData: {
        ...gameData,
        description: gameData.description || "No description available",
      },
    };

    switch (gameData.type) {
      // Chapter 1 - bài 1 & 2
      case "counting":
        return <CountingGame {...props} />;

      case "matching":
        return <MatchingGame {...props} />;

      case "sorting":
        return <SortingGame {...props} />;

      case "puzzle":
        return <MissingNumberGame {...props} />;

      // existing
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
              <Text style={styles.errorText}>
                Game type "{gameData.type}" chưa được implement!
              </Text>
              <Text style={styles.errorSubtext}>
                Hãy thêm component cho loại game này
              </Text>
            </View>
          </SafeAreaView>
        );
    }
    switch (gameData.type) {
      case "draw":
        return <DrawPointGame {...gameProps} />;
      case "measure":
        // Now MeasureLengthGame accepts props like other components
        return <MeasureLengthGame {...gameProps} />;
      case "addition":
        return <AdditionGame {...gameProps} />;
      case "subtraction":
        return <SubtractionGame {...gameProps} />; // Thay bằng component thực tế khi có
      case "addition100":
        return <AdditionGame100 {...gameProps} />;
      case "subtraction100":
        return <SubtractionGame100 {...gameProps} />;
      default:
        return (
          <SafeAreaView style={styles.container}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>🚧</Text>
              <Text style={styles.errorText}>
                Game type &quot;{gameData.type}&quot; chưa được implement!
              </Text>
              <Text style={styles.errorSubtext}>
                Hãy thêm component cho loại game này
              </Text>
            </View>
          </SafeAreaView>
        );
    }
  };

  return renderGame();
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: { fontSize: 48, marginBottom: 20 },
  errorTitle: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    fontSize: 20,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    fontWeight: "bold",
  },
  errorSubtext: { fontSize: 14, color: "#7f8c8d", textAlign: "center" },
  errorSubtext: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
});
