"use client";

import { cn } from "@/lib/utils";

interface AIAvatarProps {
  size?: "sm" | "md" | "lg";
  isActive?: boolean;
  className?: string;
}

export function AIAvatar({ size = "md", isActive, className }: AIAvatarProps) {
  const sizes = { sm: "h-7 w-7 text-sm", md: "h-9 w-9 text-base", lg: "h-12 w-12 text-lg" };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full flex items-center justify-center select-none",
        "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500",
        isActive && "avatar-pulse",
        sizes[size],
        className
      )}
      style={{
        boxShadow: "0 2px 12px oklch(0.55 0.22 290 / 30%), 0 0 0 2px white",
      }}
    >
      {/* Animated inner glow */}
      <div className="absolute inset-0 rounded-full bg-white/10" />
      {/* Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn("relative z-10 text-white", size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4.5 w-4.5" : "h-6 w-6")}
        style={{ width: size === "sm" ? 14 : size === "md" ? 18 : 24, height: size === "sm" ? 14 : size === "md" ? 18 : 24 }}
      >
        <path
          d="M12 2L9.5 8.5H3L8.5 12.5L6 19L12 15L18 19L15.5 12.5L21 8.5H14.5L12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      {/* Online dot */}
      {isActive && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-white" />
      )}
    </div>
  );
}

interface UserAvatarProps {
  initials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ initials = "T", size = "md", className }: UserAvatarProps) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full flex items-center justify-center select-none font-semibold",
        "bg-gradient-to-br from-slate-700 to-slate-900 text-white",
        sizes[size],
        className
      )}
      style={{ boxShadow: "0 2px 8px oklch(0 0 0 / 15%), 0 0 0 2px white" }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
