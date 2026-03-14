// ─── 로그아웃 뮤테이션 훅 ────────────────────────────────────────────────────
//
// 역할: 서버 세션 무효화 후 클라이언트 인증 상태 초기화.
//
// 주의: 서버 요청이 실패해도(네트워크 오류 등) 클라이언트 상태는 반드시 초기화.
//       사용자 경험상 로그아웃은 항상 성공해야 함.
//
// 사용 예시:
//   const { mutate: logout, isPending } = useLogout();
//   <button onClick={() => logout()}>로그아웃</button>

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authService } from '@/services/auth/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export function useLogout() {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation<void, Error, void>({
        mutationFn: () => authService.logout(),

        onSettled: () => {
            // 서버 요청 성공/실패 여부와 무관하게 클라이언트 상태 초기화.
            // onSettled를 사용해 네트워크 오류 시에도 반드시 실행 보장.

            // 1. 인증 상태 초기화
            clearAuth();

            // 2. 서버 상태 캐시 전체 무효화 (민감한 데이터 노출 방지)
            queryClient.clear();

            // 3. 로그인 페이지로 이동
            void navigate({ to: '/' });
        },
    });
}
