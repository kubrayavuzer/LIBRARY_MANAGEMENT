const Home = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 relative'>
      {/* Gradient overlay background */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/40 to-purple-600/40 z-0' />

      {/* Background image with blur effect */}
      <div
        className="absolute inset-0 bg-[url('https://images2.alphacoders.com/261/thumb-1920-26102.jpg')] 
                   bg-cover bg-center bg-no-repeat  z-[-1]"
      />

      {/* Content - width changed to max-w-[1200px] */}
      <div className='z-30 text-center w-full h-full max-w-[1200px] mx-auto bg-white/90 p-12 rounded-xl shadow-2xl backdrop-blur-sm'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent  h-12 z-50'>
          Library Management System
        </h1>
        <p className='text-xl text-gray-700  leading-relaxed'>
          Welcome to our comprehensive library management platform. Efficiently
          manage your books, authors, and categories all in one place.
        </p>
        <div className='mt-8 space-y-4'>
          <p className='text-gray-600'>Explore our features to:</p>
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <span className='px-4 py-2 bg-blue-100 text-blue-700 rounded-full'>
              Manage Books
            </span>
            <span className='px-4 py-2 bg-purple-100 text-purple-700 rounded-full'>
              Track Authors
            </span>
            <span className='px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full'>
              Organize Categories
            </span>
            <span className='px-4 py-2 bg-pink-100 text-pink-700 rounded-full'>
              Handle Borrowings
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
