import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function useLearnerSavedCourses() {
  const { data: sessionData } = useSession();
  const {
    data: savedCourses,
    isLoading,
    isError,
  } = api.learner.getSavedCoursesByLearner.useQuery({
    learnerId: sessionData?.user.learnerId ?? "",
  });

  const [courseInfos, setCourseInfos] = useState<
    { courseCode: string; title: string }[] | undefined
  >(undefined);

  useEffect(() => {
    if (savedCourses) {
      const _sc = savedCourses.map((c) => ({
        courseCode: c.courseCode,
        title: c.title,
      }));
      setCourseInfos(_sc);
    }
  }, [savedCourses]);

  return {
    savedCourses: savedCourses,
    courseInfos,
    isLoading,
    isError,
  };
}
