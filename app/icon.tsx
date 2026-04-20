import { ImageResponse } from "next/og";

export const size = {
  height: 64,
  width: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(180deg, #042F2E 0%, #0B5F5B 100%)",
          color: "#FCFCFB",
          display: "flex",
          fontFamily: "serif",
          fontSize: 30,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.08em",
          width: "100%",
        }}
      >
        CL
      </div>
    ),
    size,
  );
}
