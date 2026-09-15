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
          background: "#0c0e14",
          color: "#7dffb3",
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
