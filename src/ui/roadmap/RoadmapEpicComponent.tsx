import { Badge } from "~/components/ui/badge";
import { type Roadmap, type Epic } from "~/data/roadmap"

// TODO: Set color based on status
// Represent the quarter or date in a helpful way

export default function RoadmapEpicComponent({
  epic,
  key,
}: {
  epic: Epic;
  key: number;
}) {
  let statusMessage = "";
  let dotColor = "bg-black";
  let borderColor = "border-l-black";
  switch (epic.status) {
    case "planned":
      statusMessage = "Planning";
      dotColor = "bg-blue-400";
      borderColor = "border-blue-800";
      break;
    case "inProgress":
      statusMessage = "Current";
      dotColor = "bg-orange-400";
      borderColor = "border-orange-800";
      break;
    case "proposed":
      statusMessage = "Proposal";
      dotColor = "bg-purple-400";
      borderColor = "border-purple-400";
      break;
    case "complete":
      statusMessage = "Complete";
      dotColor = "bg-green-400";
      borderColor = "border-green-400";
      break;
      borderColor = "bg-blue-400";
    default:
      break;
  }
  return (
    <>
      <div
        key={key}
        className="col-span-1 mx-auto my-5 flex flex-row items-center"
      >
        <div className="hidden text-center font-beckman text-2xl md:block">
          Q{epic.quarter}
        </div>
      </div>
      <div
        key={key}
        className="mx-auto my-5 flex w-full flex-row items-center justify-between md:col-span-5"
      >
        <div
          className={`mr-4 mt-1 h-4 w-4 flex-shrink-0 rounded-full ${dotColor}`}
        ></div>
        <div
          className={`flex w-full flex-col border-l-2 ${borderColor} pl-8 text-sm`}
        >
          <div className="font-beckman text-lg">{epic.name}</div>
          <p className="w-11/12">{epic.description}</p>
        </div>
        <Badge variant={epic.status} className="hidden md:block">
          {statusMessage}
        </Badge>
      </div>
      <Badge variant={epic.status} className="block md:hidden">
        {statusMessage}
      </Badge>
    </>
  );
}
