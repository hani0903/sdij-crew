// ─── 이미지 → 수업 데이터 추출 뮤테이션 훅 ──────────────────────────────────────
//
// 역할: 이미지 파일을 서버로 전송해 AI 추출 결과(ExtractedClassSession[])를 반환한다.
// 에러 처리는 호출자(ImageScanModal)가 toast로 담당.

import { useMutation } from '@tanstack/react-query';
import { classSessionService } from '@/services/class-session/session.service';
import type { ExtractedClassSession } from '@/types/schedule/classSession.type';

export function useExtractClassSessions() {
    return useMutation<ExtractedClassSession[], Error, File>({
        mutationFn: (file) => classSessionService.extractFromImage(file),
    });
}
