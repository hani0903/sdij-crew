import Modal from '@/components/ui/Modal';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useExtractClassSessions } from '@/hooks/queries/use-extract-class-sessions';
import type { ExtractedClassSession } from '@/types/schedule/classSession.type';
import { ImageIcon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/libs/cn';

// ─── 타입 ──────────────────────────────────────────────────────────────────

interface Props {
    isOpen: boolean;
    onClose: () => void;
    /** 추출 성공 시 부모(TimeTableAddModal)에 결과 전달 */
    onExtracted: (sessions: ExtractedClassSession[]) => void;
}

// ─── 컴포넌트 ───────────────────────────────────────────────────────────────

export default function ImageScanModal({ isOpen, onClose, onExtracted }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate: extract, isPending } = useExtractClassSessions();

    // ── 핸들러 ─────────────────────────────────────────────────────────────

    const handleFileChange = (file: File | null) => {
        if (!file) return;

        // 이전 미리보기 URL 메모리 해제
        if (previewUrl) URL.revokeObjectURL(previewUrl);

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] ?? null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files[0] ?? null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    /** 모달 닫힘 시 상태 초기화 */
    const handleClose = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
    };

    /** 이미지 전송 → 추출 결과를 부모에 전달 후 모달 닫기 */
    const handleSubmit = () => {
        if (!selectedFile) return;

        extract(selectedFile, {
            onSuccess: (sessions) => {
                toast.success(`${sessions.length}개 수업을 추출했어요.`);
                onExtracted(sessions);
                handleClose();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    // ── 렌더 ───────────────────────────────────────────────────────────────

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="사진 스캔하기" size="sm">
            <div className="flex flex-col gap-5 p-5">
                {/* 드래그&드롭 / 클릭 업로드 영역 */}
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="이미지 파일 선택"
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={cn(
                        'relative flex flex-col items-center justify-center gap-3',
                        'rounded-xl border-2 border-dashed border-gray-2',
                        'cursor-pointer transition-colors hover:border-point/60 hover:bg-gray-1/50',
                        previewUrl ? 'min-h-52 p-2' : 'min-h-44 p-6',
                    )}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="업로드 미리보기"
                            className="w-full rounded-lg object-contain max-h-64"
                        />
                    ) : (
                        <>
                            <ImageIcon size={36} className="text-gray-3" />
                            <div className="flex flex-col items-center gap-1 text-center">
                                <p className="text-sm font-medium text-gray-5">사진을 드래그하거나 클릭해 선택하세요</p>
                                <p className="text-xs text-gray-3">JPG, PNG, WEBP 지원</p>
                            </div>
                        </>
                    )}
                </div>

                {/* hidden input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInputChange}
                />

                {/* 파일명 표시 */}
                {selectedFile && (
                    <p className="text-xs text-gray-4 truncate text-center">
                        {selectedFile.name}
                    </p>
                )}

                {/* 제출 버튼 */}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center gap-2"
                    disabled={!selectedFile || isPending}
                    onClick={handleSubmit}
                >
                    <UploadIcon size={16} />
                    {isPending ? '분석 중...' : '수업 추출하기'}
                </Button>
            </div>
        </Modal>
    );
}
