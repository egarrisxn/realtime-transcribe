import Landing from "./components/landing";
import Header from "./components/header";
import Footer from "./components/footer";

export default function Home() {
  return (
    <div className='size-full bg-radial-[at_50%_50%] from-slate-100 via-slate-50 to-background to-100% font-sans antialiased dark:from-slate-900/90 dark:via-slate-950'>
      <Header />
      <Landing />
      <Footer />
    </div>
  );
}
