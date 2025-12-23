'use client'

import './free-ticket-button.css';

interface FreeTicketButtonProps {
    onClick?: () => void;
    className?: string;
}

const FreeTicketButton = (props: FreeTicketButtonProps) => {
    const { onClick, className } = props;

    return (
        <button
            className={`free-ticket-button ${className || ''}`}
            onClick={onClick}
        >
            Free Ticket
        </button>
    );
};

export default FreeTicketButton;

