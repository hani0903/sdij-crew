const COMMON_NOTES = [
    { id: 1, label: '마이크 커버', value: '매 교시마다 교체' },
    { id: 2, label: '마이크 배터리', value: '1교시 전, 2/4 교시 종료 후 교체 (2칸 이하 즉시 교체)' },
    { id: 3, label: '기본 분필', value: '흰2, 빨1, 노1, 파1' },
    { id: 4, label: '기본 지우개', value: '4개' },
];

export default function CommonNotes() {
    return (
        <article className="w-full p-4 rounded-lg border-1 border-gray-2 shadow-sm">
            <h3 className="text-16 font-semibold mb-3 flex items-center gap-1">
                <span>❗</span> 공통 참고사항
            </h3>

            <dl className="space-y-2 text-14 leading-relaxed break-keep">
                {COMMON_NOTES.map((note) => (
                    <div key={note.id} className="flex gap-2">
                        <dt className="font-bold text-gray-700 shrink-0 after:content-[':']">{note.label}</dt>
                        <dd className="text-gray-600">{note.value}</dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}
