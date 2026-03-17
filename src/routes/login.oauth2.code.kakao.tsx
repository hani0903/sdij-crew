// ─── 카카오 OAuth 콜백 처리 라우트 ───────────────────────────────────────────
//
// 흐름:
//   1. 카카오 인가 서버가 redirect_uri로 ?code=xxx 를 붙여 이 라우트로 리다이렉트
//   2. 마운트 시 useKakaoLogin 뮤테이션 실행 → 서버에 인가 코드 전달
//   3. 성공: accessToken을 authStore에 저장 → 이전 페이지로 이동
//   4. 실패: 에러 UI 표시 (사용자가 재시도 가능)

import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';
import { useKakaoLogin } from '@/hooks/queries/auth/use-kakao-login';

export const Route = createFileRoute('/login/oauth2/code/kakao')({
    validateSearch: (search: Record<string, unknown>) => ({
        code: String(search.code ?? ''),
    }),
    component: KakaoCallbackPage,
});

// Kakao 인가 코드는 1회용 -> 두 번째 요청은 서버 500을 유발
// 언마운트-리마운트 사이클에서도 초기화되지 않는 모듈 레벨 변수로 StrictMode 오류 해결
let _processedCode = '';

function KakaoCallbackPage() {
    const { code } = Route.useSearch();
    const { mutate: loginWithKakao, isError, isPending } = useKakaoLogin();

    const dest = import.meta.env.PROD ? 'prod' : 'local';

    useEffect(() => {
        if (!code || _processedCode === code) return;
        _processedCode = code;
        loginWithKakao({ code, dest });
    }, [code, dest, loginWithKakao]);

    // 코드가 없으면 잘못된 접근
    if (!code) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-gray-500">잘못된 접근입니다.</p>
            </div>
        );
    }

    // 로그인 처리 중 오류
    if (isError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-gray-500">로그인에 실패했습니다.</p>
                <button
                    type="button"
                    className="text-sm text-blue-500 underline"
                    onClick={() => loginWithKakao({ code, dest })}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    // 로그인 처리 중 로딩
    return (
        <div className="w-full h-full flex items-center justify-center" aria-label="로그인 처리 중">
            {isPending && <CircularLoadingSpinner />}
        </div>
    );
}
