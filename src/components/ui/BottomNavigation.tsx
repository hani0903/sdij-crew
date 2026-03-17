import { Link } from '@tanstack/react-router';
import type { FC, SVGProps } from 'react';
import { CalendarIcon, DocsIcon, SettingIcon } from '@/assets';

interface NavItemConfig {
    to: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    label: string;
}

const NAV_ITEMS: NavItemConfig[] = [
    { to: '/', icon: CalendarIcon, label: '시간표' },
    // { to: '/random', icon: DiceIcon, label: '사다리' },
    { to: '/docs', icon: DocsIcon, label: '문서' },
    { to: '/setting', icon: SettingIcon, label: '관리' },
];

const NAV_LINK_CLASS = 'flex flex-col justify-between items-center text-medium font-14 text-[#94A3B8] h-12';
const NAV_LINK_ACTIVE_CLASS = 'text-point font-bold';

// 개별 네비게이션 아이템 컴포넌트
function NavItem({ to, icon: Icon, label }: NavItemConfig) {
    return (
        <li className="p-2">
            <Link to={to as never} activeProps={{ className: NAV_LINK_ACTIVE_CLASS }} className={NAV_LINK_CLASS}>
                <Icon />
                <span>{label}</span>
            </Link>
        </li>
    );
}

export default function BottomNavigation() {
    return (
        <nav className="md:hidden w-full px-5 pt-2 pb-3 border-t border-[#E2E8F0]">
            <ul className="w-full flex items-center justify-around">
                {NAV_ITEMS.map((item) => (
                    <NavItem key={item.to} {...item} />
                ))}
            </ul>
        </nav>
    );
}
