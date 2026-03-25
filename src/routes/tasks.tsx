// import { useState } from 'react';
// import { createFileRoute } from '@tanstack/react-router';
// import { CheckCircle2Icon } from 'lucide-react';
// import WeekDayBar from '@/components/schedule/WeekDayBar';
// import FullScheduleTable from '@/components/tasks/FullScheduleTable';
// import ScheduleAssignmentModal from '@/components/tasks/ScheduleAssignmentModal';
// import { useScheduleAssignment, useSetDayAssignment } from '@/stores/schedule-assignment.store';
// import PERIOD from '@/constants/period';
// import type { DayScheduleAssignment } from '@/types/tasks/schedule-task.type';

// // ─── 날짜 → YYYY-MM-DD 유틸 ──────────────────────────────────────────────────

// function toLocalDateString(date: Date): string {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
// }

// // ─── 라우트 설정 ──────────────────────────────────────────────────────────────

// export const Route = createFileRoute('/tasks')({
//     component: RouteComponent,
// });

// // ─── 페이지 컴포넌트 ──────────────────────────────────────────────────────────

// function RouteComponent() {
//     // 선택된 날짜 상태 (기본값: 오늘)
//     const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

//     // 배정 편집 모달 open 상태
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const dateString = toLocalDateString(selectedDate);

//     // 클라이언트 상태: 해당 날짜의 저장된 스케줄 배정
//     const assignment = useScheduleAssignment(dateString);
//     const setDayAssignment = useSetDayAssignment();

//     // 배정 저장 핸들러
//     const handleSaveAssignment = (newAssignment: DayScheduleAssignment) => {
//         setDayAssignment(newAssignment);
//     };

//     return (
//         <div className="w-full h-full flex flex-col">
//             {/* ── 주간 날짜 선택 바 ── */}
//             <WeekDayBar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

//             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-7">
//                 {/* ── 오늘 할 일 섹션 ── */}
//                 <section className="w-full flex flex-col gap-3">
//                     <header className="w-full flex items-center justify-between">
//                         <h2 className="font-bold text-base">오늘 할 일</h2>
//                         <span className="inline-block rounded-full bg-point/10 px-3 py-1 text-point text-sm">
//                             3개의 할 일
//                         </span>
//                     </header>

//                     <div className="w-full rounded-lg overflow-hidden bg-white border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
//                         <ol className="w-full flex flex-col">
//                             <li className="w-full flex items-center gap-2 p-4">
//                                 <CheckCircle2Icon className="text-point" />
//                                 <div className="flex-1">
//                                     <h3 className="text-sm font-semibold text-point">입실</h3>
//                                     <span className="text-xs font-medium text-[#6B7280]">
//                                         1교시 - 8:30 ~ 10:10
//                                     </span>
//                                 </div>
//                                 <span className="inline-block rounded-lg bg-[#EFEFFD] p-2 text-point text-sm">
//                                     완료
//                                 </span>
//                             </li>
//                             <li className="w-full flex items-center gap-2 p-4">
//                                 <CheckCircle2Icon className="text-point" />
//                                 <div className="flex-1">
//                                     <h3 className="text-sm font-semibold text-[#1F2937]">퇴실</h3>
//                                     <span className="text-xs font-medium text-[#6B7280]">
//                                         1교시 - 8:30 ~ 10:10
//                                     </span>
//                                 </div>
//                                 <span className="inline-block rounded-lg bg-[#eceff3] p-2 text-[#9CA3AF] text-sm">
//                                     미완료
//                                 </span>
//                             </li>
//                         </ol>
//                     </div>
//                 </section>

//                 {/* ── 전체 스케줄 섹션 ── */}
//                 <section className="w-full flex flex-col gap-3">
//                     <header className="w-full flex items-center justify-between">
//                         <h2 className="font-bold text-base">전체 스케줄</h2>
//                         {/* 배정 데이터가 있을 때만 "편집" 버튼 표시, 없으면 FullScheduleTable 내부 "배정 시작" 버튼 사용 */}
//                         {assignment && (
//                             <button
//                                 type="button"
//                                 onClick={() => setIsModalOpen(true)}
//                                 className="rounded-lg border border-gray-2 px-3 py-1.5 font-pretendard text-xs font-medium text-[#475569] hover:bg-gray-1 transition-colors"
//                             >
//                                 배정 편집
//                             </button>
//                         )}
//                     </header>

//                     {/* 전체 스케줄 표 */}
//                     <div className="w-full rounded-lg overflow-hidden bg-white border border-[#E5E7EB] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
//                         <FullScheduleTable
//                             assignment={assignment}
//                             periods={PERIOD}
//                             onEdit={() => setIsModalOpen(true)}
//                         />
//                     </div>
//                 </section>
//             </div>

//             {/* ── 스케줄 배정 편집 모달 ── */}
//             {isModalOpen && (
//                 <ScheduleAssignmentModal
//                     date={selectedDate}
//                     assignment={assignment}
//                     onSave={handleSaveAssignment}
//                     onClose={() => setIsModalOpen(false)}
//                 />
//             )}
//         </div>
//     );
// }
