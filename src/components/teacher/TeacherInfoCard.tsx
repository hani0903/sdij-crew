import { Eraser, PenTool, Mic, MonitorPlay, Mail, CheckCircle2 } from 'lucide-react';
import type { TeacherSetting } from '@/types/teacher/teacher.type';

const chalkTypeLabel: Record<TeacherSetting['chalkType'], string> = {
    ACADEMY: '학원 분필',
    PERSONAL: '개인 분필',
    MIXED: '학원 분필 + 개인 분필',
};

export function TeacherInfoCard({ data }: { data: TeacherSetting }) {
    return (
        <div className="w-full overflow-hidden rounded-xl border border-gray-2 bg-white shadow-sm">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-2">
                <h2 className="text-base font-bold text-black flex items-center gap-2">
                    <span className="bg-point w-1 h-5 rounded-full" />
                    {data.name} 강사님 세팅 가이드
                </h2>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-4 break-keep">
                {/* 지우개 & 분필 (2열 배치) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-4 text-sm font-medium">
                            <Eraser size={16} />
                            <span>지우개</span>
                        </div>
                        {data.eraserDetail && (
                            <span className="text-black font-semibold leading-tight text-sm">{data.eraserDetail}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-4 text-sm font-medium">
                            <PenTool size={16} />
                            <span>분필 타입</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-point/10 text-point w-fit">
                                {chalkTypeLabel[data.chalkType]}
                            </span>
                            {data.chalkDetail && (
                                <span className="text-sm text-black">{data.chalkDetail}</span>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-2" />

                {/* 마이크 & PPT (2열 배치) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-4 text-sm font-medium">
                            <Mic size={16} />
                            <span>마이크</span>
                        </div>
                        <span className="text-black font-semibold">
                            {data.micType === 'PERSONAL' ? '개인 마이크' : '학원 마이크'}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-gray-4 text-sm font-medium">
                            <MonitorPlay size={16} />
                            <span>PPT 사용</span>
                        </div>
                        <span className={`font-semibold ${data.hasPpt ? 'text-point' : 'text-gray-3'}`}>
                            {data.hasPpt ? '사용함' : '미사용'}
                        </span>
                    </div>
                </div>

                {/* 이메일 발송 여부 */}
                {data.email && (
                    <div className="flex items-center justify-between bg-point/5 p-2.5 rounded-lg border border-point/20">
                        <div className="flex items-center gap-2 text-point text-sm font-medium">
                            <Mail size={16} />
                            <span>종료 후 영상 메일 발송</span>
                        </div>
                        <CheckCircle2 size={18} className="text-point" />
                    </div>
                )}
            </div>
        </div>
    );
}
