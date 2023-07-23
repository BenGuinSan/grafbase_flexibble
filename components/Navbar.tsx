import Link from 'next/link';
import Image from 'next/image';
import { NavLinks } from '@/constant';
import AuthProviders from './AuthProviders';
import { getCurrentUser } from '@/lib/session';

const Navbar =  async () => {
  const session =  await getCurrentUser();

  return (
    <nav className="flexBetween navbar">
        <div className="flex-1 flexStart gap-10">   
            <Link href='/'>
                <Image src='/logo.svg' alt="Flexibble" width={115} height={43}/>
            </Link>
            <ul className='xl:flex hidden text-small gap-7'>
              {NavLinks.map((link) => (
                <Link href={link.href} key={link.key}>
                  {link.text}
                </Link>
              ))}
            </ul>
        </div>
        <div className='flexCenter gap-4'>
              {
                session?.user ? (
                  <>
                    {/* UserPhoto */}
                    {session?.user?.image && (
                      <Image 
                        src={session.user.image}
                        height={40}
                        width={40}
                        className='rounded-full'
                        alt={session.user.name}
                      />)}
                    <Link href="./create-project">
                      ShareWork
                    </Link>
                  </>
                ) : (
                  <AuthProviders />
              )}
        </div>
    </nav>
  )
}

export default Navbar