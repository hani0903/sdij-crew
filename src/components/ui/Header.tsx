import { useAuthStatus } from '@/stores/auth.store';
import Button from './Button';
import { ProfileMenu } from '../my/ProfileMenu';

export interface NavItem {
    /** 메뉴에 표시될 텍스트 */
    label: string;
    /** 이동할 경로 */
    href: string;
    /** 현재 페이지 여부. 활성화 스타일 적용에 사용 */
    active?: boolean;
}

export default function Header() {
    const handleClickLogin = () => {
        if (import.meta.env.PROD) {
            window.location.href =
                'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=https://www.sdij.site/login/oauth2/code/kakao&scope=profile_nickname account_email';
        } else {
            window.location.href =
                'https://kauth.kakao.com/oauth/authorize?client_id=f12e62fc3162b94fd60fcd0e2b706dd6&response_type=code&redirect_uri=http://localhost:5173/login/oauth2/code/kakao&scope=profile_nickname account_email';
        }
    };
    const status = useAuthStatus();
    return (
        <header className="w-full border-b-1 border-gray-2 bg-white flex items-center py-5">
            <div className="flex w-full items-center justify-between px-6 gap-8">
                {/* 좌측: 서비스 이름 */}
                <span className="inline-block font-pretendard text-xl font-bold text-black">시대인재</span>

                {/* 중앙: 네비게이션 메뉴 */}

                {status === 'unauthenticated' ? (
                    <Button variant="ghost" size="sm" className="p-2" onClick={handleClickLogin}>
                        로그인
                    </Button>
                ) : (
                    <ProfileMenu />
                )}
            </div>
        </header>
    );
}
