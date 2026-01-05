import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
  mainText?: string;
  subText?: string;
  mainTextClassName?: string;
  subTextClassName?: string;
  className?: string;
}

const Logo = ({
  href = "/",
  src = "/Jia-Pixel-Logo.svg",
  alt = "Jia Pixel Logo",
  width = 30,
  height = 30,
  imageClassName = "",
  textClassName = "",
  showText = true,
  mainText = "JIA",
  subText = "Pixel",
  mainTextClassName = "",
  subTextClassName = "",
  className = ""
}: LogoProps) => {
  return (
    <Link href={href} className={`md:flex-1 md:flex md:justify-start ${className}`}>
      <div className="flex items-center space-x-1 justify-center md:justify-start">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`text-yellow-700 ${imageClassName}`}
        />
        {showText && (
          <div className={`text-2xl font-bold tracking-tight text-primary ${textClassName}`}>
            <span className={`text-3xl font-extrabold ${mainTextClassName}`}>{mainText}</span>
            <span className={`ml-1 text-base text-foreground ${subTextClassName}`}>{subText}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default Logo;