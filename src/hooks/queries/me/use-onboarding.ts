// ─── 온보딩 뮤테이션 훅 ────────────────────────────────────────────────────────
//
// 역할: 온보딩 API를 호출하고, 결과에 따라 스토어·히스토리를 처리한다.
//
// 에러 처리 전략 (C005 — 이미 온보딩 완료):
//   - 서버가 이미 온보딩됐다고 알리는 상황 = 클라이언트 상태가 잘못 동기화된 것.
//   - completeOnboarding()으로 상태를 정합화 후 replace 이동.

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { meService } from '@/services/me/me.service';
import { useCompleteOnboarding } from '@/stores/auth.store';
import { CREW_ERROR_CODES } from '@/types/common/api-error.type';
import type { OnboardingRequest, OnboardingResponse } from '@/types/me/me.type';
import { toast } from 'sonner';

export function useOnboarding() {
    const completeOnboarding = useCompleteOnboarding();
    const navigate = useNavigate();

    return useMutation<OnboardingResponse, Error, OnboardingRequest>({
        mutationFn: (body) => meService.postOnboarding(body),

        onSuccess: () => {
            completeOnboarding();
            toast.info('환영합니다:)');

            const redirectTo = sessionStorage.getItem('redirectAfterLogin') ?? '/';
            sessionStorage.removeItem('redirectAfterLogin');
            void navigate({ to: redirectTo, replace: true });
        },

        onError: (error) => {
            if (axios.isAxiosError(error)) {
                const code = error.response?.data?.error as string | undefined;

                if (code === CREW_ERROR_CODES.ALREADY_ONBOARDED) {
                    // 서버 기준으로 이미 온보딩 완료 → 클라이언트 상태 동기화
                    toast.error('이미 온보딩을 완료했습니다.');
                    completeOnboarding();

                    // /onboarding을 히스토리에서 제거하면서 목적지로 이동
                    const redirectTo = sessionStorage.getItem('redirectAfterLogin') ?? '/';
                    sessionStorage.removeItem('redirectAfterLogin');
                    void navigate({ to: redirectTo, replace: true });
                    return;
                }
            }

            // TODO: 토스트 메시지 표시 — '온보딩 처리 중 오류가 발생했습니다. 다시 시도해 주세요.'

            if (import.meta.env.DEV) {
                console.error('[useOnboarding] 온보딩 실패:', error.message);
            }
        },
    });
}
