import Logout from '../auth/Logout';

function Home() {
  return (
    <>
      <h1>Welcome! You are logged in.</h1>
      <header className="bg-white dark:bg-gray-800 text-black dark:text-white">
        <h1>Hello Theme</h1>
      </header>
      <Logout />
    </>
  )

}

export default Home;