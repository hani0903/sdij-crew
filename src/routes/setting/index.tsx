import TimeTableTab from '@/components/setting/time-table/TimeTableTab';
import { SegmentedControl } from '@/components/ui/SegmentControl';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/setting/')({
    component: RouteComponent,
});

const TAB_OPTIONS = [
    { label: '시간표', value: 'time-table' as const },
    { label: '선생님', value: 'teachers' as const },
    { label: '크루', value: 'crew' as const },
];

type SettingTabs = (typeof TAB_OPTIONS)[number]['value'];

function RouteComponent() {
    const [selectedTab, setSelectedTab] = useState<SettingTabs>('time-table');

    return (
        <div className="relative w-full h-full flex flex-col p-4 text-gray-3 gap-4">
            <SegmentedControl
                options={TAB_OPTIONS}
                selectedValue={selectedTab}
                onChange={(value) => setSelectedTab(value)}
            />
            {selectedTab === 'time-table' && <TimeTableTab />}
            {selectedTab === 'teachers' && <TimeTableTab />}
        </div>
    );
}
