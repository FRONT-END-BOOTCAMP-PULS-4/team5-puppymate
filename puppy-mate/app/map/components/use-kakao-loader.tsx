// components/use-kakao-loader.ts
import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
  return useKakaoLoaderOrigin({
    appkey: process.env.KAKAO_KEY || "default-app-key",
    libraries: ["clusterer", "drawing", "services"],
  })
}
