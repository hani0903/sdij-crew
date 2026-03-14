interface FormFieldProps {
    label: string;
    children: React.ReactNode;
    className?: string;
    /** label의 for 속성 — 연결할 input의 id와 동일하게 지정하면 클릭 시 포커스 이동 */
    htmlFor?: string;
}

/** 라벨 + 입력 필드 묶음 — 설정 화면 폼에서 공통으로 사용 */
export default function FormField({ label, children, className, htmlFor }: FormFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
            <label htmlFor={htmlFor} className="text-sm font-medium text-gray-4">
                {label}
            </label>
            {children}
        </div>
    );
}
