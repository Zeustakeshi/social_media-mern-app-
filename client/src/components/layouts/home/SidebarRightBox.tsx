interface ISidebarRightBoxProps {
    title: string;
    children: React.ReactNode;
}

const SidebarRightBox: React.FC<ISidebarRightBoxProps> = ({
    children,
    title,
}) => {
    return (
        <div className="w-full rounded-lg bg-white shadow-lg my-3 p-3">
            <h4 className="p-4 font-medium text-sm text-gray-400">{title}</h4>
            {children}
        </div>
    );
};

export default SidebarRightBox;
