// ─── 네비게이션 메뉴 공유 상수 ──────────────────────────────────────────────────
// BottomNavigation(모바일)과 Header nav(데스크탑)에서 동일한 라우트를 사용한다.

import type { FC, SVGProps } from 'react';
import { CalendarIcon, DocsIcon, SettingIcon } from '@/assets';

export interface NavItemConfig {
    to: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    label: string;
}

export const NAV_ITEMS: NavItemConfig[] = [
    { to: '/', icon: CalendarIcon, label: '시간표' },
    // { to: '/random', icon: DiceIcon, label: '사다리' },
    // { to: '/tasks', icon: CheckBoxIcon, label: '할 일' },
    { to: '/docs', icon: DocsIcon, label: '문서' },
    { to: '/setting', icon: SettingIcon, label: '관리' },
];
