
interface TextInputComponentProps {
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string;
    type?: string;
}

export const TextInputComponent = (props: TextInputComponentProps) => {

    const { placeholder, value, onChange, className, label, type = "text" } = props;

    return (
        <div className="flex flex-col items-start w-full mb-4">
            {label && <label className="text-white mb-2 text-[13px] font-semibold">{label}</label>}
            <input
                type={type}
                className={`h-[54px] w-full rounded-2xl border bg-[#262626] border-[#343434] pl-4 text-[13px] placeholder:text-[#6C6C6C] text-white ${className || ''}`}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value || '')}
                value={value}
            />
        </div>
    )
}
