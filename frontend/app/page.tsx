export default function Home() {
  return (
    <main className="">
      <div className="flex items-center justify-center min-h-screen">
        <div className="grid grid-cols-5 grid-rows-5 gap-4 w-screen h-screen max-w-6xl max-h-[90vh]">
          <div className="col-span-2 row-span-4 bg-red-300 flex items-center justify-center">
            1
          </div>
          <div className="col-span-3 row-span-5 col-start-3 bg-green-300 flex items-center justify-center">
            2
          </div>
          <div className="col-span-2 row-start-5 bg-blue-300 flex items-center justify-center">
            3
          </div>
        </div>
      </div>
    </main>
  );
}
