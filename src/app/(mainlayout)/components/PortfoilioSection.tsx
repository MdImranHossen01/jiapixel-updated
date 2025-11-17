import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const PortfolioSection = () => {
    return (
        <div className='container py-16 px-4  mx-auto'>
            {/* Left side content */}
            <div className='flex flex-col justify-center space-y-6 md:space-y-8 h-[600px]'>
              
                {/* Heading */}
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight'>
                    Our Creative
                    <span className='text-primary block'>Masterpieces</span>
                </h2>

                {/* Description */}
                <p className='text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg'>
                    Discover our curated collection of stunning projects that showcase 
                    innovation, creativity, and technical excellence. Each piece tells 
                    a unique story of collaboration and success.
                </p>

             

                {/* Features list */}
                <div className='space-y-3'>
                    <div className='flex items-center gap-3'>
                        <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                        <span className='text-foreground'>Custom tailored solutions</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                        <span className='text-foreground'>Modern technology stack</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                        <span className='text-foreground'>SEO optimized performance</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <CheckCircle className='w-5 h-5 text-primary flex-shrink-0' />
                        <span className='text-foreground'>Ongoing support & maintenance</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                    <Button className='px-8 py-3 text-lg rounded-lg font-semibold'>
                        View All Projects
                        <ArrowRight className='w-5 h-5 ml-2' />
                    </Button>
                    <Button variant='outline' className='px-8 py-3 text-lg rounded-lg font-semibold'>
                        Get Started
                    </Button>
                </div>

               
            </div>

          
        </div>
    );
};

export default PortfolioSection;