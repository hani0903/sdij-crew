import { Link } from '@tanstack/react-router';
import CalendarIcon from './../../assets/icons/calendar.svg?react';

export default function BottomNavigation() {
    return (
        <nav className="w-full px-5 pt-2 pb-3 border-t border-[#E2E8F0]">
            <ul className="w-full flex items-center justify-around">
                <li className="p-2 ">
                    <Link
                        to="/"
                        activeProps={{
                            className: 'text-point font-bold',
                        }}
                        className="flex flex-col gap-1 items-center text-medium font-14 text-[#94A3B8]"
                    >
                        <CalendarIcon />
                        <span>시간표</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
