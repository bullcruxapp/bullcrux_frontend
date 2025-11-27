
interface TextInputComponentProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string;
}

export const TextInputComponent = (props: TextInputComponentProps) => {

    const { placeholder, value, onChange, className, label } = props;

    return (
        <div className="flex flex-col items-start">
            {label && <label>{label}</label>}
            <input
                type="text"
                className={className}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value || '')}
                value={value}
            />
        </div>
    )
}
