import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";

export const COLORS = {
  primary: "#0B5ED7",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  background: "#FAFBFC",
  card: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  icon: "#D1D5DB",
};

export const PremiumCard = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.card, style]}>{children}</View>;

/**
 * SettingRow - Icon + Label + Description + Toggle
 * Perfect for notification and security settings
 */
interface SettingRowProps {
  icon: string;
  label: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  iconColor?: string;
  isLast?: boolean;
}

export const SettingRow = ({
  icon,
  label,
  description,
  value,
  onValueChange,
  iconColor = COLORS.primary,
  isLast = false,
}: SettingRowProps) => (
  <View style={[styles.settingRow, !isLast && styles.settingRowBorder]}>
    <View style={styles.settingLeft}>
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}12` }]}
      >
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: COLORS.border, true: `${COLORS.primary}40` }}
      thumbColor={value ? COLORS.primary : COLORS.textTertiary}
    />
  </View>
);

/**
 * InfoCard - Premium info card for alerts, compliance, etc.
 */
interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  type?: "info" | "success" | "warning" | "danger";
}

export const InfoCard = ({
  icon,
  title,
  description,
  type = "info",
}: InfoCardProps) => {
  const typeColors = {
    info: { bg: "#DBEAFE", icon: COLORS.primary },
    success: { bg: "#DCFCE7", icon: COLORS.success },
    warning: { bg: "#FEF3C7", icon: COLORS.warning },
    danger: { bg: "#FEE2E2", icon: COLORS.danger },
  };

  const colors = typeColors[type];

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.bg }]}>
      <View
        style={[
          styles.infoIcon,
          { backgroundColor: `${colors.icon}15`, borderColor: colors.icon },
        ]}
      >
        <Ionicons name={icon as any} size={24} color={colors.icon} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { color: colors.icon }]}>{title}</Text>
        <Text style={styles.infoText}>{description}</Text>
      </View>
    </View>
  );
};

/**
 * ActionItem - Pressable row with icon, label, and chevron
 */
interface ActionItemProps {
  icon: string;
  label: string;
  subtitle?: string;
  onPress: () => void;
  isDangerous?: boolean;
  isLast?: boolean;
}

export const ActionItem = ({
  icon,
  label,
  subtitle,
  onPress,
  isDangerous = false,
  isLast = false,
}: ActionItemProps) => (
  <TouchableOpacity
    style={[styles.actionItem, !isLast && styles.actionItemBorder]}
    onPress={onPress}
  >
    <View style={styles.actionLeft}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDangerous ? "#FEE2E2" : `${COLORS.primary}12`,
          },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={22}
          color={isDangerous ? COLORS.danger : COLORS.primary}
        />
      </View>
      <View style={styles.actionText}>
        <Text
          style={[styles.actionLabel, isDangerous && { color: COLORS.danger }]}
        >
          {label}
        </Text>
        {subtitle && <Text style={styles.actionDescription}>{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={COLORS.icon} />
  </TouchableOpacity>
);

/**
 * PrimaryButton - Main CTA button with icon support
 */
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  isDangerous?: boolean;
}

export const PrimaryButton = ({
  label,
  onPress,
  icon,
  loading = false,
  disabled = false,
  isDangerous = false,
}: PrimaryButtonProps) => (
  <TouchableOpacity
    style={[
      styles.primaryButton,
      isDangerous && styles.dangerButton,
      disabled && styles.disabledButton,
    ]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    <View style={styles.buttonContent}>
      {icon && !loading && (
        <Ionicons
          name={icon as any}
          size={18}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={styles.primaryButtonText}>
        {loading ? "Loading..." : label}
      </Text>
    </View>
  </TouchableOpacity>
);

/**
 * SectionHeader - Consistent section title with spacing
 */
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <View style={styles.sectionHeaderContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

/**
 * ContactCard - For displaying contact info (phone, email, etc.)
 */
interface ContactCardProps {
  icon: string;
  label: string;
  value: string;
  subtext: string;
  onPress?: () => void;
  color?: string;
}

export const ContactCard = ({
  icon,
  label,
  value,
  subtext,
  onPress,
  color = COLORS.primary,
}: ContactCardProps) => (
  <TouchableOpacity
    style={styles.contactCard}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}12` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.contactInfo}>
      <Text style={[styles.contactLabel, { color }]}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
      <Text style={styles.contactSubtext}>{subtext}</Text>
    </View>
    {onPress && (
      <Ionicons name="chevron-forward" size={20} color={COLORS.icon} />
    )}
  </TouchableOpacity>
);

/**
 * StatCard - For displaying metrics (accuracy, scans, etc.)
 */
interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

export const StatCard = ({
  value,
  label,
  icon,
  color = COLORS.primary,
}: StatCardProps) => (
  <View style={styles.statCard}>
    {icon && (
      <View style={[styles.statIcon, { backgroundColor: `${color}12` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
    )}
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  settingText: {
    flex: 1,
    marginLeft: 12,
  },

  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  settingDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // Info Card
  infoCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
  },

  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    lineHeight: 18,
  },

  // Action Item
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  actionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  actionText: {
    flex: 1,
    marginLeft: 12,
  },

  actionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  actionDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // Primary Button
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  dangerButton: {
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },

  // Section Header
  sectionHeaderContainer: {
    marginTop: 24,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 4,
  },

  // Contact Card
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },

  contactLabel: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  contactValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },

  contactSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  // Stat Card
  statCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textAlign: "center",
  },
});
