import { useState } from 'react';
import { Combobox } from '@/components/ui/Combobox';
import { useTeacherSearch } from '@/hooks/queries/use-teacher-search';
import type { Teacher } from '@/types/teacher/teacher.type';

interface TeacherComboboxProps {
    /** 강사 선택 시 호출되는 콜백 */
    onSelect?: (teacher: Teacher) => void;
    /** 외부에서 선생님 이름을 주입할 때 사용 (AI 추출 결과 등) */
    value?: string;
    className?: string;
}

export default function TeacherCombobox({ onSelect, value, className }: TeacherComboboxProps) {
    const [query, setQuery] = useState('');
    const { data: teachers, isLoading, isError } = useTeacherSearch(query);

    return (
        <Combobox
            items={teachers}
            isLoading={isLoading}
            isError={isError}
            getItemKey={(t) => t.id}
            getItemLabel={(t) => t.name}
            onSelect={onSelect ?? (() => {})}
            onQueryChange={setQuery}
            value={value}
            placeholder="선생님 이름 검색"
            aria-label="선생님 이름 검색"
            className={className}
        />
    );
}
