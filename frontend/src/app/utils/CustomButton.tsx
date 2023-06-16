interface CustomButtonProps {
    text: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text }) => {
    return (
        <div>
            <button className="login-button bg-background-grey text-background-dark-grey">
                { text }
            </button>
        </div>
    );
};

export default CustomButton;
