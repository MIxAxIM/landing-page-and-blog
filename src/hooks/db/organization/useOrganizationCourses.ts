import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const useOrganizationCourses = (organizationId: string) => {
  const { data: courses, isLoading } = api.organizationCourse.getCourses.useQuery(
    organizationId
  );
  const { toast } = useToast();
  const utils = api.useUtils();

  const addCourse = api.organizationCourse.addCourse.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course added successfully",
      });
      void utils.organizationCourse.getCourses.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeCourse = api.organizationCourse.removeCourse.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Course removed successfully",
      });
      void utils.organizationCourse.getCourses.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addMultipleCourses = api.organizationCourse.addMultipleCourses.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Courses added successfully",
      });
      void utils.organizationCourse.getCourses.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    courses,
    isLoading,
    addCourse,
    removeCourse,
    addMultipleCourses,
  };
};
