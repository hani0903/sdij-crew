// ─── Me 서비스 ────────────────────────────────────────────────────────────────
//
// 역할: 로그인한 사용자(크루) 본인 관련 HTTP 통신.
// 설계: 서비스 레이어는 순수 HTTP 요청/응답만 담당.
//       비즈니스 로직(스토어 업데이트, 라우팅)은 훅(hooks/queries/me/) 레이어에서 처리.

import api from '@/libs/common/api';
import { API_ENDPOINTS } from '@/constants/api';
import type { OnboardingRequest, OnboardingResponse } from '@/types/me/me.type';

export const meService = {
    /**
     * 최초 로그인 후 이름·근무반을 등록한다.
     *
     * 에러 케이스:
     *   - C005: 이미 온보딩 완료 → AxiosError로 throw됨 (훅에서 처리)
     */
    async postOnboarding(body: OnboardingRequest): Promise<OnboardingResponse> {
        const { data } = await api.post<OnboardingResponse>(API_ENDPOINTS.ME.ONBOARDING, body);
        return data;
    },
} as const;
