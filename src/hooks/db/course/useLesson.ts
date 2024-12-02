import { api } from "~/utils/api";

export default function useLesson(
  courseCode: string,
  moduleCode: string,
  moduleIndex: number,
) {
  const {
    data: lesson,
    isLoading: isLoadingLesson,
    isError: isErrorLesson,
    error: errorLesson,
    refetch: refetchLesson,
  } = api.lesson.getLesson.useQuery({
    courseCode,
    moduleCode,
    moduleIndex
  });

  return { lesson, isLoadingLesson, isErrorLesson, errorLesson, refetchLesson };
}
