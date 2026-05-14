import React from 'react';

interface Props {
    status: number;
    description: string;
}

const LoanStatusBadge: React.FC<Props> = ({ status, description }) => {
    const getStatusClass = (status: number) => {
        switch (status) {
            case 1: return 'status-active';
            case 2: return 'status-returned';
            case 3: return 'status-overdue';
            case 4: return 'status-pending';
            case 6: return 'status-lost';
            default: return 'status-default';
        }
    };

    return (
        <span className={`loan-status-badge ${getStatusClass(status)}`}>
            {description}
        </span>
    );
};

export default LoanStatusBadge;
