import Image from 'next/image';

const Crown = () => {
    return (
        <span className='icon-container'>
            <Image className='icon' src="/crown.png" alt="gear" width={40} height={40}/>
        </span>
    );
};
export default Crown;
