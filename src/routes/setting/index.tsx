// ─── Setting 페이지 ───────────────────────────────────────────────────────────
//
// 탭 전환 전략: Search Params (/setting?tab=time-table)
//
// 선택 근거:
//   1. URL 공유/북마크 가능 — 탭 상태가 URL에 반영되므로 새로고침·링크 공유 시 유지됨
//   2. 레이아웃 공유 자연스러움 — 부모 레이아웃 라우트 파일 추가 없이 SegmentedControl 공유
//   3. 각 탭 데이터는 독립적인 TanStack Query 훅 → unmount 후 재마운트 시 cache에서 복구
//   4. 파일 분리 라우팅은 탭 하위에 중첩 라우트가 생길 때로 미룸 (YAGNI)
//
// Search Params 타입 안전성:
//   - validateSearch로 허용 값 이외의 진입 시 기본값(time-table)으로 fallback
//   - TanStack Router가 search를 직렬화/역직렬화하므로 별도 파싱 불필요
//
// 코드 분할:
//   - vite.config의 autoCodeSplitting이 라우트 단위에서 이미 동작하므로
//     탭 컴포넌트는 동기 import로 유지 (추가 번들 이점 미미, 복잡도 증가 방지)

import { lazy, Suspense } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SegmentedControl } from '@/components/ui/SegmentControl';
import CircularLoadingSpinner from '@/components/ui/CircularLoadingSpinner';

// ─── 탭 정의 ─────────────────────────────────────────────────────────────────

const TAB_OPTIONS = [
    { label: '시간표', value: 'time-table' as const },
    { label: '선생님', value: 'teachers' as const },
    { label: '크루', value: 'crew' as const },
] as const;

/** 허용된 탭 값 타입 — TAB_OPTIONS에서 자동 추론 */
type SettingTab = (typeof TAB_OPTIONS)[number]['value'];

/** 허용된 탭 값 목록 — validateSearch에서 런타임 검증에 사용 */
const VALID_TABS: ReadonlyArray<string> = TAB_OPTIONS.map((o) => o.value);

/** 탭 값 타입 가드 */
function isSettingTab(value: unknown): value is SettingTab {
    return typeof value === 'string' && VALID_TABS.includes(value);
}

// ─── 탭 컴포넌트 lazy import ──────────────────────────────────────────────────
// 각 탭은 별도 청크로 분리 — 첫 진입 탭 이외의 번들을 지연 로드합니다.

const TimeTableTab = lazy(() => import('@/components/setting/time-table/TimeTableTab'));
const TeachersTab = lazy(() => import('@/components/setting/teachers/TeachersTab'));
const CrewTab = lazy(() => import('@/components/setting/crew/CrewTab'));

// ─── 탭 컴포넌트 맵 ──────────────────────────────────────────────────────────
// switch 대신 맵 사용 — 새 탭 추가 시 이 객체만 수정하면 됩니다. (Open/Closed 원칙)

const TAB_COMPONENTS: Record<SettingTab, React.ComponentType> = {
    'time-table': TimeTableTab,
    teachers: TeachersTab,
    crew: CrewTab,
};

// ─── 라우트 정의 ──────────────────────────────────────────────────────────────

export const Route = createFileRoute('/setting/')({
    // validateSearch: 유효하지 않은 tab 값 진입 시 기본값으로 정규화
    // 예) /setting?tab=unknown → tab이 'time-table'로 fallback
    validateSearch: (search: Record<string, unknown>): { tab: SettingTab } => ({
        tab: isSettingTab(search.tab) ? search.tab : 'time-table',
    }),
    component: SettingPage,
});

// ─── 페이지 컴포넌트 ──────────────────────────────────────────────────────────

function SettingPage() {
    // validateSearch가 보장하는 타입 안전 search — 별도 파싱·캐스팅 불필요
    const { tab } = Route.useSearch();
    const navigate = useNavigate({ from: '/setting/' });

    /** 탭 전환 — URL search param 업데이트 (브라우저 히스토리에 push) */
    const handleTabChange = (value: SettingTab) => {
        void navigate({
            search: { tab: value },
            // replace: 탭 전환을 히스토리 스택에 쌓지 않음
            // 뒤로가기 시 이전 탭이 아닌 이전 페이지로 이동하는 것이 자연스러운 UX
            replace: true,
        });
    };

    // 현재 탭에 해당하는 컴포넌트 — 맵 조회 실패는 validateSearch가 방어하므로 발생 안 함
    const ActiveTab = TAB_COMPONENTS[tab];

    return (
        <div className="relative w-full h-full flex flex-col p-4 text-gray-3 gap-4">
            {/* 탭 네비게이션 — selectedValue가 URL search param과 동기화됨 */}
            <SegmentedControl
                options={TAB_OPTIONS}
                selectedValue={tab}
                onChange={handleTabChange}
            />

            {/* 탭 컨텐츠 — Suspense로 lazy chunk 로딩 중 스피너 표시 */}
            <Suspense
                fallback={
                    <div className="w-full flex-1 flex items-center justify-center">
                        <CircularLoadingSpinner />
                    </div>
                }
            >
                <ActiveTab />
            </Suspense>
        </div>
    );
}
