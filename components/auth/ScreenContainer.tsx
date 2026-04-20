import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * Premium screen container with gradient background
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
});
