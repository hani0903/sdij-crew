// ─── 온보딩 페이지 ─────────────────────────────────────────────────────────────
//
// 역할: 최초 로그인 사용자가 서비스 이용에 필요한 프로필 정보를 입력하는 단계.
//
// 흐름:
//   OAuth 로그인 → isOnboarded: false → 이 페이지 → 완료 → redirectAfterLogin 경로
//
// 백 버튼 처리:
//   - AuthGuard에서 authenticated + !isOnboarded 조건으로 /onboarding 이외 경로 차단.
//   - 뒤로가기 시 이전 페이지로 갔다가 즉시 이 페이지로 replace 이동됨.
//   - replace: true 사용으로 히스토리 스택이 쌓이지 않아 무한 증가 없음.

import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input/Input';
import { RadioCardGroup, type RadioCardOption } from '@/components/ui/RadioCardGroup';
import { useOnboarding } from '@/hooks/queries/me/use-onboarding';
import type { CrewType } from '@/types/me/me.type';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

type OnboardingFormType = {
    name: string;
    crewType: CrewType | undefined;
};

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const CREW_TYPE_OPTIONS: RadioCardOption<CrewType>[] = [
    { value: 'PREPARING', label: '준비반', description: '오전 07:00 ~ 15:00', icon: '📚' },
    { value: 'MORNING', label: '오전반', description: '오전 7:30 ~ 15:30', icon: '☀️' },
    { value: 'MIDDLE', label: '점심반', description: '오전 9:00 ~ 17:00', icon: '🌤️' },
    { value: 'AFTERNOON', label: '오후반', description: '오후 14:30 ~ 22:30', icon: '🌇' },
    { value: 'TEST', label: '시험반', description: '시험 대비 집중 과정', icon: '✏️' },
];

const INITIAL_FORM = { name: '', crewType: undefined };
// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
    const { mutate: submitOnboarding, isPending } = useOnboarding();
    const [formData, setFormData] = useState<OnboardingFormType>({ ...INITIAL_FORM });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!formData.crewType) return;

        submitOnboarding({ name: formData.name, crewType: formData.crewType });
    };

    const isValid = formData.name.trim().length > 0 && formData.crewType !== undefined;

    return (
        <div className="w-full h-full flex flex-col items-center justify-start flex-1 px-6 py-12">
            <div className="w-full max-w-md flex flex-col gap-8">
                {/* 환영 메시지 */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-black">시인스에 오신 걸 환영해요!</h1>
                    <p className="text-sm text-gray-500">서비스 이용을 위해 기본 정보를 입력해 주세요.</p>
                </div>

                {/* 온보딩 폼 */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <FormField label="이름">
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                    </FormField>

                    <RadioCardGroup
                        legend="근무 시간"
                        name="crewType"
                        value={formData.crewType}
                        onChange={(crewType) => setFormData((prev) => ({ ...prev, crewType }))}
                        options={CREW_TYPE_OPTIONS.filter((type) => type.value !== 'TEST')}
                    />

                    <Button type="submit" disabled={!isValid || isPending} className="w-full">
                        {isPending ? '처리 중...' : '시작하기'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
