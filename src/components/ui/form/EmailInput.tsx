import { forwardRef, useMemo, useState, type InputHTMLAttributes } from 'react';
import Input from '../Input/Input';

const FREQUENCY_EMAIL_DOMAINS = [
    'naver.com',
    'gmail.com',
    'daum.net',
    'hanmail.net',
    'yahoo.com',
    'outlook.com',
    'nate.com',
    'kakao.com',
] as const;

interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    className?: string;
    value?: string; // "localPart@domain" 형태의 전체 이메일
    onChange?: (email: string) => void;
}

const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
    ({ className, value = '', onChange, ...props }, ref) => {
        const [emailLocal, setEmailLocal] = useState(() => value.split('@')[0] ?? '');
        const [emailDomain, setEmailDomain] = useState(() => value.split('@')[1] ?? '');

        const domainSuggestions = useMemo(() => {
            if (!emailDomain) return [...FREQUENCY_EMAIL_DOMAINS];
            return FREQUENCY_EMAIL_DOMAINS.filter((domain) => domain.startsWith(emailDomain));
        }, [emailDomain]);

        const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newLocal = e.target.value;
            setEmailLocal(newLocal);
            onChange?.(`${newLocal}@${emailDomain}`);
        };

        const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newDomain = e.target.value;
            setEmailDomain(newDomain);
            onChange?.(`${emailLocal}@${newDomain}`);
        };

        return (
            <div className={`w-full flex items-center gap-2 ${className ?? ''}`}>
                {/* 로컬 파트 */}
                <Input
                    {...props}
                    ref={ref}
                    id="email-local"
                    type="text"
                    className="flex-1"
                    value={emailLocal}
                    onChange={handleLocalChange}
                    placeholder="아이디"
                    autoComplete="off"
                />

                <span className="text-gray-500 shrink-0">@</span>

                {/* 도메인 파트 */}
                <Input
                    id="email-domain"
                    type="text"
                    className="flex-1"
                    list="email-domain-suggestions"
                    value={emailDomain}
                    onChange={handleDomainChange}
                    placeholder="도메인 선택 또는 입력"
                    autoComplete="off"
                />
                <datalist id="email-domain-suggestions">
                    {domainSuggestions.map((domain) => (
                        <option value={domain} key={domain} />
                    ))}
                </datalist>
            </div>
        );
    },
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;
