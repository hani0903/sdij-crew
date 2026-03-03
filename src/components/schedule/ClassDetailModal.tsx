import { useEffect } from 'react';
import { type ClassEntry, type ClassStatus } from './Timetable';
import CommonNotes from './CommonNotes';
import { TEACHERS_SETTINGS_DATA } from '../../constants/teacher';
import TeacherSettingCard from './TeacherSettingCard';
import Button from '../ui/Button';

interface ClassDetailModalProps {
    entry: ClassEntry;
    onClose: () => void;
}

const statusLabel: Record<ClassStatus, string | null> = {
    normal: null,
    cancelled: '휴강',
    makeup: '보강',
};

const statusBadgeClass: Record<ClassStatus, string> = {
    normal: '',
    cancelled: 'bg-gray-2 text-gray-4',
    makeup: 'bg-point text-white',
};

export default function ClassDetailModal({ entry, onClose }: ClassDetailModalProps) {
    /* ESC 키로 닫기 */
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const badge = statusLabel[entry.status];

    const [teacherSettingData] = TEACHERS_SETTINGS_DATA.filter((data) => data.name === entry.teacher);

    const handleCopyClick = (textToCopy: string) => {
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                alert('텍스트가 복사되었습니다.');
            })
            .catch((error) => {
                console.error('복사 실패:', error);
            });
    };

    const defaultComment = `${entry.room} ${entry.period} ${entry.teacher}T ${entry.subject}${entry.group ? ` ${entry.group}` : ''}`;

    return (
        /* 딤 배경. 클릭하면 닫힘 */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden"
            onClick={onClose}
        >
            {/* 모달 본체. 클릭 이벤트가 배경으로 전파되지 않도록 stopPropagation */}
            <div
                className="relative flex flex-col w-full h-[90%] max-w-sm mx-4 rounded-2xl bg-white shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 flex flex-col gap-4 bg-point/10">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-xl font-bold text-black flex items-baseline gap-3">
                                <span className="text-point text-[22px]">{entry.room}</span> {entry.teacher}
                            </span>
                            <span className="text-16 font-medium text-[#475569]">
                                {entry.subject}
                                {entry.group && <span className="ml-1 font-regular text-gray-4">{entry.group}</span>}
                            </span>
                        </div>
                        {badge && (
                            <span
                                className={[
                                    'shrink-0 rounded px-2 py-1 font-pretendard text-xs font-medium',
                                    statusBadgeClass[entry.status],
                                ].join(' ')}
                            >
                                {badge}
                            </span>
                        )}
                    </div>
                </div>

                <section className="flex-1 min-h-0 w-full flex flex-col px-4 py-5 pb-15  overflow-y-auto gap-5">
                    <div className="w-full flex-1 flex flex-col gap-4">
                        <CommonNotes />
                        {teacherSettingData ? (
                            <div className="w-full flex flex-col">
                                <TeacherSettingCard data={teacherSettingData} />
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-center h-20 text-gray-3">
                                세팅 정보가 없는 강사님입니다!
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <h3 className="text-16 font-bold text-gray-4">문구 복사 버튼</h3>
                        <div className="w-full grid gap-2 grid-cols-2 grid-rows-2">
                            <Button
                                size="sm"
                                label="입실 자료"
                                onClick={() => handleCopyClick(`${defaultComment} 입실자료입니다`)}
                            />
                            <Button
                                size="sm"
                                label="미입실자 명단"
                                onClick={() => handleCopyClick(`${defaultComment} 미입실자 명단입니다`)}
                            />
                            <Button
                                size="sm"
                                label="라이브러리 배부"
                                onClick={() => handleCopyClick(`${defaultComment} 미입실자 라이브러리 배부하겠습니다`)}
                            />
                            <Button
                                size="sm"
                                label="수업 종료"
                                onClick={() =>
                                    handleCopyClick(`${defaultComment} 수업 종료되어 학생들 라이브러리로 올라갑니다`)
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full text-gray-4 hover:bg-gray-1 transition-colors duration-150"
                    aria-label="닫기"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
