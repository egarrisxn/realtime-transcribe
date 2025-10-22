import Transcription from "@/app/components/transcription";

export default function Home() {
  return (
    <>
      <div className='h-full overflow-hidden'>
        <main className='mx-auto h-full bg-[url(/bg.svg)] bg-cover bg-fixed bg-center bg-no-repeat px-4 md:px-6 lg:px-8'>
          <Transcription />
        </main>
      </div>
    </>
  );
}
