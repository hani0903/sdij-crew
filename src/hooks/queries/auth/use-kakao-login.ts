// ─── 카카오 로그인 뮤테이션 훅 ───────────────────────────────────────────────
//
// 역할: 카카오 인가 코드를 서버에 전달해 AccessToken을 발급받고,
//       authStore에 저장한 뒤 로그인 전 페이지로 리다이렉트.
//
// 사용 예시:
//   const { mutate: loginWithKakao, isPending } = useKakaoLogin();
//   loginWithKakao({ code: 'xxxxxx' });

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import type { KakaoCallbackRequest, LoginResponse } from '@/types/auth/auth.type';

export function useKakaoLogin() {
    const setToken = useAuthStore((s) => s.setToken);
    const navigate = useNavigate();

    return useMutation<LoginResponse, Error, KakaoCallbackRequest>({
        mutationFn: (body) => authService.kakaoCallback(body),

        onSuccess: ({ accessToken }) => {
            // 1. 스토어에 토큰 저장 → status: 'authenticated' 로 전환
            setToken(accessToken);

            // 2. 로그인 전 방문하려 했던 페이지로 복원, 없으면 루트로 이동
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') ?? '/';
            sessionStorage.removeItem('redirectAfterLogin');
            void navigate({ to: redirectTo });
        },

        onError: (error) => {
            if (import.meta.env.DEV) {
                console.error('[useKakaoLogin] 카카오 로그인 실패:', error.message);
            }
        },
    });
}
