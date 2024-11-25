import { type Session } from "next-auth";
import { api } from "~/utils/api";

export default function useValidateCreator(
  sessionData: Session | null,
  courseCode?: string,
) {
  if (!courseCode) {
    const userId = sessionData?.user.id;

    const { data: user, isLoading: isValidatingCreator } =
      api.user.getUserById.useQuery({ id: userId ? userId : "" }, { enabled: !!userId });

    if (user?.creator) {
      return { isCreator: true, isValidatingCreator: isValidatingCreator };
    } else {
      return { isCreator: false, isValidatingCreator: isValidatingCreator };
    }
  } else {
    const { data: ownerCourses, isLoading: isValidatingCreator } =
      api.course.getCoursesByOwner.useQuery(undefined, {
        enabled: sessionData != null,
      });

    const courseFound = ownerCourses?.find(
      (course) => course.courseCode === courseCode,
    );

    if (courseFound) {
      return { isCreator: true, isValidatingCreator };
    } else {
      return { isCreator: false, isValidatingCreator };
    }
  }
}
