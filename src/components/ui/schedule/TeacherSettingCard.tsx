import { Eraser, PenTool, Mic, MonitorPlay, Info, Mail, CheckCircle2 } from 'lucide-react';
import type { TeacherSetting } from '../../../types/teacher/teacher.type';

export default function TeacherSettingCard({ data }: { data: TeacherSetting }) {
    return (
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="bg-slate-900 p-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="bg-blue-500 w-1 h-5 rounded-full" />
                    {data.name} 강사님 세팅 가이드
                </h2>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 break-keep">
                {/* 지우개 & 분필 (2열 배치) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                            <Eraser size={16} />
                            <span>지우개</span>
                        </div>
                        <p className="text-slate-900 font-semibold leading-tight">
                            {data.eraser === 'default' ? '기본 4개' : data.eraser}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                            <PenTool size={16} />
                            <span>분필 타입</span>
                        </div>
                        <p className="text-slate-900 font-semibold">
                            <span
                                className={`px-2 py-0.5 rounded text-xs ${
                                    data.chalk.type === 'academy'
                                        ? 'bg-green-100 text-green-700'
                                        : data.chalk.type === 'personal'
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                                {data.chalk.type === 'academy'
                                    ? '학원 분필'
                                    : data.chalk.type === 'personal'
                                      ? '개인 분필'
                                      : '학원 분필 + 개인 분필'}
                            </span>
                            <p className="text-sm">{data.chalk.detail}</p>
                        </p>
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* 마이크 & PPT (2열 배치) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                            <Mic size={16} />
                            <span>마이크</span>
                        </div>
                        <p className="text-slate-900 font-semibold">
                            {data.mic === 'personal' ? '개인 마이크' : '학원 마이크'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                            <MonitorPlay size={16} />
                            <span>PPT 사용</span>
                        </div>
                        <p className={`font-semibold ${data.ppt ? 'text-blue-600' : 'text-slate-400'}`}>
                            {data.ppt ? '사용함' : '미사용'}
                        </p>
                    </div>
                </div>

                {/* 디테일 설명 (강조 영역) */}
                {data.detail && (
                    <div className="rounded-lg bg-red-50 p-3 border border-red-100">
                        <div className="flex items-start gap-2">
                            <Info size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-700 leading-snug whitespace-pre-wrap">{data.detail}</p>
                        </div>
                    </div>
                )}

                {/* 이메일 발송 여부 */}
                {data.email && (
                    <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-700 text-sm font-medium">
                            <Mail size={16} />
                            <span>종료 후 영상 메일 발송</span>
                        </div>
                        <CheckCircle2 size={18} className="text-blue-500" />
                    </div>
                )}
            </div>
        </div>
    );
}
