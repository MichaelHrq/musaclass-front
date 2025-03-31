export default function InputField({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-2">
            {children}
        </div>
    );
}