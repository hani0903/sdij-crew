// ─── 인증 도메인 타입 ─────────────────────────────────────────────────────────
//
// 설계 원칙:
//   - LoginResponse는 현재 accessToken만 포함.
//   - 추후 RefreshToken 도입 시 refreshToken?: string 필드 추가만으로 확장 가능.
//   - 이 파일을 수정해도 서비스·훅·인터셉터 레이어에 최소한의 변경만 전파됨.

// ─── 카카오 OAuth ─────────────────────────────────────────────────────────────

/** 카카오 인가 코드 → 서버 토큰 교환 요청 바디 */
export interface KakaoCallbackRequest {
    /** 카카오 OAuth 인가 코드 (redirect_uri로 전달되는 ?code= 파라미터) */
    code: string;
    dest: string;
}

/**
 * 카카오 로그인 / 일반 로그인 공통 응답.
 *
 * @future RefreshToken 도입 시:
 *   - httpOnly cookie 방식: 이 타입 변경 없음 (서버가 Set-Cookie 헤더로 처리)
 *   - response body 방식: refreshToken?: string 필드 추가
 */
export interface LoginResponse {
    accessToken: string;
    // refreshToken?: string; // RefreshToken 도입 시 이 줄을 활성화
}

// ─── 일반 로그인 (이메일/비밀번호) ─────────────────────────────────────────────
// 현재 카카오 소셜 로그인만 사용하지만, 추후 ID/PW 로그인 지원 대비.

/** 이메일/비밀번호 로그인 요청 바디 (현재 미사용, 확장 대비) */
export interface CredentialLoginRequest {
    email: string;
    password: string;
}

// ─── Auth 상태 ────────────────────────────────────────────────────────────────

/**
 * 인증 상태 머신.
 *
 * - idle           : 초기 상태. 토큰 유무 아직 알 수 없음 (새로고침 복구 시도 전).
 * - authenticated  : 유효한 accessToken 보유 중.
 * - unauthenticated: 로그아웃 또는 토큰 만료 확정.
 */
export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated';
