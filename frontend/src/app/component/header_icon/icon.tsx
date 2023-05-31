import Image from 'next/image';

interface IconProps {
  filePath: string;
}
const Icon = ( { filePath } : IconProps) => {
  return (
    <span className='icon-container'>
        <Image src={ filePath } alt="gear" width={40} height={40}/>
    </span>
  )
}

export default Icon;
