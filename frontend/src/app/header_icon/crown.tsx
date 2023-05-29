import Image from 'next/image';

const Crown = () => {
    return (
        <span className='icon-container'>
            <Image className='icon' src="/crown.png" alt="gear" width={24} height={24}/>
        </span>
    );
};
export default Crown;
