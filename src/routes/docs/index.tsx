import { createFileRoute, Link } from '@tanstack/react-router';
import DocsIcon from './../../assets/icons/docs.svg?react';
import RightArrowIcon from './../../assets/icons/right-arrow.svg?react';
import Input from '@/components/ui/Input/Input';

export const Route = createFileRoute('/docs/')({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto">
            <h2 className="text-[18px] font-bold flex items-center gap-3 p-4 border-b border-[#F1F5F9]">
                <span className=" p-1.5 bg-point/10 text-point rounded-lg flex items-center justify-center">
                    <DocsIcon className="size-5" />
                </span>
                <p className="flex flex-col gap-1">
                    스태프 가이드
                    <span className="text-xs text-[#64748B] font-regular">스태프가 할 일을 정리해 둔 문서입니다</span>
                </p>
            </h2>
            <main className="w-full flex-1 flex flex-col">
                <section className="w-full p-4">
                    <Input placeholder="찾고 싶은 내용을 입력하세요..." />
                </section>
                <section className="w-full flex flex-col px-4 flex-1 gap-4">
                    <div className="w-full flex items-center justify-between">
                        <h3 className="font-bold text-base text-[#94A3B8]">메인 문서</h3>
                        <span className="text-point font-medium text-sm">5 챕터</span>
                    </div>
                    <div className="w-full flex flex-col gap-4 flex-1">
                        <Link
                            to="/docs/pre-first-period-tasks"
                            className="min-h-[70px] w-full rounded-xl p-4 flex gap-4 bg-[#F8FAFC] border border-[#F1F5F9] justify-between"
                        >
                            <div className="flex flex-col gap-3 w-fit">
                                <span className="text-[#0F172A] font-bold text-sm">1교시 시작 전 업무</span>
                                <p className="inline-block break-keep text-[#64748B] text-xs">
                                    1교시 수업 전 해야할 일들을 정리한 문서입니다.
                                </p>
                            </div>
                            <button className=" flex items-center gap-2 cursor-pointer hover:text-point/90 active:text-point/90 text-xs text-point font-semibold">
                                <span className="whitespace-nowrap">문서 읽으러 가기</span>
                                <RightArrowIcon />
                            </button>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
