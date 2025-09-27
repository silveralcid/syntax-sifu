import MonacoEditor from "@/components/features/editor/MonacoEditor";

export default function GridLayout() {
  return (
    <div className="grid grid-cols-10 grid-rows-9 gap-4 h-screen w-full p-4">
      <div className="card col-span-2">
        <div className="card-body flex items-center justify-center">1</div>
      </div>
      <div className="card col-span-2 col-start-3">
        <div className="card-body flex items-center justify-center">2</div>
      </div>
      <div className="card col-span-4 row-span-4 col-start-1 row-start-2">
        <div className="card-body flex items-center justify-center">3</div>
      </div>
      <div className="card col-span-4 row-span-4 col-start-1 row-start-6">
        <div className="card-body flex items-center justify-center">4</div>
      </div>
      <div className="card col-start-5 row-start-1">
        <div className="card-body flex items-center justify-center">5</div>
      </div>
      <div className="card col-span-5 col-start-6 row-start-1">
        <div className="card-body flex items-center justify-center">6</div>
      </div>
      <div className="card col-span-6 row-span-8 col-start-5 row-start-2">
        <div className="card-body flex items-center justify-center">
          <MonacoEditor />
        </div>
      </div>
    </div>
  );
}