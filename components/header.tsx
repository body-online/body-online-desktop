// 'use client'

// import { ExtendedUser } from '@/next-auth';
// import React from 'react'
// import { UserIcon } from './ui/icons';
// import Image from 'next/image';

// const Head = ({ user }: { user?: ExtendedUser }) => {

//   return (
//     <>
//       <div className='relative flex justify-center h-[180px] md:h-[280px] overflow-hidden'>

//         <div className="container px-default py-6 space-y-8 relative z-10 h-min">
//           <div className="flex-between w-full">

//             <div>
//               <p className='text-white text-lg lg:text-2xl'>
//                 Bienvenido <span className="text-clime">{user?.name}</span>
//               </p>
//               <p
//                 className='text-white opacity-90 text-ligth text-sm'>
//                 {new Date().toLocaleDateString("es-AR", { day: 'numeric', month: 'long', year: 'numeric' })}
//               </p>
//             </div>

//             <button
//               className=""
//             // onClick={() => {
//             //   setToggleDropdown(!toggleDropdown);
//             // }}
//             >
//               <ProfileImage url={user?.image} />
//             </button>
//           </div>
//         </div>

//         {/* background */}
//         <div className="absolute bottom-0 rounded-[100%] h-[170%] w-[130vw] md:w-[110vw]
         
//         bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))]
//           from-cgreen via-cgreen/95 to-cgreen/30 bg-caqua
//         " />
//       </div >

//       <div className="px-default pt-6 -mt-[110px] md:-mt-[200px] z-20 container mb-6">
//         <div className="relative min-h-60 card px-4 md:px-5 py-6">
//           <p className="title">Accesos directos</p>


//         </div>
//       </div>
//     </>
//   )
// }

// export default Head

// const ProfileImage = ({ url }: { url: ExtendedUser['image'] }) => {
//   return (
//     <div className="relative rounded-full overflow-hidden p-2 bg-white dark:bg-slate-950 border-2 border-white">
//       {!url ?
//         <div className="flex-center"><UserIcon /></div>
//         :
//         <Image
//           height={100}
//           width={100}
//           src={url}
//           alt="profile"
//         />
//       }
//     </div>
//   );
// };