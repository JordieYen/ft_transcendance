interface CustomButtonProps {
    text: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ text }) => {
    return (
        <div>
            <button className="login-button text-background-dark-grey bg-mygrey rounded-md px-2 py-1">
                { text }
            </button>
        </div>
    );
};

export default CustomButton;
