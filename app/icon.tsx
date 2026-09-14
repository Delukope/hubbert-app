import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e8c07a",
          color: "#1a1408",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        H
      </div>
    ),
    size,
  );
}
