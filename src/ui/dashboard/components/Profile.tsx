import { useSession } from "next-auth/react";

export function Profile() {
  const { data: sessionData } = useSession();
  return (
    <div className="explore-course-bar flex justify-start px-10">
      <div className="category grid grid-cols-2 items-center gap-4">
        <div className="flex max-w-fit justify-center">
          <img
            src={
              sessionData?.user.image ?? `images/site/view-3d-businessman.png`
            }
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
        <div>
          <h3>{sessionData?.user.name}</h3>
        </div>
      </div>
    </div>
  );
}
